import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
  getDoc,
  setDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore'
import { getAnalytics, logEvent } from 'firebase/analytics'

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyDrAsh4pLbCebHSogupG8daABhRYdI2prk",
  authDomain: "forbidden-beauty.firebaseapp.com",
  databaseURL: "https://forbidden-beauty-default-rtdb.firebaseio.com",
  projectId: "forbidden-beauty",
  storageBucket: "forbidden-beauty.firebasestorage.app",
  messagingSenderId: "648798597728",
  appId: "1:648798597728:web:b4a446788abf83ea518905",
  measurementId: "G-YGWRFWMNK3"
}

// 初始化 Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// Analytics
let analytics: ReturnType<typeof getAnalytics> | null = null
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app)
  } catch (e) {
    console.log('Analytics 未啟用')
  }
}

// 追蹤類型定義
export interface VisitorData {
  timestamp: ReturnType<typeof serverTimestamp>
  userAgent: string
  referrer: string
  screenWidth: number
  screenHeight: number
  language: string
  path: string
  searchKeyword?: string
  searchEngine?: string  // 來源搜尋引擎
  isFromSearch?: boolean // 是否從搜尋引擎來
}

// 判斷是否從搜尋引擎來的
const detectSearchEngine = (referrer: string): { isFromSearch: boolean; searchEngine: string | undefined } => {
  const searchEngines = [
    { name: 'Google', patterns: ['google.com', 'google.com.tw'] },
    { name: 'Bing', patterns: ['bing.com'] },
    { name: 'Yahoo', patterns: ['yahoo.com', 'search.yahoo.com'] },
    { name: 'DuckDuckGo', patterns: ['duckduckgo.com'] },
    { name: 'Baidu', patterns: ['baidu.com'] },
  ]

  for (const engine of searchEngines) {
    for (const pattern of engine.patterns) {
      if (referrer.includes(pattern)) {
        return { isFromSearch: true, searchEngine: engine.name }
      }
    }
  }

  return { isFromSearch: false, searchEngine: undefined }
}

export interface ButtonClickData {
  timestamp: ReturnType<typeof serverTimestamp>
  buttonId: string
  buttonName: string
  planPrice?: number
  section?: string
}

// 記錄訪客
export const trackVisitor = async () => {

  try {
    // 從 URL 參數中提取搜尋關鍵字
    const urlParams = new URLSearchParams(window.location.search)
    const searchKeyword = urlParams.get('q') || urlParams.get('keyword') || urlParams.get('utm_term') || undefined

    // 偵測搜尋引擎來源
    const referrer = document.referrer || ''
    const { isFromSearch, searchEngine } = detectSearchEngine(referrer)

    // 建構 visitorData，排除 undefined 值（Firebase 不接受 undefined）
    const visitorData: Record<string, unknown> = {
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: referrer || 'direct',
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      path: window.location.pathname
    }

    // 只有在有值時才加入這些欄位
    if (searchKeyword) {
      visitorData.searchKeyword = searchKeyword
    }
    if (searchEngine) {
      visitorData.searchEngine = searchEngine
    }
    if (isFromSearch !== undefined) {
      visitorData.isFromSearch = isFromSearch
    }

    await addDoc(collection(db, 'visitors'), visitorData)

    // 更新訪客計數
    const statsRef = doc(db, 'stats', 'visitors')
    const statsDoc = await getDoc(statsRef)

    if (statsDoc.exists()) {
      await updateDoc(statsRef, {
        totalVisits: increment(1),
        lastVisit: serverTimestamp()
      })
    } else {
      await setDoc(statsRef, {
        totalVisits: 1,
        lastVisit: serverTimestamp()
      })
    }

    // 如果從搜尋引擎來的，記錄搜尋來源
    if (isFromSearch) {
      await addDoc(collection(db, 'searchVisitors'), {
        searchEngine,
        referrer,
        timestamp: serverTimestamp(),
        userAgent: navigator.userAgent,
        // 可能的搜尋關鍵字（用戶可能搜尋的詞）
        possibleKeywords: ['禁忌之美', '禁忌之美鍾佳播', '禁忌之美鍾佳播募資', '禁忌之美募資', '鍾佳播電影']
      })

      // 更新搜尋來源統計
      const searchStatsRef = doc(db, 'stats', 'searchVisitors')
      const searchStatsDoc = await getDoc(searchStatsRef)

      if (searchStatsDoc.exists()) {
        await updateDoc(searchStatsRef, {
          total: increment(1),
          [`from${searchEngine}`]: increment(1),
          lastVisit: serverTimestamp()
        })
      } else {
        await setDoc(searchStatsRef, {
          total: 1,
          [`from${searchEngine}`]: 1,
          lastVisit: serverTimestamp()
        })
      }

      console.log(`🔍 從 ${searchEngine} 搜尋來的訪客！`)
    }

    // 如果有搜尋關鍵字，單獨記錄
    if (searchKeyword) {
      await addDoc(collection(db, 'searchKeywords'), {
        keyword: searchKeyword,
        timestamp: serverTimestamp(),
        referrer: document.referrer
      })
    }

    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: window.location.pathname,
        page_title: document.title,
        search_keyword: searchKeyword,
        search_engine: searchEngine,
        is_from_search: isFromSearch
      })
    }

    console.log('訪客已記錄', isFromSearch ? `(來自 ${searchEngine} 搜尋)` : '')
  } catch (error) {
    console.error('記錄訪客失敗:', error)
  }
}

