const steps = [
    {
        number: '01',
        title: 'Enter Transaction',
        description:
            'Input 15 risk parameters across transaction basics, behavioral signals and financial health groups.',
    },
    {
        number: '02',
        title: 'Dual-Engine Analysis',
        description:
            'ML model + rule engine process your data in parallel, each producing an independent risk score.',
    },
    {
        number: '03',
        title: 'Get Risk Report',
        description:
            'A composite 0–100 final score, risk classification, suspicion flag, and top risk indicators.',
    },
    {
        number: '04',
        title: 'Audit & Export',
        description:
            'All predictions are logged with timestamps in the history table for full compliance audit trails.',
    },
]

export function HowItWorks() {
    return (
        <section className="py-20 sm:py-32 bg-background border-t border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-6 mb-16">
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-accent">
                        Process
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                        How it works
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative">
                            {/* Connector line - only show on desktop */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-8 left-full w-6 h-0.5 bg-gradient-to-r from-accent/50 to-transparent" />
                            )}

                            {/* Step card */}
                            <div className="relative z-10 p-6 sm:p-8 rounded-xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                                {/* Step number */}
                                <span className="text-sm font-bold text-accent mb-3">
                                    Step {step.number}
                                </span>

                                {/* Title */}
                                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-3">
                                    {step.title}
                                </h3>

                                {/* Description */}
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {step.description}
                                </p>

                                {/* Progress indicator */}
                                <div className="mt-auto pt-4 flex gap-2">
                                    {[0, 1, 2, 3].map((dot) => (
                                        <div
                                            key={dot}
                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${dot <= parseInt(step.number) - 1
                                                    ? 'bg-accent'
                                                    : 'bg-border'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
