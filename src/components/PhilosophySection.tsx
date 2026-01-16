const PhilosophySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* 左側圖片 */}
          <div className="lg:w-1/2">
            <div className="bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg aspect-[4/5] flex items-center justify-center relative overflow-hidden">
              {/* 模擬穿著古裝的人物 */}
              <div className="text-center p-8 text-white">
                <div className="w-48 h-64 mx-auto bg-gradient-to-b from-slate-500 to-slate-600 rounded-lg opacity-60"></div>
                <p className="mt-4 text-slate-300 text-sm">服裝概念示意圖</p>
              </div>

              {/* 文字疊層 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 p-8">
                <p className="text-white text-xl mb-4">為什麼要做這件事？因為我們相信：</p>
                <p className="text-red-500 text-3xl font-bold mb-2" style={{ fontFamily: 'Noto Serif TC, serif' }}>
                  藝術與慾望之間
                </p>
                <p className="text-red-500 text-3xl font-bold" style={{ fontFamily: 'Noto Serif TC, serif' }}>
                  從來沒有不可跨越的鴻溝
                </p>
              </div>
            </div>
          </div>

          {/* 右側文字 */}
          <div className="lg:w-1/2">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                成人電影的歷史長期被簡化與污名，但它也能成為最貼近人性與美學的載體，
                我們希望用這次計畫，將它推上藝術殿堂。
              </p>

              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg p-6">
                <p className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'Noto Serif TC, serif' }}>
                  這不僅是一部電影，而是一場對藝術極限的挑戰
                </p>
                <p className="text-xl text-red-600 font-bold" style={{ fontFamily: 'Noto Serif TC, serif' }}>
                  我們需要你，一起完成這個禁忌而華麗的夢想
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PhilosophySection