// 記錄按鈕點擊
export const trackButtonClick = async (buttonId: string, buttonName: string, planPrice?: number, section?: string) => {
  
  try {
    // 建構 clickData，排除 undefined 值（Firebase 不接受 undefined）
    const clickData: Record<string, unknown> = {
      timestamp: serverTimestamp(),
      buttonId,
      buttonName
    }

    // 只有在有值時才加入這些欄位
    if (planPrice !== undefined) {
      clickData.planPrice = planPrice
    }
    if (section) {
      clickData.section = section
    }

    await addDoc(collection(db, 'buttonClicks'), clickData)

    // 更新按鈕點擊計數
    const buttonStatsRef = doc(db, 'buttonStats', buttonId)
    const buttonStatsDoc = await getDoc(buttonStatsRef)

    if (buttonStatsDoc.exists()) {
      await updateDoc(buttonStatsRef, {
        clicks: increment(1),
        lastClick: serverTimestamp()
      })
    } else {
      await setDoc(buttonStatsRef, {
        buttonId,
        buttonName,
        clicks: 1,
        lastClick: serverTimestamp()
      })
    }

    if (analytics) {
      logEvent(analytics, 'button_click', {
        button_id: buttonId,
        button_name: buttonName,
        plan_price: planPrice,
        section
      })
    }

    console.log(`按鈕點擊已記錄: ${buttonName}`)
  } catch (error) {
    console.error('記錄按鈕點擊失敗:', error)
  }
}

// 記錄募資方案點擊
export const trackPlanClick = async (planName: string, planPrice: number) => {
  await trackButtonClick(`plan-${planPrice}`, planName, planPrice, 'funding-plans')
}

// 記錄社群分享點擊
export const trackShareClick = async (platform: string) => {
  await trackButtonClick(`share-${platform}`, `分享到 ${platform}`, undefined, 'social-share')
}

// ============ 留言區功能 ============

/**
 * 留言資料結構
 */
export interface Comment {
  id: string
  nickname: string
  content: string
  createdAt: Timestamp | null
}

/**
 * 新增留言到 Firestore
 * @param nickname - 留言者暱稱
 * @param content - 留言內容
 */
export const addComment = async (nickname: string, content: string): Promise<void> => {
  try {
    await addDoc(collection(db, 'comments'), {
      nickname: nickname.trim(),
      content: content.trim(),
      createdAt: serverTimestamp()
    })
    console.log('留言已新增')
  } catch (error) {
    console.error('新增留言失敗:', error)
    throw error
  }
}

/**
 * 訂閱留言更新（即時監聽）
 * 使用 onSnapshot 實現即時更新，當有新留言時自動觸發 callback
 * @param callback - 當留言更新時的回調函數
 * @returns 取消訂閱的函數（用於 cleanup）
 */
