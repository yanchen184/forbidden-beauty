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

    const visitorData: VisitorData = {
      timestamp: serverTimestamp(),
      userAgent: navigator.userAgent,
      referrer: referrer || 'direct',
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      language: navigator.language,
      path: window.location.pathname,
      searchKeyword,
      searchEngine,
      isFromSearch
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
    const clickData: ButtonClickData = {
      timestamp: serverTimestamp(),
      buttonId,
      buttonName,
      planPrice,
      section
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

export { db, analytics }
