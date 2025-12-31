import Link from "next/link"
import Image from "next/image"
import { PixelButton } from "@/components/pixel-button"
import { PixelCard } from "@/components/pixel-card"
import { FloatingParticles } from "@/components/floating-particles"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0118] scanlines relative overflow-hidden">
      <FloatingParticles />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-block animate-float">
            <Image src="/c0gito.gif" alt="c0gito logo" width={120} height={120} className="mx-auto" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl md:text-4xl text-[#b794f6] text-glow-purple leading-relaxed">c0gito</h2>
            <p className="text-xl md:text-2xl text-[#f093fb] text-glow-pink">THINK. TRANSFER. VANISH.</p>
            <p className="text-lg md:text-xl text-[#4facfe] text-glow-cyan">INCOGNITO MODE ON MANTLE</p>
          </div>

          <p className="text-[#9d8bb4] text-xs md:text-sm leading-relaxed max-w-2xl mx-auto">
            Transfer cryptocurrency with complete privacy using Oasis Sapphire confidential computation. Your
            transactions, your business.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/transfer">
              <PixelButton variant="primary" size="lg">
                START TRANSFER
              </PixelButton>
            </Link>
            <PixelButton variant="secondary" size="lg">
              LEARN MORE
            </PixelButton>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24">
          <PixelCard>
            <div className="text-center space-y-4">
              <div className="text-4xl">🔒</div>
              <h3 className="text-primary text-sm md:text-base">CONFIDENTIAL</h3>
              <p className="text-muted text-xs leading-relaxed">Powered by Oasis Sapphire for secure computation</p>
            </div>
          </PixelCard>

          <PixelCard>
            <div className="text-center space-y-4">
              <div className="text-4xl">⚡</div>
              <h3 className="text-accent text-sm md:text-base">FAST</h3>
              <p className="text-muted text-xs leading-relaxed">Powered by Hyperlane for Cross Chain Communication</p>
            </div>
          </PixelCard>

          <PixelCard>
            <div className="text-center space-y-4">
              <div className="text-4xl">👁️</div>
              <h3 className="text-secondary text-sm md:text-base">PRIVATE</h3>
              <p className="text-muted text-xs leading-relaxed">Your transactions remain completely anonymous</p>
            </div>
          </PixelCard>
        </div>

        {/* Stats Section */}
        <div className="mt-16 md:mt-24">
          <PixelCard className="bg-gradient-to-r from-primary/20 to-accent/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl md:text-3xl text-primary text-glow-purple">1000+</div>
                <div className="text-muted text-xs mt-2">TRANSFER</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl text-accent text-glow-cyan">100%</div>
                <div className="text-muted text-xs mt-2">PRIVATE</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl text-secondary">24/7</div>
                <div className="text-muted text-xs mt-2">AVAILABLE</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl text-primary text-glow-purple">∞</div>
                <div className="text-muted text-xs mt-2">SECURE</div>
              </div>
            </div>
          </PixelCard>
        </div>
        </div>

    </div>
  )
}