export const subscribeToComments = (
  callback: (comments: Comment[]) => void
): (() => void) => {
  const commentsRef = collection(db, 'comments')
  const q = query(commentsRef, orderBy('createdAt', 'desc'))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const comments: Comment[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      nickname: doc.data().nickname || '匿名',
      content: doc.data().content || '',
      createdAt: doc.data().createdAt as Timestamp | null
    }))
    callback(comments)
  }, (error) => {
    console.error('監聽留言失敗:', error)
  })

  return unsubscribe
}

// ============ 統計數據讀取 ============

/**
 * 訪客統計資料結構
 */
export interface VisitorStats {
  totalVisits: number
  lastVisit: Timestamp | null
}

/**
 * 按鈕統計資料結構
 */
export interface ButtonStats {
  buttonId: string
  buttonName: string
  clicks: number
  lastClick: Timestamp | null
}

/**
 * 取得訪客統計數據
 * @returns 訪客統計資料
 */
export const getVisitorStats = async (): Promise<VisitorStats> => {
  try {
    const statsRef = doc(db, 'stats', 'visitors')
    const statsDoc = await getDoc(statsRef)

    if (statsDoc.exists()) {
      const data = statsDoc.data()
      return {
        totalVisits: data.totalVisits || 0,
        lastVisit: data.lastVisit || null
      }
    }

    return { totalVisits: 0, lastVisit: null }
  } catch (error) {
    console.error('取得訪客統計失敗:', error)
    return { totalVisits: 0, lastVisit: null }
  }
}

/**
 * 取得特定按鈕的點擊統計
 * @param buttonId - 按鈕 ID
 * @returns 按鈕統計資料
 */
export const getButtonStats = async (buttonId: string): Promise<ButtonStats | null> => {
  try {
    const buttonStatsRef = doc(db, 'buttonStats', buttonId)
    const buttonStatsDoc = await getDoc(buttonStatsRef)

    if (buttonStatsDoc.exists()) {
      const data = buttonStatsDoc.data()
      return {
        buttonId: data.buttonId || buttonId,
        buttonName: data.buttonName || '',
        clicks: data.clicks || 0,
        lastClick: data.lastClick || null
      }
    }

    return null
  } catch (error) {
    console.error('取得按鈕統計失敗:', error)
    return null
  }
}

/**
 * 訂閱訪客統計更新（即時監聽）
 * @param callback - 當統計更新時的回調函數
 * @returns 取消訂閱的函數
 */
export const subscribeToVisitorStats = (
  callback: (stats: VisitorStats) => void
): (() => void) => {
  const statsRef = doc(db, 'stats', 'visitors')

  const unsubscribe = onSnapshot(statsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      callback({
        totalVisits: data.totalVisits || 0,
        lastVisit: data.lastVisit || null
      })
    } else {
      callback({ totalVisits: 0, lastVisit: null })
    }
  }, (error) => {
    console.error('監聽訪客統計失敗:', error)
  })

  return unsubscribe
}

/**
 * 訂閱按鈕統計更新（即時監聽）
 * @param buttonId - 按鈕 ID
 * @param callback - 當統計更新時的回調函數
 * @returns 取消訂閱的函數
 */
export const subscribeToButtonStats = (
  buttonId: string,
  callback: (stats: ButtonStats | null) => void
): (() => void) => {
  const buttonStatsRef = doc(db, 'buttonStats', buttonId)

  const unsubscribe = onSnapshot(buttonStatsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      callback({
        buttonId: data.buttonId || buttonId,
        buttonName: data.buttonName || '',
        clicks: data.clicks || 0,
        lastClick: data.lastClick || null
      })
    } else {
      callback(null)
    }
  }, (error) => {
    console.error('監聯按鈕統計失敗:', error)
  })

  return unsubscribe
}

// ============ 搜尋來源統計 ============

/**
 * 搜尋來源統計資料結構
 */
export interface SearchVisitorStats {
  total: number
  fromGoogle?: number
  fromBing?: number
  fromYahoo?: number
  fromDuckDuckGo?: number
  fromBaidu?: number
  lastVisit: Timestamp | null
}

/**
 * 訂閱搜尋來源統計更新（即時監聽）
 * @param callback - 當統計更新時的回調函數
 * @returns 取消訂閱的函數
 */
