import { useEffect } from 'react'
import { trackScrollDepth, trackFunnelStep, getTrackedSections } from '../firebase'

/**
 * 捲動追蹤 Hook
 * 使用 Intersection Observer 追蹤用戶看到的區塊
 */
export const useScrollTracking = () => {
  useEffect(() => {
    const sections = getTrackedSections()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id
            trackScrollDepth(sectionId)

            // 特別追蹤漏斗步驟
            if (sectionId === 'funding-plans') {
              trackFunnelStep('scroll_to_plans')
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // 30% 可見時觸發
      }
    )

    // 延遲執行，確保 DOM 已渲染
    const timeoutId = setTimeout(() => {
      sections.forEach((sectionId) => {
        const element = document.getElementById(sectionId)
        if (element) {
          observer.observe(element)
        }
      })
    }, 1000)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [])
}

export default useScrollTracking
