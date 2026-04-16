import { Navbar } from '../components/Navbar'
import { Footer } from '../components/Footer'
import { Hero } from '@/components/Hero'
import { Features } from '@/components/Features'
import { HowItWorks } from '@/components/HowItWorks'
import { CTABanner } from '@/components/CTA'

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="w-full pt-[62px]">
        <Hero />
        <Features />
        <HowItWorks />
        <CTABanner />
      </main>
      <Footer />
    </div>
  )
}
