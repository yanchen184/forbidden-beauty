import { trackButtonClick } from '../firebase'

const CallToAction = () => {
  const handleSupport = () => {
    trackButtonClick('cta-support', '支持專案（CTA區塊）', undefined, 'call-to-action')
    document.getElementById('funding-plans')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="py-16 bg-gradient-to-br from-amber-50 to-amber-100">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          {/* 手部圖像區 */}
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 11.5V14H5.5a.5.5 0 00-.5.5v2a.5.5 0 00.5.5H7v2.5a.5.5 0 00.5.5h2a.5.5 0 00.5-.5V17h2.5a.5.5 0 00.5-.5v-2a.5.5 0 00-.5-.5H10v-2.5a.5.5 0 00-.5-.5h-2a.5.5 0 00-.5.5z" />
              <path d="M18 11c0-1-.8-2-2-2h-2c0-1-.8-2-2-2h-1V4c0-1-.8-2-2-2s-2 .8-2 2v9.5l-1.5-1.5c-.8-.8-2-.8-2.8 0-.8.8-.8 2 0 2.8l5 5c.4.4 1 .7 1.5.7H16c1 0 2-.8 2-2v-7z" />
            </svg>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6" style={{ fontFamily: 'Noto Serif TC, serif' }}>
            這不僅是一部電影，而是一場對藝術極限的挑戰
          </h2>

          <p className="text-xl md:text-2xl text-red-600 font-bold mb-8" style={{ fontFamily: 'Noto Serif TC, serif' }}>
            我們需要你，一起完成這個禁忌而華麗的夢想
          </p>

          <button
            onClick={handleSupport}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-12 rounded-lg transition-colors text-xl shadow-lg hover:shadow-xl"
          >
            立即支持
          </button>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
