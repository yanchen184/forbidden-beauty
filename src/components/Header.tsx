import { trackButtonClick } from '../firebase'

const Header = () => {
  const handleNavClick = (section: string) => {
    trackButtonClick(`nav-${section}`, `導航到 ${section}`, undefined, 'header')
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              onClick={() => handleNavClick('專案內容')}
            >
              專案內容
            </a>
            <a
              href="#updates"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              onClick={() => handleNavClick('專案更新')}
            >
              專案更新 1
            </a>
            <a
              href="#faq"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              onClick={() => handleNavClick('常見問答')}
            >
              常見問答 9
            </a>
            <a
              href="#comments"
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              onClick={() => handleNavClick('留言')}
            >
              留言 1
            </a>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <a
              href="#risk"
              className="hover:text-gray-900"
              onClick={() => handleNavClick('風險與挑戰')}
            >
              風險與挑戰
            </a>
            <a
              href="#refund"
              className="hover:text-gray-900"
              onClick={() => handleNavClick('退換貨規則')}
            >
              退換貨規則
            </a>
            <a
              href="#contact"
              className="hover:text-gray-900"
              onClick={() => handleNavClick('客服聯絡方式')}
            >
              客服聯絡方式
            </a>
            <a
              href="#info"
              className="hover:text-gray-900"
              onClick={() => handleNavClick('登記資料')}
            >
              登記資料
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
