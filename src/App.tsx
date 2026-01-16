import { useEffect } from 'react'
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
import CommentSection from './components/CommentSection'
import Footer from './components/Footer'

function App() {
  useEffect(() => {
    // 記錄訪客
    trackVisitor()
  }, [])

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
        <CommentSection />
      </main>
      <Footer />
    </div>
  )
}

export default App
