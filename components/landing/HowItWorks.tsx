'use client';

import { motion } from 'framer-motion';
import { Database, Brain, Coins, BarChart } from 'lucide-react';

const steps = [
  {
    icon: Database,
    title: 'Data Collection',
    description: 'System fetches project data from GitHub, social metrics, and on-chain activity automatically.',
    step: '01',
  },
  {
    icon: Brain,
    title: 'AI Analysis',
    description: 'Our AI engine analyzes multiple factors and calculates a transparent Impact Score for each project.',
    step: '02',
  },
  {
    icon: Coins,
    title: 'Smart Distribution',
    description: 'Smart contracts automatically distribute cUSD grants to top-scoring projects based on predefined rules.',
    step: '03',
  },
  {
    icon: BarChart,
    title: 'Track Progress',
    description: 'View real-time leaderboards, funding history, and detailed analytics on the dashboard.',
    step: '04',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            How It Works
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Four simple steps to transparent and automated grant distribution
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-300">
                    {/* Step number */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                      {step.step}
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>

                    <h3 className="text-xl font-semibold text-white mb-3 text-center">
                      {step.title}
                    </h3>

                    <p className="text-gray-400 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
