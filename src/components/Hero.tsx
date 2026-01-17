import { useCallback, useEffect, useState } from 'react'
import { trackButtonClick, trackShareClick, subscribeToSponsors, Sponsor } from '../firebase'

/**
 * 分享網址
 */
const SHARE_URL = 'https://yanchen184.github.io/forbidden-beauty/'
const SHARE_TITLE = '禁忌之美：藝術電影 - 鍾佳播募資專案'
const SHARE_TEXT = '一場挑戰美感界線的史詩級實驗影像，支持鍾佳播導演的藝術革命！'

const Hero = () => {
  const [sponsorCount, setSponsorCount] = useState(0)
  const [totalAmount, setTotalAmount] = useState(0)

  useEffect(() => {
    const unsubscribe = subscribeToSponsors((sponsors: Sponsor[]) => {
      setSponsorCount(sponsors.length)
      const total = sponsors.reduce((sum, s) => sum + (s.planPrice || 0), 0)
      setTotalAmount(total)
    })
    return () => unsubscribe()
  }, [])

  // 基礎數據 + 即時贊助數據
  const baseAmount = 151500
  const baseSupport = 303
  const currentAmount = baseAmount + totalAmount
  const goalAmount = 3000000
  const progress = (currentAmount / goalAmount) * 100
  const supporters = baseSupport + sponsorCount
  const daysLeft = 96

  /**
   * 處理社群分享
   * 根據不同平台開啟對應的分享連結
   */
  const handleShare = useCallback((platform: string) => {
    trackShareClick(platform)

    const encodedUrl = encodeURIComponent(SHARE_URL)
    const encodedTitle = encodeURIComponent(SHARE_TITLE)
    const encodedText = encodeURIComponent(SHARE_TEXT)

    let shareUrl = ''

    switch (platform) {
      case 'Facebook':
        // Facebook sharer URL
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`
        break
      case 'Twitter':
        // Twitter/X intent URL
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
        break
      case 'Line':
        // Line share URL
        shareUrl = `https://social-plugins.line.me/lineit/share?url=${encodedUrl}&text=${encodedTitle}`
        break
      default:
        return
    }

    // 開啟新視窗進行分享
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes')
  }, [])

  const handleSupport = () => {
    trackButtonClick('hero-support', '支持專案', undefined, 'hero')
    document.getElementById('funding-plans')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 左側 - 主視覺 */}
          <div className="lg:w-2/3">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                {/* 主視覺區域 - 模擬圖片 */}
                <div className="text-center p-8">
                  <h1 className="text-5xl md:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Noto Serif TC, serif' }}>
                    禁忌之美
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 mb-6">
                    藝術電影募資計畫
                  </p>
                  <p className="text-gray-300 max-w-md mx-auto">
                    一場挑戰美感界線的<br />
                    史詩級實驗影像
                  </p>
                </div>
                {/* 右下角人物剪影 */}
                <div className="absolute bottom-4 right-4 text-gray-600">
                  <svg width="120" height="160" viewBox="0 0 120 160" fill="currentColor" opacity="0.3">
                    <ellipse cx="60" cy="30" rx="25" ry="30" />
                    <rect x="35" y="55" width="50" height="80" rx="5" />
                    <rect x="45" y="50" width="30" height="20" rx="3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* 右側 - 募資資訊 */}
          <div className="lg:w-1/3">
            <div className="bg-white">
              {/* 分類標籤 */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <span>群眾集資</span>
                <span>|</span>
                <span>短篇電影</span>
              </div>

              {/* 提案人 */}
              <p className="text-sm text-gray-600 mb-4">
                提案人 <span className="text-blue-600 hover:underline cursor-pointer">反正不上班</span>
              </p>

              {/* 標題 */}
              <h2 className="text-xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Noto Serif TC, serif' }}>
                《禁忌之美：華麗成人藝術電影》<br />
                一場挑戰美感與慾望界線的史詩級實驗影像
              </h2>

              {/* 募資金額 */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm text-gray-500">目標 NT$ {goalAmount.toLocaleString()}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm text-teal-600 font-medium">{progress.toFixed(2)}%</span>
                  <span className="text-3xl font-bold text-gray-900">NT$ {currentAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* 支持者和剩餘天數 */}
              <div className="flex items-center gap-6 mb-6 text-gray-600">
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{supporters}人</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{daysLeft}天</span>
                </div>
              </div>

              {/* 進度條 */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <div
                  className="bg-teal-500 h-2 rounded-full progress-fill"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>

              {/* 說明文字 */}
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                鍾佳播導演正在籌備一部史無前例的藝術電影，
                這不是單純的影像製作，也不是煽情的消費娛樂。而是
                一場開創的文化實驗與藝術實踐。它將挑戰傳統視覺
                品的邊界，正面直視人類最真實、最敏感的情感
                並以感受的本質方式呈現，這不僅僅是一
                部電影，而是一場結合視覺、音樂、場景與聲
                音的綜合藝術表演。
              </p>

              {/* 專案時間 */}
              <div className="text-sm text-gray-500 mb-4">
                <span className="font-medium">專案期間</span>
                <span className="ml-2">2025/09/16 00:00 - 2025/12/32 23:61</span>
              </div>

              {/* 分享按鈕 - 44px 觸控目標符合 iOS 標準 */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-gray-500">分享這則訊息</span>
                <button
                  onClick={() => handleShare('Facebook')}
                  className="w-11 h-11 bg-blue-600 rounded-full flex items-center justify-center text-white
                             hover:bg-blue-700 active:scale-95 transition-all
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  aria-label="分享到 Facebook"
                >
                  <span className="text-sm font-bold">f</span>
                </button>
                <button
                  onClick={() => handleShare('Twitter')}
                  className="w-11 h-11 bg-black rounded-full flex items-center justify-center text-white
                             hover:bg-gray-800 active:scale-95 transition-all
                             focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  aria-label="分享到 X (Twitter)"
                >
                  <span className="text-sm font-bold">𝕏</span>
                </button>
                <button
                  onClick={() => handleShare('Line')}
                  className="w-11 h-11 bg-green-500 rounded-full flex items-center justify-center text-white
                             hover:bg-green-600 active:scale-95 transition-all
                             focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  aria-label="分享到 Line"
                >
                  <span className="text-sm font-bold">L</span>
                </button>
              </div>

              {/* 支持專案按鈕 - 含社交證明 */}
              <button
                onClick={handleSupport}
                className="w-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold
                           py-4 px-6 rounded-lg transition-all text-lg
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                           active:scale-[0.98]"
              >
                <span className="block">立即支持</span>
                <span className="block text-sm font-normal opacity-90">
                  已有 {supporters.toLocaleString()} 人加入支持
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
