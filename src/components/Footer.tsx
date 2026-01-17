import { trackButtonClick, trackShareClick } from '../firebase'

const Footer = () => {
  const handleShare = (platform: string) => {
    trackShareClick(platform)
  }

  const handleContactClick = () => {
    trackButtonClick('footer-contact', '聯絡我們', undefined, 'footer')
  }

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 左側 - 專案資訊 */}
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'Noto Serif TC, serif' }}>
              禁忌之美 - 鍾佳播募資
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              鍾佳播導演最新力作<br />
              一場挑戰美感與慾望界線的史詩級實驗影像<br />
              華麗成人藝術電影募資計畫
            </p>
          </div>

          {/* 中間 - 快速連結 */}
          <div>
            <h4 className="font-bold mb-4">快速連結</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">專案內容</a>
              </li>
              <li>
                <a href="#funding-plans" className="hover:text-white transition-colors">支持方案</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">常見問答</a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                  onClick={handleContactClick}
                >
                  聯絡我們
                </a>
              </li>
            </ul>
          </div>

          {/* 右側 - 社群連結 */}
          <div>
            <h4 className="font-bold mb-4">關注我們</h4>
            <div className="flex gap-3">
              <button
                onClick={() => handleShare('Facebook')}
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <span className="font-bold">f</span>
              </button>
              <button
                onClick={() => handleShare('Instagram')}
                className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
              <button
                onClick={() => handleShare('Twitter')}
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors border border-gray-700"
              >
                <span className="font-bold">𝕏</span>
              </button>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-400">
                有任何問題請聯繫：<br />
                <a href="mailto:bobchen184@gmail.com" className="text-blue-400 hover:text-blue-300">
                  bobchen184@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* 版權資訊 */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>© 2025 禁忌之美製作團隊 All Rights Reserved.</p>
          <p className="mt-2">
            鍾佳播募資計畫 - 本網站為募資計畫展示頁面
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
