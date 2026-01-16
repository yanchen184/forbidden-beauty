/**
 * 登記資料區塊
 */
const InfoSection = () => {
  return (
    <section id="info" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-gray-900 mb-4 text-center"
          style={{ fontFamily: 'Noto Serif TC, serif' }}
        >
          登記資料
        </h2>
        <p className="text-gray-600 text-center mb-12">
          專案提案人資訊
        </p>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-gray-500 mb-1">提案人/單位</h3>
              <p className="font-medium text-gray-800">反正不上班</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">統一編號</h3>
              <p className="font-medium text-gray-800">不適用（個人）</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">聯絡信箱</h3>
              <p className="font-medium text-gray-800">
                <a href="mailto:bobchen184@gmail.com" className="text-green-600 hover:text-green-700">
                  bobchen184@gmail.com
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500 mb-1">專案類型</h3>
              <p className="font-medium text-gray-800">展示用途（非實際募資）</p>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-6 pt-6">
            <h3 className="text-sm text-gray-500 mb-2">專案說明</h3>
            <p className="text-gray-600 leading-relaxed">
              此網站為展示用途，旨在測試有多少人會搜尋「禁忌之美」來支持鍾佳播導演。
              本網站不涉及任何實際金流交易，所有支持數據僅供統計參考。
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

export default InfoSection
