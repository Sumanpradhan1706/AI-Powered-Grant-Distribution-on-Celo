'use client';

import { motion } from 'framer-motion';
import { Brain, Shield, Zap, Globe, TrendingUp, Lock } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Scoring',
    description: 'Advanced machine learning analyzes project data, GitHub activity, and community engagement to calculate fair impact scores.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Shield,
    title: 'Blockchain Transparency',
    description: 'Every transaction and decision is recorded on Celo blockchain, ensuring complete transparency and trust.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Zap,
    title: 'Automated Distribution',
    description: 'Smart contracts automatically distribute grants to top-ranked projects based on AI scoring, no manual intervention needed.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Globe,
    title: 'Global Accessibility',
    description: 'Built on Celo for mobile-first experience and low transaction fees, making it accessible worldwide.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Metrics',
    description: 'Track project performance, funding history, and impact scores in real-time through our intuitive dashboard.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Lock,
    title: 'Secure & Audited',
    description: 'Smart contracts are thoroughly audited and tested to ensure the safety of funds and fair distribution.',
    color: 'from-indigo-500 to-blue-500',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Combining AI intelligence with blockchain security for the next generation of grant distribution
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="h-full bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                  {/* Icon with gradient */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
