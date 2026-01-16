import { useEffect, useState } from 'react'
import { trackButtonClick, subscribeToComments, Comment } from '../firebase'

const Header = () => {
  const [commentCount, setCommentCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = subscribeToComments((comments: Comment[]) => {
      setCommentCount(comments.length)
    })
    return () => unsubscribe()
  }, [])

  const scrollToSection = (sectionId: string, sectionName: string) => {
    trackButtonClick(`nav-${sectionId}`, `導航到 ${sectionName}`, undefined, 'header')
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    setIsMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  // 主要導航項目
  const mainNavItems = [
    { id: 'top', label: '專案內容', action: scrollToTop },
    { id: 'faq', label: '常見問答', count: 9 },
    { id: 'comments', label: '留言', count: commentCount },
  ]

  // 次要導航項目
  const secondaryNavItems = [
    { id: 'risk', label: '風險與挑戰' },
    { id: 'refund', label: '退換貨規則' },
    { id: 'contact', label: '客服聯絡' },
    { id: 'info', label: '登記資料' },
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          {/* 桌面版導航 */}
          <div className="hidden md:flex items-center space-x-6">
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                className="text-gray-700 hover:text-gray-900 text-sm font-medium
                           py-2 px-1 rounded transition-colors
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={item.action || (() => scrollToSection(item.id, item.label))}
                aria-label={item.count !== undefined ? `${item.label} ${item.count} 則` : item.label}
              >
                {item.label} {item.count !== undefined && item.count}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
            {secondaryNavItems.map((item) => (
              <button
                key={item.id}
                className="hover:text-gray-900 py-2 px-1 rounded transition-colors
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                onClick={() => scrollToSection(item.id, item.label)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* 手機版 Logo / 標題 */}
          <div className="md:hidden flex items-center">
            <span className="text-gray-900 font-medium">禁忌之美</span>
          </div>

          {/* 手機版漢堡選單按鈕 */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors
                       focus:outline-none focus:ring-2 focus:ring-green-500"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? '關閉選單' : '開啟選單'}
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* 手機版展開選單 */}
        <div
          id="mobile-menu"
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-2 space-y-1 border-t border-gray-100">
            {/* 主要導航 */}
            {mainNavItems.map((item) => (
              <button
                key={item.id}
                className="w-full text-left py-3 px-4 text-gray-700 hover:bg-gray-50
                           rounded-lg transition-colors font-medium
                           focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                onClick={item.action || (() => scrollToSection(item.id, item.label))}
              >
                {item.label} {item.count !== undefined && <span className="text-green-600">({item.count})</span>}
              </button>
            ))}

            {/* 分隔線 */}
            <div className="border-t border-gray-100 my-2" />

            {/* 次要導航 */}
            {secondaryNavItems.map((item) => (
              <button
                key={item.id}
                className="w-full text-left py-3 px-4 text-gray-600 hover:bg-gray-50
                           rounded-lg transition-colors text-sm
                           focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                onClick={() => scrollToSection(item.id, item.label)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
