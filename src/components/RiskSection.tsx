/**
 * 風險與挑戰區塊
 */
const RiskSection = () => {
  return (
    <section id="risk" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-gray-900 mb-4 text-center"
          style={{ fontFamily: 'Noto Serif TC, serif' }}
        >
          風險與挑戰
        </h2>
        <p className="text-gray-600 text-center mb-12">
          透明揭露專案可能面臨的風險
        </p>

        <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-800 mb-3">重要聲明</h3>
              <div className="space-y-4 text-amber-900">
                <p>
                  <strong>這不是一個真正的募資專案。</strong>這是一個展示頁面，用來測試有多少人會搜尋「禁忌之美」來支持鍾佳播導演。
                </p>
                <p>
                  此頁面不會收取任何費用，所有「選擇此方案」的操作只會記錄你的支持意願，不會產生任何金流交易。
                </p>
                <p>
                  如果你對鍾佳播導演的真實作品感興趣，請關注其官方渠道獲取最新資訊。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RiskSection
