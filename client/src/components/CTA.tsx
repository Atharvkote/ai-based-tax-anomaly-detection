import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { FaArrowRight } from 'react-icons/fa6'

export function CTABanner() {
    return (
        <section className="py-20 sm:py-32 bg-card border-t border-border">
            <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-accent/90 to-accent/70 p-8 sm:p-12 lg:p-16 shadow-2xl">
                    {/* Decorative gradient orb */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

                    <div className="relative z-10 text-center space-y-6">
                        {/* Heading */}
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white text-balance">
                            Ready to analyze your first transaction?
                        </h2>

                        {/* Subtext */}
                        <p className="text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
                            Get started in seconds. No setup required — just open the dashboard and run an analysis.
                        </p>

                        {/* CTA Button */}
                        <div className="pt-4">
                            <Link to="/dashboard">
                                <Button
                                    size="lg"
                                    className="bg-white text-accent hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                                >
                                    Open Dashboard
                                    <FaArrowRight size={16} className="ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
