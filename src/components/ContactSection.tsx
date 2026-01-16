/**
 * 客服聯絡方式區塊
 */
const ContactSection = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-gray-900 mb-4 text-center"
          style={{ fontFamily: 'Noto Serif TC, serif' }}
        >
          客服聯絡方式
        </h2>
        <p className="text-gray-600 text-center mb-12">
          有任何問題歡迎與我們聯繫
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Email */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Email</h3>
                <p className="text-sm text-gray-500">24 小時內回覆</p>
              </div>
            </div>
            <a
              href="mailto:bobchen184@gmail.com"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              bobchen184@gmail.com
            </a>
          </div>

          {/* 留言區 */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">留言區</h3>
                <p className="text-sm text-gray-500">公開留言討論</p>
              </div>
            </div>
            <a
              href="#comments"
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              前往留言區 →
            </a>
          </div>
        </div>

        {/* 回覆時間說明 */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>我們會盡快回覆您的訊息，一般在 24 小時內回覆。</p>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
