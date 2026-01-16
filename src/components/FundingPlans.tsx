import { useState, useCallback } from 'react'
import { trackPlanClick } from '../firebase'
import ThankYouModal from './ThankYouModal'

interface FundingPlan {
  id: string
  price: number
  name: string
  backers: number
  description: string
  items: string[]
  shipping: string[]
  estimatedDelivery: string
}

const FundingPlans = () => {
  // Modal 狀態
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<FundingPlan | null>(null)
  const plans: FundingPlan[] = [
    {
      id: 'plan-500',
      price: 500,
      name: '微光信札',
      backers: 303,
      description: '專屬導演簽名明信片',
      items: [
        '專屬導演簽名明信片一張，每張都承載著我們對藝術的執念'
      ],
      shipping: ['可選 7-11、你家、來門自取貨', '限台灣本島免運'],
      estimatedDelivery: '2026 年一月寄現'
    },
    {
      id: 'plan-1500',
      price: 1500,
      name: '創作之鑰',
      backers: 0,
      description: '幕後製作筆記電子檔（含設計發想、初稿等）',
      items: [
        '幕後製作筆記電子檔（含設計發想、初稿等）',
        '解剖影像背後的構思與秘密筆記，近距離探索藝術誕生過程'
      ],
      shipping: ['可選 7-11、你家、來門自取貨', '限台灣本島免運'],
      estimatedDelivery: '2026 年一月寄現'
    },
    {
      id: 'plan-3000',
      price: 3000,
      name: '劇場導覽體驗',
      backers: 0,
      description: '線上藝術發表會入場（由導演領頭導覽導遊）',
      items: [
        '線上藝術發表會入場（由導演領頭導覽導遊）',
        '與創作者同步見證系幕過程，穿越特一暫誕生故事，你將了解每個佈景背後藝術家的靈感來源，以及導演交織光明與色彩的視覺語言'
      ],
      shipping: ['可選 7-11、你家、來門自取貨', '限台灣本島免運'],
      estimatedDelivery: '2026 年一月寄現'
    },
    {
      id: 'plan-10000',
      price: 10000,
      name: '永恆守護者',
      backers: 0,
      description: '片尾「藝術守護者」名單致謝',
      items: [
        '片尾「藝術守護者」名單致謝',
        '將你的名字刻入片尾，成為藝術起程的一部分。每位觀眾的目光停留在那一行字，你的支持將持續也將隨這部作品永遠共鳴'
      ],
      shipping: ['可選 7-11、你家、來門自取貨', '限台灣本島免運'],
      estimatedDelivery: '2026 年一月寄現'
    },
    {
      id: 'plan-50000',
      price: 50000,
      name: '至尊珍藏禮',
      backers: 0,
      description: '限量簽名劇照 + 專屬感謝影片',
      items: [
        '限量簽名劇照 + 專屬感謝影片',
        '獲得限量藝術收藏與專屬感謝影片，尊享無可取代的專屬榮耀。每一件收藏品都承載著電影的靈魂與美學理念，而專屬影片將親自向你述說創作背後的秘密與熱情，這是一份只屬於你的藝術紀念'
      ],
      shipping: ['可選 7-11、你家、來門自取貨', '限台灣本島免運'],
      estimatedDelivery: '2026 年一月寄現'
    }
  ]

  /**
   * 處理方案點擊
   * 追蹤點擊事件並開啟感謝 Modal
   */
  const handlePlanClick = useCallback((plan: FundingPlan) => {
    // 追蹤按鈕點擊
    trackPlanClick(plan.name, plan.price)
    // 設定選中的方案並開啟 Modal
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }, [])

  /**
   * 關閉 Modal
   */
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedPlan(null)
  }, [])

  return (
    <section id="funding-plans" className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center" style={{ fontFamily: 'Noto Serif TC, serif' }}>
          支持回饋方案
        </h2>
        <p className="text-gray-600 text-center mb-12">
          選擇適合你的方案，成為這場藝術革命的一份子
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-md overflow-hidden plan-card border border-gray-200"
            >
              {/* 方案頭部 */}
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-gray-900">NT$ {plan.price.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500">
                  已被贊助 {plan.backers} 次
                </p>
              </div>

              {/* 方案內容 */}
              <div className="p-6">
                <p className="text-gray-700 font-medium mb-4">{plan.description}</p>

                <ul className="space-y-2 mb-6 text-sm text-gray-600">
                  {plan.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* 配送資訊 */}
                <div className="space-y-1 mb-4">
                  {plan.shipping.map((info, index) => (
                    <p key={index} className="text-xs text-gray-500 flex items-center gap-1">
                      <span className="text-green-500">✓</span>
                      {info}
                    </p>
                  ))}
                </div>

                {/* 預計出貨 */}
                <p className="text-xs text-purple-600 mb-6">
                  ★ 預計於 {plan.estimatedDelivery}
                </p>

                {/* 選擇按鈕 */}
                <button
                  onClick={() => handlePlanClick(plan)}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  選擇此方案
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 底部說明 */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            所有方案皆包含電子感謝函與專案更新通知
          </p>
        </div>
      </div>

      {/* 感謝 Modal */}
      {selectedPlan && (
        <ThankYouModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          plan={{
            name: selectedPlan.name,
            price: selectedPlan.price
          }}
        />
      )}
    </section>
  )
}

export default FundingPlans
