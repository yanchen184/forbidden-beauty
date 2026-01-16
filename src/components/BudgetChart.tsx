const BudgetChart = () => {
  const budgetItems = [
    { name: '攝影與燈光', amount: 1200000, percentage: 40, color: '#6366f1' },
    { name: '場景 & 服裝', amount: 800000, percentage: 27, color: '#8b5cf6' },
    { name: '音樂與聲音設計', amount: 400000, percentage: 13, color: '#a855f7' },
    { name: '後製與調光', amount: 300000, percentage: 10, color: '#d946ef' },
    { name: '國際行銷 & 影展報名', amount: 300000, percentage: 10, color: '#ec4899' },
  ]

  // 計算圓餅圖的路徑
  const createPieSlice = (startAngle: number, endAngle: number, color: string, index: number) => {
    const radius = 80
    const centerX = 100
    const centerY = 100
    const innerRadius = 40

    const startRad = (startAngle - 90) * (Math.PI / 180)
    const endRad = (endAngle - 90) * (Math.PI / 180)

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const x3 = centerX + innerRadius * Math.cos(endRad)
    const y3 = centerY + innerRadius * Math.sin(endRad)
    const x4 = centerX + innerRadius * Math.cos(startRad)
    const y4 = centerY + innerRadius * Math.sin(startRad)

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

    const d = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ')

    return <path key={index} d={d} fill={color} />
  }

  let currentAngle = 0
  const slices = budgetItems.map((item, index) => {
    const startAngle = currentAngle
    const endAngle = currentAngle + (item.percentage / 100) * 360
    currentAngle = endAngle
    return createPieSlice(startAngle, endAngle, item.color, index)
  })

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* 左側 - 標題和圖例 */}
          <div className="lg:w-1/2">
            <div className="border-4 border-gray-800 inline-block px-6 py-2 mb-8">
              <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: 'Noto Serif TC, serif' }}>
                目標金額
              </h2>
            </div>

            <p className="text-6xl font-bold text-gray-900 mb-8">
              300<span className="text-2xl ml-2">萬元（NT$）</span>
            </p>

            {/* 圖例 */}
            <div className="space-y-3">
              {budgetItems.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-700">
                    {item.name} NT$ {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 右側 - 圓餅圖 */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              <svg width="300" height="300" viewBox="0 0 200 200">
                {slices}
              </svg>

              {/* 百分比標籤 */}
              <div className="absolute top-0 right-0 text-sm font-bold text-purple-300">10%</div>
              <div className="absolute top-8 right-8 text-sm font-bold text-purple-400">10%</div>
              <div className="absolute bottom-1/3 right-4 text-sm font-bold text-purple-500">13%</div>
              <div className="absolute bottom-1/4 left-1/4 text-lg font-bold text-purple-600">27%</div>
              <div className="absolute top-1/3 left-1/3 text-xl font-bold text-indigo-500">40%</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BudgetChart
