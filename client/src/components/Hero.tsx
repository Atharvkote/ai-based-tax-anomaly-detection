import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FaBolt, FaShield, FaFire } from 'react-icons/fa6'
import { ChevronRight } from 'lucide-react'

export function Hero() {
    return (
        <section className="relative overflow-hidden bg-background py-8 sm:py-12 lg:py-16">
            {/* Animated background orbs */}
            <div className="absolute top-8 right-6 w-72 h-72 bg-gradient-to-b from-accent/20 to-transparent rounded-full blur-3xl opacity-60 animate-pulse" />
            <div className="absolute bottom-4 left-4 w-60 h-60 bg-gradient-to-b from-blue-500/10 to-transparent rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/3 w-52 h-52 bg-gradient-to-b from-green-500/10 to-transparent rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center space-y-8 sm:space-y-10">
                    {/* Badge */}
                    <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-sm font-semibold text-accent animate-fade-up">
                        <FaBolt size={14} />
                        <span>AI-Powered • Compliance-Grade • Real-Time</span>
                    </div>

                    {/* Headline */}
                    <div className="space-y-4 animate-fade-up" style={{ animationDelay: '100ms' }}>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground text-balance">
                            Detect Financial Risk
                            <br />
                            <span className="relative inline-block bg-gradient-to-r from-accent via-accent/80 to-accent/60 bg-clip-text text-transparent">
                                Before It Escalates
                                <svg
                                    className="absolute -bottom-2 left-0 w-full h-3 opacity-60"
                                    viewBox="0 0 300 10"
                                    fill="none"
                                >
                                    <path
                                        d="M 5 6 Q 150 1 295 6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        className="text-accent"
                                    />
                                </svg>
                            </span>
                        </h1>
                    </div>

                    {/* Subtext */}
                    <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: '200ms' }}>
                        Enterprise-grade transaction risk scoring powered by machine learning and deterministic rule engines — built for financial analysts and compliance teams.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2 animate-fade-up" style={{ animationDelay: '300ms' }}>
                        <Link to="/dashboard">
                            <Button
                                size="lg"
                                className="bg-accent text-accent-foreground rounded-md hover:bg-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            >
                                Open Dashboard <ChevronRight className="ml-2" />
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-border rounded-md hover:border-accent/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                            >
                                <FaBolt size={16} className="mr-2" />
                                Try Sample Transaction
                            </Button>
                        </Link>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 sm:pt-12 animate-fade-up" style={{ animationDelay: '400ms' }}>
                        {[
                            { value: '97.4%', label: 'Detection Accuracy', icon: FaShield },
                            { value: '15', label: 'Risk Parameters', icon: FaFire },
                            { value: '<1s', label: 'Analysis Speed', icon: FaBolt },
                            { value: 'SOC 2', label: 'Compliance Ready', icon: FaShield },
                        ].map((stat) => {
                            const IconComponent = stat.icon
                            return (
                                <div
                                    key={stat.label}
                                    className="flex flex-col items-center gap-3 p-4 sm:p-4 rounded-xl bg-card border border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                >
                                    <IconComponent size={24} className="text-accent" />
                                    <span className="text-xl sm:text-2xl font-bold text-foreground font-mono">
                                        {stat.value}
                                    </span>
                                    <span className="text-xs sm:text-sm text-muted-foreground font-medium text-center">
                                        {stat.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
