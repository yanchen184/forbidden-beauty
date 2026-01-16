import { trackButtonClick, trackShareClick } from '../firebase'

const Hero = () => {
  const currentAmount = 151500
  const goalAmount = 3000000
  const progress = (currentAmount / goalAmount) * 100
  const supporters = 303
  const daysLeft = 96

  const handleShare = (platform: string) => {
    trackShareClick(platform)
    // 實際分享邏輯可以在這裡實現
  }

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
                    華麗成人藝術電影
                  </p>
                  <p className="text-gray-400 max-w-md mx-auto">
                    一場挑戰美感與慾望界線的<br />
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
                我們正在籌備一部史無前例的成人藝術電影，
                這不是單純的影像製作，也不是煽情的消費娛樂。而是
                一場開創的文化實驗與藝術實踐。它將挑戰傳統視覺
                品的邊界，正面直視人類最真實、最敏感且直接的慾
                望與以感受的本質式呈現，這不僅僅是一
                部電影，而是一場結合視覺、音樂、場景、身體與聲
                體的綜合藝術表演。
              </p>

              {/* 專案時間 */}
              <div className="text-sm text-gray-500 mb-4">
                <span className="font-medium">專案期間</span>
                <span className="ml-2">2025/09/16 00:00 - 2025/12/32 23:61</span>
              </div>

              {/* 分享按鈕 */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-sm text-gray-500">分享這則訊息</span>
                <button
                  onClick={() => handleShare('Facebook')}
                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                >
                  <span className="text-xs font-bold">f</span>
                </button>
                <button
                  onClick={() => handleShare('Twitter')}
                  className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
                >
                  <span className="text-xs font-bold">𝕏</span>
                </button>
                <button
                  onClick={() => handleShare('Line')}
                  className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                >
                  <span className="text-xs font-bold">L</span>
                </button>
              </div>

              {/* 支持專案按鈕 */}
              <button
                onClick={handleSupport}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg"
              >
                支持專案
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
