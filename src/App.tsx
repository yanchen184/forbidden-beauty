import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { trackVisitor } from './firebase'
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
import UpdatesSection from './components/UpdatesSection'
import FAQSection from './components/FAQSection'
import CommentSection from './components/CommentSection'
import RiskSection from './components/RiskSection'
import RefundSection from './components/RefundSection'
import ContactSection from './components/ContactSection'
import InfoSection from './components/InfoSection'
import Footer from './components/Footer'
import AdminPage from './pages/AdminPage'

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ProjectInfo />
        <OilPaintingSection />
        <MusicSection />
        <PhilosophySection />
        <CallToAction />
        <BudgetChart />
        <FundingPlans />
        <SponsorList />
        <UpdatesSection />
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
