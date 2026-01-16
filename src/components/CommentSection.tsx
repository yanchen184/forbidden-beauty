import { useState, useEffect, useCallback, useMemo } from 'react'
import { addComment, subscribeToComments, Comment } from '../firebase'

/**
 * 留言區組件
 * 提供訪客留言功能，即時顯示所有留言
 * 使用 Firebase Firestore 即時監聽實現
 */
const CommentSection = () => {
  // 表單狀態
  const [nickname, setNickname] = useState('')
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // 留言列表狀態
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  /**
   * 訂閱留言更新
   * 使用 Firebase onSnapshot 即時監聽 comments collection
   * 在組件卸載時自動清理訂閱，避免記憶體洩漏
   */
  useEffect(() => {
    const unsubscribe = subscribeToComments((newComments) => {
      setComments(newComments)
      setIsLoading(false)
    })

    // Cleanup: 取消訂閱以防止記憶體洩漏
    return () => {
      unsubscribe()
    }
  }, [])

  /**
   * 處理表單提交
   * 驗證輸入後新增留言到 Firestore
   */
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()

    // 重設錯誤和成功狀態
    setSubmitError(null)
    setSubmitSuccess(false)

    // 驗證輸入
    const trimmedNickname = nickname.trim()
    const trimmedContent = content.trim()

    if (!trimmedNickname) {
      setSubmitError('請輸入暱稱')
      return
    }

    if (!trimmedContent) {
      setSubmitError('請輸入留言內容')
      return
    }

    if (trimmedContent.length > 500) {
      setSubmitError('留言內容不可超過 500 字')
      return
    }

    setIsSubmitting(true)

    try {
      await addComment(trimmedNickname, trimmedContent)
      // 清空表單
      setNickname('')
      setContent('')
      setSubmitSuccess(true)

      // 3 秒後清除成功訊息
      setTimeout(() => setSubmitSuccess(false), 3000)
    } catch (error) {
      console.error('提交留言失敗:', error)
      setSubmitError('留言提交失敗，請稍後再試')
    } finally {
      setIsSubmitting(false)
    }
  }, [nickname, content])

  /**
   * 格式化時間戳記
   * 將 Firestore Timestamp 轉換為可讀的時間字串
   */
  const formatTime = useCallback((timestamp: Comment['createdAt']): string => {
    if (!timestamp) return '剛剛'

    const date = timestamp.toDate()
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return '剛剛'
    if (diffMins < 60) return `${diffMins} 分鐘前`
    if (diffHours < 24) return `${diffHours} 小時前`
    if (diffDays < 7) return `${diffDays} 天前`

    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }, [])

  /**
   * 計算剩餘字數
   */
  const remainingChars = useMemo(() => {
    return 500 - content.length
  }, [content])

  return (
    <section id="comments" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* 標題 */}
        <h2
          className="text-3xl font-bold text-gray-900 mb-4 text-center"
          style={{ fontFamily: 'Noto Serif TC, serif' }}
        >
          支持者留言
        </h2>
        <p className="text-gray-600 text-center mb-12">
          分享你對《禁忌之美》的期待與想法
        </p>

        {/* 留言表單 */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">發表留言</h3>

          <form onSubmit={handleSubmit}>
            {/* 暱稱輸入 */}
            <div className="mb-4">
              <label
                htmlFor="nickname"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                暱稱 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="請輸入你的暱稱"
                maxLength={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-gray-900 placeholder-gray-400"
                disabled={isSubmitting}
              />
            </div>

            {/* 留言內容 */}
            <div className="mb-4">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                留言內容 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="分享你的想法..."
                rows={4}
                maxLength={500}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none text-gray-900 placeholder-gray-400"
                disabled={isSubmitting}
              />
              <p className={`text-xs mt-1 ${remainingChars < 50 ? 'text-orange-500' : 'text-gray-500'}`}>
                還可輸入 {remainingChars} 字
              </p>
            </div>

            {/* 錯誤訊息 */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {submitError}
              </div>
            )}

            {/* 成功訊息 */}
            {submitSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                留言成功！感謝你的支持！
              </div>
            )}

            {/* 提交按鈕 */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg font-bold transition-colors ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isSubmitting ? '提交中...' : '發表留言'}
            </button>
          </form>
        </div>

        {/* 留言列表 */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800 mb-4">
            所有留言 {!isLoading && <span className="text-gray-500 font-normal">({comments.length})</span>}
          </h3>

          {/* 載入中狀態 */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent"></div>
              <p className="mt-2 text-gray-500">載入留言中...</p>
            </div>
          )}

          {/* 無留言狀態 */}
          {!isLoading && comments.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-gray-500">還沒有留言，成為第一個留言的人吧！</p>
            </div>
          )}

          {/* 留言列表 */}
          {!isLoading && comments.length > 0 && (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* 頭像佔位 */}
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white font-bold">
                        {comment.nickname.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{comment.nickname}</p>
                        <p className="text-xs text-gray-500">{formatTime(comment.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CommentSection
