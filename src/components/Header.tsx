import { useEffect, useState } from 'react'
import { trackButtonClick, subscribeToComments, Comment } from '../firebase'

const Header = () => {
  const [commentCount, setCommentCount] = useState(0)

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
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <button
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              專案內容
            </button>
            <button
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              onClick={() => scrollToSection('faq', '常見問答')}
            >
              常見問答 9
            </button>
            <button
              className="text-gray-700 hover:text-gray-900 text-sm font-medium"
              onClick={() => scrollToSection('comments', '留言')}
            >
              留言 {commentCount}
            </button>
          </div>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <button
              className="hover:text-gray-900"
              onClick={() => scrollToSection('risk', '風險與挑戰')}
            >
              風險與挑戰
            </button>
            <button
              className="hover:text-gray-900"
              onClick={() => scrollToSection('refund', '退換貨規則')}
            >
              退換貨規則
            </button>
            <button
              className="hover:text-gray-900"
              onClick={() => scrollToSection('contact', '客服聯絡方式')}
            >
              客服聯絡方式
            </button>
            <button
              className="hover:text-gray-900"
              onClick={() => scrollToSection('info', '登記資料')}
            >
              登記資料
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