export const subscribeToSearchStats = (
  callback: (stats: SearchVisitorStats) => void
): (() => void) => {
  const searchStatsRef = doc(db, 'stats', 'searchVisitors')

  const unsubscribe = onSnapshot(searchStatsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      callback({
        total: data.total || 0,
        fromGoogle: data.fromGoogle || 0,
        fromBing: data.fromBing || 0,
        fromYahoo: data.fromYahoo || 0,
        fromDuckDuckGo: data.fromDuckDuckGo || 0,
        fromBaidu: data.fromBaidu || 0,
        lastVisit: data.lastVisit || null
      })
    } else {
      callback({
        total: 0,
        lastVisit: null
      })
    }
  }, (error) => {
    console.error('監聽搜尋統計失敗:', error)
  })

  return unsubscribe
}

// ============ 贊助者功能 ============

/**
 * 贊助者資料結構
 */
export interface Sponsor {
  id: string
  name: string
  planName: string
  planPrice: number
  createdAt: Timestamp | null
}

/**
 * 新增贊助者到 Firestore
 * 記錄贊助者的名字、方案名稱、方案價格和時間
 * @param name - 贊助者名字
 * @param planName - 方案名稱
 * @param planPrice - 方案價格
 */
export const addSponsor = async (
  name: string,
  planName: string,
  planPrice: number
): Promise<void> => {
  try {
    await addDoc(collection(db, 'sponsors'), {
      name: name.trim(),
      planName,
      planPrice,
      createdAt: serverTimestamp()
    })
    console.log('贊助者已新增:', name)

    // 更新贊助統計
    const sponsorStatsRef = doc(db, 'stats', 'sponsors')
    const sponsorStatsDoc = await getDoc(sponsorStatsRef)

    if (sponsorStatsDoc.exists()) {
      await updateDoc(sponsorStatsRef, {
        totalSponsors: increment(1),
        totalAmount: increment(planPrice),
        lastSponsor: serverTimestamp()
      })
    } else {
      await setDoc(sponsorStatsRef, {
        totalSponsors: 1,
        totalAmount: planPrice,
        lastSponsor: serverTimestamp()
      })
    }

    if (analytics) {
      logEvent(analytics, 'sponsor_added', {
        sponsor_name: name,
        plan_name: planName,
        plan_price: planPrice
      })
    }
  } catch (error) {
    console.error('新增贊助者失敗:', error)
    throw error
  }
}

/**
 * 訂閱贊助者列表更新（即時監聽）
 * 使用 onSnapshot 實現即時更新，當有新贊助者時自動觸發 callback
 * 按時間倒序排列
 * @param callback - 當贊助者列表更新時的回調函數
 * @returns 取消訂閱的函數（用於 cleanup）
 */
export const subscribeToSponsors = (
  callback: (sponsors: Sponsor[]) => void
): (() => void) => {
  const sponsorsRef = collection(db, 'sponsors')
  const q = query(sponsorsRef, orderBy('createdAt', 'asc'))

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const sponsors: Sponsor[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name || '匿名贊助者',
      planName: doc.data().planName || '',
      planPrice: doc.data().planPrice || 0,
      createdAt: doc.data().createdAt as Timestamp | null
    }))
    callback(sponsors)
  }, (error) => {
    console.error('監聽贊助者列表失敗:', error)
  })

  return unsubscribe
}

// ============ 捲動深度追蹤 ============

/**
 * 追蹤的區塊 ID
 */
const TRACKED_SECTIONS = [
  'hero',
  'project-info',
  'funding-plans',
  'sponsors',
  'faq',
  'comments',
  'risk',
  'refund',
  'contact',
  'info'
]

/**
 * 已追蹤的區塊（避免重複追蹤）
 */
const trackedSections = new Set<string>()

/**
 * 追蹤捲動深度
 * 記錄用戶看到了哪些區塊
 */
