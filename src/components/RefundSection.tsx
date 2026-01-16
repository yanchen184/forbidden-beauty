/**
 * 退換貨規則區塊
 */
const RefundSection = () => {
  return (
    <section id="refund" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-gray-900 mb-4 text-center"
          style={{ fontFamily: 'Noto Serif TC, serif' }}
        >
          退換貨規則
        </h2>
        <p className="text-gray-600 text-center mb-12">
          相關規範說明
        </p>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                !
              </div>
              <div>
                <h3 className="font-bold text-gray-800 mb-2">特別說明</h3>
                <p className="text-gray-600">
                  由於本網站為展示用途，不涉及任何實際金流交易，因此<strong>無需退換貨機制</strong>。
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-bold text-gray-800 mb-3">如果這是真正的募資專案，退換貨規則如下：</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>依照消費者保護法規定，提供 7 天鑑賞期</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>數位商品（電子檔案）一經下載即無法退換</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>實體商品如有瑕疵可申請更換</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>客製化商品恕不接受退換</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RefundSection
