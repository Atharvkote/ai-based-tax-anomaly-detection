import { Card } from '@/components/ui/card'
import {
    FaBrain,
    FaShield,
    FaChartLine,
    FaBolt,
    FaClipboard,
    FaCode,
} from 'react-icons/fa6'

const features = [
    {
        icon: FaBrain,
        title: 'ML Detection Engine',
        description:
            'Gradient boosting model trained on millions of historical tax evasion patterns with 97.4% accuracy.',
        tag: 'AI Model',
    },
    {
        icon: FaShield,
        title: 'Rule-Based Engine',
        description:
            'Deterministic compliance rules covering known fraud signatures, duplicate flags, cash patterns, and more.',
        tag: 'Compliance',
    },
    {
        icon: FaChartLine,
        title: 'Composite Risk Score',
        description:
            'Weighted 0–100 risk score combining both engines, with LOW / MEDIUM / HIGH classification.',
        tag: 'Analytics',
    },
    {
        icon: FaBolt,
        title: 'Real-Time Analysis',
        description:
            'Instant risk assessment on transaction submission with animated dashboards and audit-ready outputs.',
        tag: 'Speed',
    },
    {
        icon: FaClipboard,
        title: 'Full Audit Trail',
        description:
            'Timestamped prediction history with detailed breakdowns, filterable by risk level and amount.',
        tag: 'Audit',
    },
    {
        icon: FaCode,
        title: 'API Integration',
        description:
            'Plug into your existing backend or run in Demo Mode with intelligent mock fallback.',
        tag: 'Integration',
    },
]

export function Features() {
    return (
        <section className="py-20 sm:py-32 bg-card border-t border-border">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-6 mb-16">
                    <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-accent">
                        Platform Capabilities
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground text-balance">
                        Everything compliance teams need
                    </h2>
                    <p className="text-lg text-text-secondary max-w-xl mx-auto">
                        A complete risk intelligence platform with no configuration required.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature) => {
                        const IconComponent = feature.icon
                        return (
                            <Card
                                key={feature.title}
                                className="relative group p-6 sm:p-8 rounded-md bg-background border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                            >
                                {/* Icon */}
                                <div className="mb-4">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-all duration-300">
                                        <IconComponent size={24} />
                                    </div>
                                </div>

                                {/* Tag */}
                                <div className="absolute top-6 right-6">
                                    <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-accent/10 text-accent">
                                        {feature.tag}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-lg font-bold text-foreground ">
                                    {feature.title}
                                </h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
