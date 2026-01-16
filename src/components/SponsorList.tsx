import { useEffect, useState } from 'react'
import { subscribeToSponsors, Sponsor } from '../firebase'

/**
 * 格式化時間顯示
 * 將 Firebase Timestamp 轉換為相對時間或具體日期
 */
const formatTime = (timestamp: { seconds: number; nanoseconds: number } | null): string => {
  if (!timestamp) return '剛剛'

  const date = new Date(timestamp.seconds * 1000)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return '剛剛'
  if (diffMins < 60) return `${diffMins} 分鐘前`
  if (diffHours < 24) return `${diffHours} 小時前`
  if (diffDays < 7) return `${diffDays} 天前`

  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * 贊助者感謝名單組件
 * 顯示所有贊助者的名字和選擇的方案
 * 使用 Firebase onSnapshot 即時更新
 */
const SponsorList = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const INITIAL_DISPLAY_COUNT = 6 // 預設顯示數量

  /**
   * 訂閱贊助者列表更新
   * 在組件卸載時清理訂閱，避免記憶體洩漏
   */
  useEffect(() => {
    const unsubscribe = subscribeToSponsors((sponsorList) => {
      setSponsors(sponsorList)
      setIsLoading(false)
    })

    // Cleanup: 取消訂閱以防止記憶體洩漏
    return () => unsubscribe()
  }, [])

  // 如果沒有贊助者，顯示提示訊息
  if (!isLoading && sponsors.length === 0) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2
            className="text-3xl font-bold text-gray-900 mb-4 text-center"
            style={{ fontFamily: 'Noto Serif TC, serif' }}
          >
            感謝名單
          </h2>
          <p className="text-gray-600 text-center mb-8">
            成為第一位留名的支持者
          </p>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 text-center border border-green-200">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">尚無贊助者留名</h3>
            <p className="text-gray-600 mb-4">
              選擇一個方案並留下你的名字，成為這場藝術革命的一份子！
            </p>
            <button
              onClick={() => document.getElementById('funding-plans')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              立即支持
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-gray-900 mb-4 text-center"
          style={{ fontFamily: 'Noto Serif TC, serif' }}
        >
          感謝名單
        </h2>
        <p className="text-gray-600 text-center mb-8">
          感謝每一位支持者，你們是這場藝術革命的推動者
        </p>

        {/* 載入中狀態 */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* 統計數據 */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{sponsors.length}</div>
                <div className="text-sm text-gray-500">位贊助者</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600">
                  NT$ {sponsors.reduce((sum, s) => sum + s.planPrice, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">總贊助金額</div>
              </div>
            </div>

            {/* 贊助者列表 - 緊湊網格版 */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-4 md:p-6 border border-green-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {(isExpanded ? sponsors : sponsors.slice(0, INITIAL_DISPLAY_COUNT)).map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    className="bg-white rounded-lg p-3 shadow-sm border border-green-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {/* 排名徽章 */}
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                        index === 0 ? 'bg-yellow-400 text-yellow-900' :
                        index === 1 ? 'bg-gray-300 text-gray-700' :
                        index === 2 ? 'bg-orange-400 text-orange-900' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {index < 3 ? (
                          <span>{['🥇', '🥈', '🥉'][index]}</span>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      {/* 名字 */}
                      <h3 className="font-bold text-gray-900 truncate text-sm flex-1">{sponsor.name}</h3>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center justify-between">
                      <span className="text-green-600 font-medium">
                        NT$ {sponsor.planPrice.toLocaleString()}
                      </span>
                      <span className="text-gray-400">
                        {formatTime(sponsor.createdAt as { seconds: number; nanoseconds: number } | null)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* 展開/收合按鈕 */}
              {sponsors.length > INITIAL_DISPLAY_COUNT && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 mx-auto transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <span>收起</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </>
                    ) : (
                      <>
                        <span>展開全部 {sponsors.length} 位贊助者</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* 底部提示 */}
            <div className="mt-8 text-center">
              <p className="text-gray-500 text-sm mb-4">
                想加入感謝名單？選擇一個方案並留下你的名字！
              </p>
              <button
                onClick={() => document.getElementById('funding-plans')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                我也要支持
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default SponsorList
