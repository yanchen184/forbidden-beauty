import { useEffect, useState } from 'react'
import {
  subscribeToVisitorStats,
  subscribeToSearchStats,
  subscribeToSponsors,
  VisitorStats,
  SearchVisitorStats,
  Sponsor
} from '../firebase'
import { collection, query, orderBy, limit, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'

interface SearchVisitor {
  id: string
  searchEngine: string
  referrer: string
  timestamp: Timestamp | null
  possibleKeywords: string[]
}

/**
 * Admin 管理頁面
 * 顯示所有統計數據和搜尋來源記錄
 */
const AdminPage = () => {
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({ totalVisits: 0, lastVisit: null })
  const [searchStats, setSearchStats] = useState<SearchVisitorStats>({ total: 0, lastVisit: null })
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [searchVisitors, setSearchVisitors] = useState<SearchVisitor[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

    // 訂閱搜尋訪客記錄
    const searchVisitorsRef = collection(db, 'searchVisitors')
    const q = query(searchVisitorsRef, orderBy('timestamp', 'desc'), limit(50))
    const unsubscribeSearchVisitors = onSnapshot(q, (snapshot) => {
      const visitors: SearchVisitor[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        searchEngine: doc.data().searchEngine || 'Unknown',
        referrer: doc.data().referrer || '',
        timestamp: doc.data().timestamp as Timestamp | null,
        possibleKeywords: doc.data().possibleKeywords || []
      }))
      setSearchVisitors(visitors)
    })

    return () => {
      unsubscribeVisitor()
      unsubscribeSearch()
      unsubscribeSponsors()
      unsubscribeSearchVisitors()
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

  // 計算總贊助金額
  const totalAmount = sponsors.reduce((sum, s) => sum + s.planPrice, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">禁忌之美 - 管理後台</h1>
          <a href="#/" className="text-gray-400 hover:text-white text-sm">
            ← 返回首頁
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-500">載入中...</p>
          </div>
        ) : (
          <>
            {/* 總覽統計 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-500 mb-1">總訪客數</p>
                <p className="text-3xl font-bold text-gray-900">{visitorStats.totalVisits}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-500 mb-1">搜尋引擎來的</p>
                <p className="text-3xl font-bold text-purple-600">{searchStats.total}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-500 mb-1">贊助人數</p>
                <p className="text-3xl font-bold text-green-600">{sponsors.length}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow">
                <p className="text-sm text-gray-500 mb-1">贊助總額</p>
                <p className="text-3xl font-bold text-teal-600">NT$ {totalAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* 搜尋引擎來源分布 */}
            <div className="bg-white rounded-lg p-6 shadow mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">搜尋引擎來源分布</h2>
              {searchStats.total > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-600 mb-1">Google</p>
                    <p className="text-2xl font-bold text-blue-700">{searchStats.fromGoogle || 0}</p>
                  </div>
                  <div className="bg-cyan-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-cyan-600 mb-1">Bing</p>
                    <p className="text-2xl font-bold text-cyan-700">{searchStats.fromBing || 0}</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-purple-600 mb-1">Yahoo</p>
                    <p className="text-2xl font-bold text-purple-700">{searchStats.fromYahoo || 0}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-orange-600 mb-1">DuckDuckGo</p>
                    <p className="text-2xl font-bold text-orange-700">{searchStats.fromDuckDuckGo || 0}</p>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-red-600 mb-1">Baidu</p>
                    <p className="text-2xl font-bold text-red-700">{searchStats.fromBaidu || 0}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">尚無搜尋引擎來源記錄</p>
                  <p className="text-sm text-gray-400 mt-2">
                    當有人從 Google 搜尋「禁忌之美」進入網站時，會被記錄在這裡
                  </p>
                </div>
              )}
            </div>

            {/* 搜尋訪客記錄 */}
            <div className="bg-white rounded-lg p-6 shadow mb-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                搜尋訪客記錄
                <span className="text-sm font-normal text-gray-500 ml-2">（最近 50 筆）</span>
              </h2>
              {searchVisitors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-gray-600">時間</th>
                        <th className="text-left py-2 px-3 text-gray-600">搜尋引擎</th>
                        <th className="text-left py-2 px-3 text-gray-600">可能的搜尋關鍵字</th>
                        <th className="text-left py-2 px-3 text-gray-600">來源網址</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchVisitors.map((visitor) => (
                        <tr key={visitor.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3 text-gray-700">{formatTime(visitor.timestamp)}</td>
                          <td className="py-2 px-3">
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                              {visitor.searchEngine}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-gray-600">
                            {visitor.possibleKeywords.slice(0, 3).join('、')}
                          </td>
                          <td className="py-2 px-3 text-gray-500 text-xs truncate max-w-xs">
                            {visitor.referrer}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-700">尚無搜尋關鍵字記錄</p>
                  <p className="text-gray-500 text-sm mt-2">
                    當有人從 Google 搜尋「禁忌之美」進入網站時，關鍵字會被記錄在這裡。
                  </p>
                  <p className="text-gray-400 text-sm mt-2 italic">
                    我猜別人會搜尋：禁忌之美鍾佳播、禁忌之美募資
                  </p>
                </div>
              )}
            </div>

            {/* 贊助者列表 */}
            <div className="bg-white rounded-lg p-6 shadow">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                贊助者列表
                <span className="text-sm font-normal text-gray-500 ml-2">（{sponsors.length} 人）</span>
              </h2>
              {sponsors.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
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
                          <td className="py-2 px-3 text-gray-500">{index + 1}</td>
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
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <p className="text-gray-500">尚無贊助者</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-4 mt-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
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
