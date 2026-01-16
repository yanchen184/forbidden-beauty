/**
 * 專案更新區塊
 */
const UpdatesSection = () => {
  const updates = [
    {
      id: 1,
      date: '2025/09/20',
      title: '專案正式啟動！',
      content: '感謝各位支持者！《禁忌之美》募資計畫正式上線，我們將定期更新專案進度，敬請期待更多精彩內容。'
    }
  ]

  return (
    <section id="updates" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <h2
          className="text-3xl font-bold text-gray-900 mb-4 text-center"
          style={{ fontFamily: 'Noto Serif TC, serif' }}
        >
          專案更新
        </h2>
        <p className="text-gray-600 text-center mb-12">
          追蹤我們的最新進度
        </p>

        <div className="space-y-6">
          {updates.map((update) => (
            <div
              key={update.id}
              className="bg-gray-50 rounded-lg p-6 border border-gray-200"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  更新 #{update.id}
                </span>
                <span className="text-sm text-gray-500">{update.date}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {update.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {update.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default UpdatesSection
