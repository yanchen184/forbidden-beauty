const OilPaintingSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* 左側圖片 */}
          <div className="lg:w-1/2">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg aspect-[4/5] flex items-center justify-center">
              {/* 模擬油畫風格的人物 */}
              <div className="text-center p-8">
                <div className="w-48 h-64 mx-auto bg-gradient-to-b from-amber-300 to-amber-400 rounded-lg opacity-60"></div>
                <p className="mt-4 text-amber-800 text-sm">藝術風格示意圖</p>
              </div>
            </div>
          </div>

          {/* 右側文字 */}
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-red-700 mb-6 border-t-4 border-b-4 border-red-700 py-4 text-center" style={{ fontFamily: 'Noto Serif TC, serif' }}>
              場景將像油畫般厚重
            </h2>

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              每一道牆壁都能呼吸，呼吸就是牆壁，牆壁就是呼吸
            </h3>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                油畫的特質在於經層層疊加的顏料，它不僅是視覺上的色彩，更是一種時間與情感的沉澱。我們的場景設計將
                承載這樣的厚度，從每一面牆壁到每一件道具，都會帶有如軍艦般的痕跡。當觀眾看到畫面時，不只是看到
                物件的存在，而是彷彿能感受到背後的歷史、溫度與記憶。這部電影的三個核心場景——<span className="text-blue-600 font-bold">「慾望聖堂」</span>、<span className="text-blue-600 font-bold">「禁
                慾花園」</span>、<span className="text-blue-600 font-bold">「墜落之塔」</span>——將各自代表不同的慾望狀態與心理階段。聖堂如同信仰與肉身的交疊，花
                慾念與幻象的倒影，而高塔則是墜落與解脫的交會。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OilPaintingSection
