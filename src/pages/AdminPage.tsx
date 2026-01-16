import { useEffect, useState } from 'react'
import {
  subscribeToVisitorStats,
  subscribeToSearchStats,
  subscribeToSponsors,
  subscribeToComments,
  subscribeToFunnelStats,
  VisitorStats,
  SearchVisitorStats,
  Sponsor,
  Comment
} from '../firebase'
import { collection, query, orderBy, limit, onSnapshot, Timestamp, getDocs } from 'firebase/firestore'
import { db } from '../firebase'

interface SearchVisitor {
  id: string
  searchEngine: string
  referrer: string
  timestamp: Timestamp | null
  possibleKeywords: string[]
}

interface Visitor {
  id: string
  timestamp: Timestamp | null
  userAgent: string
  referrer: string
  screenWidth: number
  screenHeight: number
  language: string
  path: string
  isFromSearch: boolean
  searchEngine?: string
}

interface ButtonClick {
  id: string
  buttonId: string
  buttonName: string
  planPrice?: number
  section?: string
  timestamp: Timestamp | null
}

interface ButtonStat {
  buttonId: string
  buttonName: string
  clicks: number
}

/**
 * Admin 管理頁面
 * 顯示所有統計數據和詳細記錄
 */
const AdminPage = () => {
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({ totalVisits: 0, lastVisit: null })
  const [searchStats, setSearchStats] = useState<SearchVisitorStats>({ total: 0, lastVisit: null })
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [searchVisitors, setSearchVisitors] = useState<SearchVisitor[]>([])
  const [recentVisitors, setRecentVisitors] = useState<Visitor[]>([])
  const [allVisitors, setAllVisitors] = useState<Visitor[]>([])
  const [buttonClicks, setButtonClicks] = useState<ButtonClick[]>([])
  const [buttonStats, setButtonStats] = useState<ButtonStat[]>([])
  const [funnelStats, setFunnelStats] = useState<Record<string, number>>({
    page_view: 0,
    scroll_to_plans: 0,
    click_plan: 0,
    open_modal: 0,
    submit_sponsor: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'visitors' | 'sponsors' | 'comments' | 'buttons' | 'funnel'>('overview')

  useEffect(() => {
    // 訂閱訪客統計
    const unsubscribeVisitor = subscribeToVisitorStats((stats) => {
      setVisitorStats(stats)
      setIsLoading(false)
    })

    // 訂閱搜尋統計
    const unsubscribeSearch = subscribeToSearchStats((stats) => {
      setSearchStats(stats)
    })

    // 訂閱贊助者列表
    const unsubscribeSponsors = subscribeToSponsors((sponsorList) => {
      setSponsors(sponsorList)
    })

    // 訂閱留言
    const unsubscribeComments = subscribeToComments((commentList) => {
      setComments(commentList)
    })

    // 訂閱搜尋訪客記錄
    const searchVisitorsRef = collection(db, 'searchVisitors')
    const searchQ = query(searchVisitorsRef, orderBy('timestamp', 'desc'), limit(50))
    const unsubscribeSearchVisitors = onSnapshot(searchQ, (snapshot) => {
      const visitors: SearchVisitor[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        searchEngine: doc.data().searchEngine || 'Unknown',
        referrer: doc.data().referrer || '',
        timestamp: doc.data().timestamp as Timestamp | null,
        possibleKeywords: doc.data().possibleKeywords || []
      }))
      setSearchVisitors(visitors)
    })

    // 訂閱最近訪客（100筆，用於訪客列表）
    const visitorsRef = collection(db, 'visitors')
    const visitorsQ = query(visitorsRef, orderBy('timestamp', 'desc'), limit(100))
    const unsubscribeRecentVisitors = onSnapshot(visitorsQ, (snapshot) => {
      const visitors: Visitor[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        timestamp: doc.data().timestamp as Timestamp | null,
        userAgent: doc.data().userAgent || '',
        referrer: doc.data().referrer || 'direct',
        screenWidth: doc.data().screenWidth || 0,
        screenHeight: doc.data().screenHeight || 0,
        language: doc.data().language || '',
        path: doc.data().path || '/',
        isFromSearch: doc.data().isFromSearch || false,
        searchEngine: doc.data().searchEngine
      }))
      setRecentVisitors(visitors)
    })

    // 訂閱全部訪客（用於裝置分布統計）
    const allVisitorsQ = query(visitorsRef, orderBy('timestamp', 'desc'))
    const unsubscribeAllVisitors = onSnapshot(allVisitorsQ, (snapshot) => {
      const visitors: Visitor[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        timestamp: doc.data().timestamp as Timestamp | null,
        userAgent: doc.data().userAgent || '',
        referrer: doc.data().referrer || 'direct',
        screenWidth: doc.data().screenWidth || 0,
        screenHeight: doc.data().screenHeight || 0,
        language: doc.data().language || '',
        path: doc.data().path || '/',
        isFromSearch: doc.data().isFromSearch || false,
        searchEngine: doc.data().searchEngine
      }))
      setAllVisitors(visitors)
    })

    // 訂閱按鈕點擊記錄
    const clicksRef = collection(db, 'buttonClicks')
    const clicksQ = query(clicksRef, orderBy('timestamp', 'desc'), limit(100))
    const unsubscribeClicks = onSnapshot(clicksQ, (snapshot) => {
      const clicks: ButtonClick[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        buttonId: doc.data().buttonId || '',
        buttonName: doc.data().buttonName || '',
        planPrice: doc.data().planPrice,
        section: doc.data().section,
        timestamp: doc.data().timestamp as Timestamp | null
      }))
      setButtonClicks(clicks)
    })

    // 取得按鈕統計
    const fetchButtonStats = async () => {
      const statsRef = collection(db, 'buttonStats')
      const snapshot = await getDocs(statsRef)
      const stats: ButtonStat[] = snapshot.docs.map((doc) => ({
        buttonId: doc.data().buttonId || doc.id,
        buttonName: doc.data().buttonName || '',
        clicks: doc.data().clicks || 0
      }))
      setButtonStats(stats.sort((a, b) => b.clicks - a.clicks))
    }
    fetchButtonStats()

    // 訂閱漏斗統計
    const unsubscribeFunnel = subscribeToFunnelStats((stats) => {
      setFunnelStats(stats)
    })

    return () => {
      unsubscribeVisitor()
      unsubscribeSearch()
      unsubscribeSponsors()
      unsubscribeComments()
      unsubscribeSearchVisitors()
      unsubscribeRecentVisitors()
      unsubscribeAllVisitors()
      unsubscribeClicks()
      unsubscribeFunnel()
    }
  }, [])

  const formatTime = (timestamp: Timestamp | null): string => {
    if (!timestamp) return '未知'
    const date = timestamp.toDate()
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatShortTime = (timestamp: Timestamp | null): string => {
    if (!timestamp) return '未知'
    const date = timestamp.toDate()
    return date.toLocaleString('zh-TW', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 解析 User Agent
  const parseUserAgent = (ua: string): { browser: string; os: string; device: string } => {
    let browser = 'Unknown'
    let os = 'Unknown'
    let device = 'Desktop'

    // Browser
    if (ua.includes('Chrome') && !ua.includes('Edg')) browser = 'Chrome'
    else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Edg')) browser = 'Edge'
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera'

    // OS
    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac OS')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS'

    // Device
    if (ua.includes('Mobile') || ua.includes('Android') || ua.includes('iPhone')) device = 'Mobile'
    else if (ua.includes('Tablet') || ua.includes('iPad')) device = 'Tablet'

    return { browser, os, device }
  }

  // 統計數據
  const totalAmount = sponsors.reduce((sum, s) => sum + s.planPrice, 0)
  const mobileVisitors = allVisitors.filter(v => parseUserAgent(v.userAgent).device === 'Mobile').length
  const desktopVisitors = allVisitors.filter(v => parseUserAgent(v.userAgent).device === 'Desktop').length

  // 方案統計
  const planStats = sponsors.reduce((acc, s) => {
    const key = s.planName
    if (!acc[key]) acc[key] = { count: 0, amount: 0 }
    acc[key].count++
    acc[key].amount += s.planPrice
    return acc
  }, {} as Record<string, { count: number; amount: number }>)

  // 瀏覽器統計（全部訪客）
  const browserStats = allVisitors.reduce((acc, v) => {
    const { browser } = parseUserAgent(v.userAgent)
    acc[browser] = (acc[browser] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">禁忌之美 - 管理後台</h1>
          <a href="#/" className="text-gray-400 hover:text-white text-sm">
            ← 返回首頁
          </a>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-4 overflow-x-auto">
            {[
              { id: 'overview', label: '總覽', icon: '📊' },
              { id: 'visitors', label: '訪客', icon: '👥' },
              { id: 'sponsors', label: '贊助', icon: '💰' },
              { id: 'comments', label: '留言', icon: '💬' },
              { id: 'buttons', label: '按鈕', icon: '🖱️' },
              { id: 'funnel', label: '漏斗', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-4 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">載入中...</p>
          </div>
        ) : (
          <>
            {/* ========== 總覽 Tab ========== */}
            {activeTab === 'overview' && (
              <>
                {/* 總覽統計卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                  <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-xs text-gray-500 mb-1">總訪客數</p>
                    <p className="text-2xl font-bold text-gray-900">{visitorStats.totalVisits}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-xs text-gray-500 mb-1">搜尋引擎來的</p>
                    <p className="text-2xl font-bold text-purple-600">{searchStats.total}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-xs text-gray-500 mb-1">贊助人數</p>
                    <p className="text-2xl font-bold text-green-600">{sponsors.length}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-xs text-gray-500 mb-1">贊助總額</p>
                    <p className="text-2xl font-bold text-teal-600">NT${totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-xs text-gray-500 mb-1">留言數</p>
                    <p className="text-2xl font-bold text-blue-600">{comments.length}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow">
                    <p className="text-xs text-gray-500 mb-1">按鈕點擊</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {buttonStats.reduce((sum, s) => sum + s.clicks, 0)}
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* 搜尋引擎來源 */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 搜尋引擎來源</h2>
                    {searchStats.total > 0 ? (
                      <div className="space-y-3">
                        {[
                          { name: 'Google', count: searchStats.fromGoogle || 0, color: 'bg-blue-500' },
                          { name: 'Bing', count: searchStats.fromBing || 0, color: 'bg-cyan-500' },
                          { name: 'Yahoo', count: searchStats.fromYahoo || 0, color: 'bg-purple-500' },
                          { name: 'DuckDuckGo', count: searchStats.fromDuckDuckGo || 0, color: 'bg-orange-500' },
                          { name: 'Baidu', count: searchStats.fromBaidu || 0, color: 'bg-red-500' }
                        ].filter(e => e.count > 0).map((engine) => (
                          <div key={engine.name} className="flex items-center gap-3">
                            <span className="w-24 text-sm text-gray-600">{engine.name}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                              <div
                                className={`${engine.color} h-4 rounded-full`}
                                style={{ width: `${(engine.count / searchStats.total) * 100}%` }}
                              />
                            </div>
                            <span className="w-10 text-sm font-medium text-gray-700">{engine.count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <p>尚無搜尋引擎來源記錄</p>
                        <p className="text-sm text-gray-400 mt-1">我猜別人會搜尋：鍾佳播募資</p>
                      </div>
                    )}
                  </div>

                  {/* 裝置分布 */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">📱 裝置分布（全部訪客）</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <div className="text-3xl mb-2">🖥️</div>
                        <p className="text-2xl font-bold text-blue-600">{desktopVisitors}</p>
                        <p className="text-xs text-gray-500">電腦</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 text-center">
                        <div className="text-3xl mb-2">📱</div>
                        <p className="text-2xl font-bold text-green-600">{mobileVisitors}</p>
                        <p className="text-xs text-gray-500">手機</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* 方案統計 */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">💎 方案統計</h2>
                    {Object.keys(planStats).length > 0 ? (
                      <div className="space-y-3">
                        {Object.entries(planStats).map(([name, stats]) => (
                          <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{name}</p>
                              <p className="text-xs text-gray-500">{stats.count} 人選擇</p>
                            </div>
                            <p className="font-bold text-green-600">NT$ {stats.amount.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center py-6 text-gray-500">尚無贊助記錄</p>
                    )}
                  </div>

                  {/* 瀏覽器統計 */}
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">🌐 瀏覽器統計（全部訪客）</h2>
                    <div className="space-y-2">
                      {Object.entries(browserStats).sort((a, b) => b[1] - a[1]).map(([browser, count]) => (
                        <div key={browser} className="flex items-center gap-3">
                          <span className="w-20 text-sm text-gray-600">{browser}</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-indigo-500 h-3 rounded-full"
                              style={{ width: `${(count / allVisitors.length) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-sm text-gray-700">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 熱門按鈕 */}
                <div className="bg-white rounded-lg p-6 shadow">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">🔥 熱門按鈕 Top 10</h2>
                  {buttonStats.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
                      {buttonStats.slice(0, 10).map((stat, index) => (
                        <div key={stat.buttonId} className="bg-gray-50 rounded-lg p-3 text-center">
                          <div className={`text-lg font-bold ${index < 3 ? 'text-orange-500' : 'text-gray-600'}`}>
                            #{index + 1}
                          </div>
                          <p className="text-sm text-gray-700 truncate" title={stat.buttonName}>
                            {stat.buttonName}
                          </p>
                          <p className="text-xl font-bold text-green-600">{stat.clicks}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-6 text-gray-500">尚無按鈕點擊記錄</p>
                  )}
                </div>
              </>
            )}

            {/* ========== 訪客 Tab ========== */}
            {activeTab === 'visitors' && (
              <>
                {/* 搜尋訪客 */}
                <div className="bg-white rounded-lg p-6 shadow mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    🔍 搜尋引擎訪客
                    <span className="text-sm font-normal text-gray-500 ml-2">（{searchVisitors.length} 筆）</span>
                  </h2>
                  {searchVisitors.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-2 px-3 text-gray-600">時間</th>
                            <th className="text-left py-2 px-3 text-gray-600">搜尋引擎</th>
                            <th className="text-left py-2 px-3 text-gray-600">可能的搜尋關鍵字</th>
                          </tr>
                        </thead>
                        <tbody>
                          {searchVisitors.map((visitor) => (
                            <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 text-gray-700">{formatShortTime(visitor.timestamp)}</td>
                              <td className="py-2 px-3">
                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                                  {visitor.searchEngine}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-gray-600">
                                {visitor.possibleKeywords.slice(0, 3).join('、')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p className="font-medium">尚無搜尋關鍵字記錄</p>
                      <p className="text-sm mt-1">當有人從 Google 搜尋「禁忌之美」進入網站時，會被記錄在這裡</p>
                      <p className="text-sm text-gray-400 mt-2 italic">我猜別人會搜尋：鍾佳播募資</p>
                    </div>
                  )}
                </div>

                {/* 所有訪客 */}
                <div className="bg-white rounded-lg p-6 shadow">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    👥 最近訪客
                    <span className="text-sm font-normal text-gray-500 ml-2">（最近 100 筆）</span>
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-2 px-3 text-gray-600">時間</th>
                          <th className="text-left py-2 px-3 text-gray-600">來源</th>
                          <th className="text-left py-2 px-3 text-gray-600">裝置</th>
                          <th className="text-left py-2 px-3 text-gray-600">瀏覽器</th>
                          <th className="text-left py-2 px-3 text-gray-600">螢幕</th>
                          <th className="text-left py-2 px-3 text-gray-600">語言</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentVisitors.map((visitor) => {
                          const { browser, os, device } = parseUserAgent(visitor.userAgent)
                          return (
                            <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 text-gray-700">{formatShortTime(visitor.timestamp)}</td>
                              <td className="py-2 px-3">
                                {visitor.isFromSearch ? (
                                  <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs">
                                    {visitor.searchEngine}
                                  </span>
                                ) : visitor.referrer === 'direct' ? (
                                  <span className="text-gray-400 text-xs">直接訪問</span>
                                ) : (
                                  <span className="text-blue-600 text-xs truncate max-w-[150px] block">
                                    {visitor.referrer}
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  device === 'Mobile' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {device === 'Mobile' ? '📱' : '🖥️'} {os}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-gray-600">{browser}</td>
                              <td className="py-2 px-3 text-gray-500 text-xs">
                                {visitor.screenWidth}x{visitor.screenHeight}
                              </td>
                              <td className="py-2 px-3 text-gray-500 text-xs">{visitor.language}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ========== 贊助 Tab ========== */}
            {activeTab === 'sponsors' && (
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  💰 贊助者列表
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    （{sponsors.length} 人，總額 NT$ {totalAmount.toLocaleString()}）
                  </span>
                </h2>
                {sponsors.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                          <th className="text-left py-2 px-3 text-gray-600">#</th>
                          <th className="text-left py-2 px-3 text-gray-600">名稱</th>
                          <th className="text-left py-2 px-3 text-gray-600">方案</th>
                          <th className="text-right py-2 px-3 text-gray-600">金額</th>
                          <th className="text-left py-2 px-3 text-gray-600">時間</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sponsors.map((sponsor, index) => (
                          <tr key={sponsor.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-2 px-3">
                              {index < 3 ? (
                                <span className={`text-lg ${
                                  index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'
                                }`}>
                                  {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                </span>
                              ) : (
                                <span className="text-gray-500">{index + 1}</span>
                              )}
                            </td>
                            <td className="py-2 px-3 font-medium text-gray-800">{sponsor.name}</td>
                            <td className="py-2 px-3 text-gray-600">{sponsor.planName}</td>
                            <td className="py-2 px-3 text-right text-green-600 font-medium">
                              NT$ {sponsor.planPrice.toLocaleString()}
                            </td>
                            <td className="py-2 px-3 text-gray-500">{formatTime(sponsor.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">尚無贊助者</p>
                )}
              </div>
            )}

            {/* ========== 留言 Tab ========== */}
            {activeTab === 'comments' && (
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  💬 留言列表
                  <span className="text-sm font-normal text-gray-500 ml-2">（{comments.length} 則）</span>
                </h2>
                {comments.length > 0 ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                              {comment.nickname.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-gray-800">{comment.nickname}</span>
                          </div>
                          <span className="text-xs text-gray-500">{formatTime(comment.createdAt)}</span>
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-gray-500">尚無留言</p>
                )}
              </div>
            )}

            {/* ========== 按鈕 Tab ========== */}
            {activeTab === 'buttons' && (
              <>
                {/* 按鈕統計 */}
                <div className="bg-white rounded-lg p-6 shadow mb-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">📊 按鈕點擊統計</h2>
                  {buttonStats.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-2 px-3 text-gray-600">排名</th>
                            <th className="text-left py-2 px-3 text-gray-600">按鈕 ID</th>
                            <th className="text-left py-2 px-3 text-gray-600">按鈕名稱</th>
                            <th className="text-right py-2 px-3 text-gray-600">點擊次數</th>
                          </tr>
                        </thead>
                        <tbody>
                          {buttonStats.map((stat, index) => (
                            <tr key={stat.buttonId} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3">
                                <span className={`font-bold ${index < 3 ? 'text-orange-500' : 'text-gray-500'}`}>
                                  #{index + 1}
                                </span>
                              </td>
                              <td className="py-2 px-3 text-gray-500 text-xs font-mono">{stat.buttonId}</td>
                              <td className="py-2 px-3 text-gray-700">{stat.buttonName}</td>
                              <td className="py-2 px-3 text-right font-bold text-green-600">{stat.clicks}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">尚無按鈕點擊記錄</p>
                  )}
                </div>

                {/* 點擊記錄 */}
                <div className="bg-white rounded-lg p-6 shadow">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">
                    🖱️ 點擊記錄
                    <span className="text-sm font-normal text-gray-500 ml-2">（最近 100 筆）</span>
                  </h2>
                  {buttonClicks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200 bg-gray-50">
                            <th className="text-left py-2 px-3 text-gray-600">時間</th>
                            <th className="text-left py-2 px-3 text-gray-600">按鈕名稱</th>
                            <th className="text-left py-2 px-3 text-gray-600">區塊</th>
                            <th className="text-right py-2 px-3 text-gray-600">金額</th>
                          </tr>
                        </thead>
                        <tbody>
                          {buttonClicks.map((click) => (
                            <tr key={click.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-2 px-3 text-gray-700">{formatShortTime(click.timestamp)}</td>
                              <td className="py-2 px-3 text-gray-800">{click.buttonName}</td>
                              <td className="py-2 px-3">
                                {click.section && (
                                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs">
                                    {click.section}
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-right text-green-600">
                                {click.planPrice ? `NT$ ${click.planPrice.toLocaleString()}` : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-center py-8 text-gray-500">尚無點擊記錄</p>
                  )}
                </div>
              </>
            )}

            {/* ========== 漏斗 Tab ========== */}
            {activeTab === 'funnel' && (
              <div className="bg-white rounded-lg p-6 shadow">
                <h2 className="text-lg font-bold text-gray-800 mb-6">📈 轉換漏斗分析</h2>

                {/* 漏斗視覺化 */}
                <div className="space-y-4 mb-8">
                  {[
                    { key: 'page_view', label: '頁面瀏覽', icon: '👁️' },
                    { key: 'scroll_to_plans', label: '看到方案區', icon: '📜' },
                    { key: 'click_plan', label: '點擊方案', icon: '👆' },
                    { key: 'open_modal', label: '打開感謝視窗', icon: '🎉' },
                    { key: 'submit_sponsor', label: '完成留名', icon: '✅' }
                  ].map((step, index, arr) => {
                    const count = funnelStats[step.key] || 0
                    const prevCount = index > 0 ? (funnelStats[arr[index - 1].key] || 1) : count
                    const rate = index === 0 ? 100 : Math.round((count / prevCount) * 100) || 0
                    const totalRate = funnelStats.page_view ? Math.round((count / funnelStats.page_view) * 100) : 0
                    const maxWidth = funnelStats.page_view ? (count / funnelStats.page_view) * 100 : 100

                    return (
                      <div key={step.key} className="relative">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {step.icon} {step.label}
                          </span>
                          <div className="text-sm">
                            <span className="font-bold text-gray-900">{count.toLocaleString()}</span>
                            {index > 0 && (
                              <span className={`ml-2 ${rate >= 50 ? 'text-green-600' : rate >= 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                                ({rate}% 轉換)
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              index === 0 ? 'bg-blue-500' :
                              index === 1 ? 'bg-cyan-500' :
                              index === 2 ? 'bg-teal-500' :
                              index === 3 ? 'bg-green-500' :
                              'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.max(maxWidth, 2)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          佔總訪客 {totalRate}%
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* 轉換率摘要 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {funnelStats.page_view ? Math.round((funnelStats.scroll_to_plans / funnelStats.page_view) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">瀏覽→看方案</div>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-cyan-600">
                      {funnelStats.scroll_to_plans ? Math.round((funnelStats.click_plan / funnelStats.scroll_to_plans) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">看方案→點擊</div>
                  </div>
                  <div className="bg-teal-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-teal-600">
                      {funnelStats.click_plan ? Math.round((funnelStats.open_modal / funnelStats.click_plan) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">點擊→打開視窗</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {funnelStats.page_view ? Math.round((funnelStats.submit_sponsor / funnelStats.page_view) * 100) : 0}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">總轉換率</div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          禁忌之美 - 管理後台 |
          <a href="mailto:bobchen184@gmail.com" className="text-gray-300 hover:text-white ml-1">
            bobchen184@gmail.com
          </a>
        </div>
      </footer>
    </div>
  )
}

export default AdminPage
