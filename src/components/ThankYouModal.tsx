import { useEffect, useState, useCallback } from 'react'
import { subscribeToButtonStats, subscribeToVisitorStats, subscribeToSearchStats, addSponsor, ButtonStats, VisitorStats, SearchVisitorStats } from '../firebase'

/**
 * 方案資料介面
 */
interface PlanInfo {
  name: string
  price: number
}

/**
 * ThankYouModal Props 介面
 */
interface ThankYouModalProps {
  isOpen: boolean
  onClose: () => void
  plan: PlanInfo
}

/**
 * 感謝 Modal 組件
 * 當用戶點擊「選擇此方案」時顯示
 * 提供留名功能讓用戶可以記錄贊助
 * 即時顯示該方案的點擊次數和總訪客數
 */
const ThankYouModal = ({ isOpen, onClose, plan }: ThankYouModalProps) => {
  // 統計數據狀態
  const [buttonStats, setButtonStats] = useState<ButtonStats | null>(null)
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({ totalVisits: 0, lastVisit: null })
  const [searchStats, setSearchStats] = useState<SearchVisitorStats>({ total: 0, lastVisit: null })
  const [isLoading, setIsLoading] = useState(true)

  // 贊助者留名狀態
  const [sponsorName, setSponsorName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  /**
   * 訂閱統計數據更新
   * 使用 Firebase onSnapshot 即時監聽
   * 在 Modal 關閉時清理訂閱，避免記憶體洩漏
   */
  useEffect(() => {
    if (!isOpen) return

    setIsLoading(true)
    const buttonId = `plan-${plan.price}`

    // 訂閱按鈕統計
    const unsubscribeButton = subscribeToButtonStats(buttonId, (stats) => {
      setButtonStats(stats)
      setIsLoading(false)
    })

    // 訂閱訪客統計
    const unsubscribeVisitor = subscribeToVisitorStats((stats) => {
      setVisitorStats(stats)
    })

    // 訂閱搜尋來源統計
    const unsubscribeSearch = subscribeToSearchStats((stats) => {
      setSearchStats(stats)
    })

    // Cleanup: 取消訂閱以防止記憶體洩漏
    return () => {
      unsubscribeButton()
      unsubscribeVisitor()
      unsubscribeSearch()
    }
  }, [isOpen, plan.price])

  /**
   * 重置表單狀態（當 Modal 開啟時）
   */
  useEffect(() => {
    if (isOpen) {
      setSponsorName('')
      setSubmitSuccess(false)
      setSubmitError(null)
    }
  }, [isOpen])

  /**
   * 處理 ESC 鍵關閉 Modal
   */
  useEffect(() => {
    if (!isOpen) return

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  /**
   * 處理背景點擊關閉 Modal
   */
  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }, [onClose])

  /**
   * 防止 Modal 開啟時背景滾動
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  /**
   * 處理贊助者提交
   * 將名字和方案資訊記錄到 Firebase
   */
  const handleSponsorSubmit = useCallback(async () => {
    if (!sponsorName.trim()) {
      setSubmitError('請輸入你的名字')
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      await addSponsor(sponsorName, plan.name, plan.price)
      setSubmitSuccess(true)
      setSponsorName('')
    } catch (error) {
      console.error('提交贊助失敗:', error)
      setSubmitError('提交失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }, [sponsorName, plan.name, plan.price])

  /**
   * 處理輸入框 Enter 鍵提交
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isSubmitting && !submitSuccess) {
      handleSponsorSubmit()
    }
  }, [handleSponsorSubmit, isSubmitting, submitSuccess])

  // 如果 Modal 未開啟，不渲染任何內容
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="thank-you-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full transform animate-slideUp overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2
              id="thank-you-title"
              className="text-2xl font-bold"
              style={{ fontFamily: 'Noto Serif TC, serif' }}
            >
              感謝你！
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="關閉"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-white/90">
            你選擇了「{plan.name}」方案
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* 主要訊息 */}
          <div className="mb-6 text-gray-700 leading-relaxed">
            <p className="mb-4">
              我只是一個小小工程師，我就想知道有多少人會真的來搜尋「禁忌之美」來支持鍾佳播。
            </p>
            <p className="text-gray-500 text-sm">
              這個頁面是用來追蹤有多少人對這個專案感興趣的實驗。
            </p>
          </div>

          {/* 留名區塊 */}
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-5 mb-6 border border-green-200">
            <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              我要留名
            </h3>

            {submitSuccess ? (
              <div className="bg-white rounded-lg p-4 border border-green-300">
                <div className="flex items-center gap-3 text-green-700">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">感謝你的支持！</p>
                    <p className="text-sm text-green-600">你的名字已經記錄在感謝名單中</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-600 mb-3">
                  留下你的名字，讓我們記住每一位支持者
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sponsorName}
                    onChange={(e) => setSponsorName(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="輸入你的名字或暱稱"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                    disabled={isSubmitting}
                    maxLength={50}
                  />
                  <button
                    onClick={handleSponsorSubmit}
                    disabled={isSubmitting || !sponsorName.trim()}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold px-5 py-3 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        <span>送出中</span>
                      </div>
                    ) : (
                      '確認贊助'
                    )}
                  </button>
                </div>
                {submitError && (
                  <p className="text-red-500 text-sm mt-2">{submitError}</p>
                )}
              </>
            )}
          </div>

          {/* 統計數據 */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {/* 方案點擊次數 */}
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">此方案被選擇</div>
              {isLoading ? (
                <div className="h-8 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-green-600">
                  {buttonStats?.clicks || 0}
                </div>
              )}
              <div className="text-xs text-gray-400">次</div>
            </div>

            {/* 總訪客數 */}
            <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">總訪客數</div>
              {isLoading ? (
                <div className="h-8 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-teal-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-teal-600">
                  {visitorStats.totalVisits}
                </div>
              )}
              <div className="text-xs text-gray-400">人</div>
            </div>

            {/* 從搜尋引擎來的訪客 */}
            <div className="bg-purple-50 rounded-xl p-3 text-center border border-purple-100">
              <div className="text-xs text-purple-600 mb-1">搜尋引擎來的</div>
              {isLoading ? (
                <div className="h-8 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-purple-600">
                  {searchStats.total}
                </div>
              )}
              <div className="text-xs text-purple-400">人</div>
            </div>
          </div>

          {/* 搜尋來源細節 */}
          {searchStats.total > 0 ? (
            <div className="bg-purple-50/50 rounded-lg p-3 mb-4 border border-purple-100">
              <p className="text-xs text-purple-700 font-medium mb-2">搜尋來源分布：</p>
              <div className="flex flex-wrap gap-2 text-xs">
                {searchStats.fromGoogle && searchStats.fromGoogle > 0 && (
                  <span className="bg-white px-2 py-1 rounded text-purple-600 border border-purple-200">
                    Google: {searchStats.fromGoogle}
                  </span>
                )}
                {searchStats.fromBing && searchStats.fromBing > 0 && (
                  <span className="bg-white px-2 py-1 rounded text-purple-600 border border-purple-200">
                    Bing: {searchStats.fromBing}
                  </span>
                )}
                {searchStats.fromYahoo && searchStats.fromYahoo > 0 && (
                  <span className="bg-white px-2 py-1 rounded text-purple-600 border border-purple-200">
                    Yahoo: {searchStats.fromYahoo}
                  </span>
                )}
              </div>
              <p className="text-xs text-purple-500 mt-2">
                可能搜尋：禁忌之美、禁忌之美鍾佳播、禁忌之美募資...
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-700 text-sm">尚無搜尋關鍵字記錄</p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    當有人從 Google 搜尋「禁忌之美」進入網站時，關鍵字會被記錄在這裡。
                  </p>
                  <p className="text-gray-400 text-xs mt-2 italic">
                    我猜別人會搜尋：禁忌之美鍾佳播、禁忌之美募資
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 方案資訊提示 */}
          <div className="bg-green-50 rounded-lg p-4 border border-green-100 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-green-800">你選擇的方案</p>
                <p className="text-green-700 text-sm mt-1">
                  {plan.name} - NT$ {plan.price.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            我知道了
          </button>
        </div>

        {/* Footer 小字 */}
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-gray-400">
            此頁面僅供展示用途，非實際募資平台
          </p>
        </div>
      </div>

      {/* CSS 動畫 */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ThankYouModal
