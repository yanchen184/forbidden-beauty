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

            {/* 贊助者列表 */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200">
              <div className="space-y-4">
                {sponsors.map((sponsor, index) => (
                  <div
                    key={sponsor.id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-green-100 flex items-center gap-4 hover:shadow-md transition-shadow"
                  >
                    {/* 排名徽章 */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {index < 3 ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <span className="text-sm font-bold">#{index + 1}</span>
                      )}
                    </div>

                    {/* 贊助者資訊 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-gray-900 truncate">{sponsor.name}</h3>
                        {index === 0 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                            第一位
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {sponsor.planName}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-green-600 font-medium">
                          NT$ {sponsor.planPrice.toLocaleString()}
                        </span>
                      </p>
                    </div>

                    {/* 時間 */}
                    <div className="text-xs text-gray-400 flex-shrink-0">
                      {formatTime(sponsor.createdAt as { seconds: number; nanoseconds: number } | null)}
                    </div>
                  </div>
                ))}
              </div>
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