export const trackScrollDepth = async (sectionId: string) => {
  // 避免重複追蹤
  if (trackedSections.has(sectionId)) return
  trackedSections.add(sectionId)

  try {
    await addDoc(collection(db, 'scrollDepth'), {
      sectionId,
      timestamp: serverTimestamp(),
      sessionId: getSessionId()
    })

    // 更新區塊統計
    const sectionStatsRef = doc(db, 'sectionStats', sectionId)
    const sectionStatsDoc = await getDoc(sectionStatsRef)

    if (sectionStatsDoc.exists()) {
      await updateDoc(sectionStatsRef, {
        views: increment(1),
        lastView: serverTimestamp()
      })
    } else {
      await setDoc(sectionStatsRef, {
        sectionId,
        views: 1,
        lastView: serverTimestamp()
      })
    }

    if (analytics) {
      logEvent(analytics, 'scroll_depth', {
        section_id: sectionId
      })
    }
  } catch (error) {
    console.error('追蹤捲動深度失敗:', error)
  }
}

/**
 * 取得已追蹤的區塊列表
 */
export const getTrackedSections = () => TRACKED_SECTIONS

// ============ Session 追蹤 ============

/**
 * 取得或生成 Session ID
 */
export const getSessionId = (): string => {
  const SESSION_KEY = 'forbidden_beauty_session'
  let sessionId = sessionStorage.getItem(SESSION_KEY)

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem(SESSION_KEY, sessionId)
  }

  return sessionId
}

/**
 * 檢查是否為回訪訪客
 */
export const isReturningVisitor = (): boolean => {
  const VISITOR_KEY = 'forbidden_beauty_visitor'
  const hasVisited = localStorage.getItem(VISITOR_KEY)

  if (!hasVisited) {
    localStorage.setItem(VISITOR_KEY, new Date().toISOString())
    return false
  }

  return true
}

/**
 * 取得訪客類型
 */
export const getVisitorType = (): 'new' | 'returning' => {
  return isReturningVisitor() ? 'returning' : 'new'
}

// ============ 轉換漏斗追蹤 ============

/**
 * 漏斗步驟定義
 */
export type FunnelStep =
  | 'page_view'           // 進入頁面
  | 'scroll_to_plans'     // 看到方案區
  | 'click_plan'          // 點擊方案
  | 'open_modal'          // 打開感謝 Modal
  | 'submit_sponsor'      // 完成留名

/**
 * 追蹤漏斗步驟
 */
export const trackFunnelStep = async (step: FunnelStep, metadata?: Record<string, unknown>) => {
  try {
    const data: Record<string, unknown> = {
      step,
      timestamp: serverTimestamp(),
      sessionId: getSessionId(),
      visitorType: getVisitorType()
    }

    if (metadata) {
      Object.entries(metadata).forEach(([key, value]) => {
        if (value !== undefined) {
          data[key] = value
        }
      })
    }

    await addDoc(collection(db, 'funnel'), data)

    // 更新漏斗統計
    const funnelStatsRef = doc(db, 'stats', 'funnel')
    const funnelStatsDoc = await getDoc(funnelStatsRef)

    if (funnelStatsDoc.exists()) {
      await updateDoc(funnelStatsRef, {
        [step]: increment(1),
        lastUpdate: serverTimestamp()
      })
    } else {
      await setDoc(funnelStatsRef, {
        [step]: 1,
        lastUpdate: serverTimestamp()
      })
    }

    if (analytics) {
      logEvent(analytics, 'funnel_step', {
        step,
        ...metadata
      })
    }

    console.log(`漏斗步驟: ${step}`)
  } catch (error) {
    console.error('追蹤漏斗步驟失敗:', error)
  }
}

/**
 * 訂閱漏斗統計
 */
export const subscribeToFunnelStats = (
  callback: (stats: Record<string, number>) => void
): (() => void) => {
  const funnelStatsRef = doc(db, 'stats', 'funnel')

  const unsubscribe = onSnapshot(funnelStatsRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      callback({
        page_view: data.page_view || 0,
        scroll_to_plans: data.scroll_to_plans || 0,
        click_plan: data.click_plan || 0,
        open_modal: data.open_modal || 0,
        submit_sponsor: data.submit_sponsor || 0
      })
    } else {
      callback({
        page_view: 0,
        scroll_to_plans: 0,
        click_plan: 0,
        open_modal: 0,
        submit_sponsor: 0
      })
    }
  }, (error) => {
    console.error('監聽漏斗統計失敗:', error)
  })

  return unsubscribe
}

export { db, analytics }
