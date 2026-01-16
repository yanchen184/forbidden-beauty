import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { trackVisitor, trackFunnelStep } from './firebase'
import { useScrollTracking } from './hooks/useScrollTracking'
import Header from './components/Header'
import Hero from './components/Hero'
import ProjectInfo from './components/ProjectInfo'
import OilPaintingSection from './components/OilPaintingSection'
import MusicSection from './components/MusicSection'
import PhilosophySection from './components/PhilosophySection'
import CallToAction from './components/CallToAction'
import BudgetChart from './components/BudgetChart'
import FundingPlans from './components/FundingPlans'
import SponsorList from './components/SponsorList'
import FAQSection from './components/FAQSection'
import CommentSection from './components/CommentSection'
import RiskSection from './components/RiskSection'
import RefundSection from './components/RefundSection'
import ContactSection from './components/ContactSection'
import InfoSection from './components/InfoSection'
import Footer from './components/Footer'
import AdminPage from './pages/AdminPage'

function HomePage() {
  // 啟用捲動追蹤
  useScrollTracking()

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section id="hero">
          <Hero />
        </section>
        <section id="project-info">
          <ProjectInfo />
          <OilPaintingSection />
          <MusicSection />
          <PhilosophySection />
          <CallToAction />
          <BudgetChart />
        </section>
        <FundingPlans />
        <section id="sponsors">
          <SponsorList />
        </section>
        <FAQSection />
        <CommentSection />
        <RiskSection />
        <RefundSection />
        <ContactSection />
        <InfoSection />
      </main>
      <Footer />
    </div>
  )
}

function App() {
  useEffect(() => {
    // 記錄訪客
    trackVisitor()
    // 追蹤漏斗：頁面瀏覽
    trackFunnelStep('page_view')
  }, [])

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
