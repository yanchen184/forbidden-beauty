import { useState, useRef, useEffect } from 'react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

/**
 * 單一 FAQ 項目組件，支援平滑動畫
 */
const FAQItemComponent = ({
  faq,
  isOpen,
  onToggle
}: {
  faq: FAQItem
  isOpen: boolean
  onToggle: () => void
}) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [faq.answer])

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between
                   hover:bg-gray-50 transition-colors
                   focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <span className="font-medium text-gray-800">
          Q{faq.id}. {faq.question}
        </span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        id={`faq-answer-${faq.id}`}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? `${height}px` : '0px' }}
      >
        <div
          ref={contentRef}
          className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-4"
        >
          {faq.answer}
        </div>
      </div>
    </div>
  )
}

/**
 * 常見問答區塊
 */
const FAQSection = () => {
  const [openId, setOpenId] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: '這個專案是真的嗎？',
      answer: '這是一個展示用的募資頁面，用來測試有多少人會搜尋「禁忌之美」來支持鍾佳播。實際上並非真正的募資專案。'
    },
    {
      id: 2,
      question: '我選擇方案後會真的被收費嗎？',
      answer: '不會！這只是一個展示頁面，點擊「選擇此方案」只會記錄你的支持意願，不會有任何實際金流交易。'
    },
    {
      id: 3,
      question: '為什麼要做這個頁面？',
      answer: '我只是一個小小工程師，想知道有多少人會真的搜尋「禁忌之美」來支持鍾佳播導演的作品。'
    },
    {
      id: 4,
      question: '我的資料會被保存嗎？',
      answer: '是的，如果你選擇留名支持，你的暱稱和選擇的方案會被記錄並顯示在感謝名單中。'
    },
    {
      id: 5,
      question: '這個網站跟鍾佳播有關係嗎？',
      answer: '這是粉絲自發製作的展示頁面，與鍾佳播導演本人或其團隊無直接關聯。'
    },
    {
      id: 6,
      question: '如何聯繫你們？',
      answer: '你可以透過 bobchen184@gmail.com 聯繫我們，或在留言區留下你的想法。'
    },
    {
      id: 7,
      question: '這個網站會持續運作嗎？',
      answer: '是的，這個網站會持續運作，記錄所有支持者的數據和留言。'
    },
    {
      id: 8,
      question: '我可以分享這個網站嗎？',
      answer: '當然可以！歡迎分享給更多對「禁忌之美」感興趣的朋友。'
    },
    {
      id: 9,
      question: '留言功能是即時的嗎？',
      answer: '是的，留言功能是即時的，你的留言會立即顯示在頁面上。'
    }
  ]

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <section id="faq" className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-gray-900 mb-4 text-center"
          style={{ fontFamily: 'Noto Serif TC, serif' }}
        >
          常見問答
        </h2>
        <p className="text-gray-600 text-center mb-12">
          關於這個專案的常見疑問
        </p>

        <div className="space-y-3">
          {faqs.map((faq) => (
            <FAQItemComponent
              key={faq.id}
              faq={faq}
              isOpen={openId === faq.id}
              onToggle={() => toggleFAQ(faq.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
