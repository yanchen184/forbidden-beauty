const MusicSection = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* 左側文字 */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <h2 className="text-3xl font-bold text-red-700 mb-6 border-t-4 border-b-4 border-red-700 py-4 text-center" style={{ fontFamily: 'Noto Serif TC, serif' }}>
              音樂將如實驗劇場般震撼人心
            </h2>

            <h3 className="text-xl font-bold text-gray-900 mb-6">
              當聲音也成為身體，身體就是聲音，一二三四五，聲音就是身體
            </h3>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                在這部作品裡，音樂與聲音將不再只是陪襯畫面的存在，而是整體敘事中最核心的推動力。<span className="font-bold">我們要讓聲音本身
                成為「身體」，能夠呼吸、顫動、碰撞，甚至帶來痛感與快感。</span>在電影中，我們將融合古典與工業音
                唱音的搖擺感，讓觀眾在聆聽的瞬間，感受到慾望的溫度與窒悶。<span className="font-bold">呼吸聲、低語、身體摩擦的聲響</span>，都會被放
                大為一種飢渴劇性的節奏。這些聲音不只是附屬，而是構成電影的第二條敘事軸線。
              </p>
            </div>
          </div>

          {/* 右側圖片 */}
          <div className="lg:w-1/2 order-1 lg:order-2">
            <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg aspect-[4/5] flex items-center justify-center">
              {/* 模擬人物側臉 */}
              <div className="text-center p-8">
                <div className="w-48 h-64 mx-auto bg-gradient-to-b from-gray-400 to-gray-500 rounded-lg opacity-60"></div>
                <p className="mt-4 text-gray-600 text-sm">音樂概念示意圖</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MusicSection
