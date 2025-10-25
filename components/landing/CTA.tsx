'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-3xl opacity-20"></div>

          {/* Content */}
          <div className="relative bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-blue-500/20 backdrop-blur-sm">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join the future of transparent grant distribution. Connect your wallet and start making an impact today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/dashboard"
                  className="group px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 hover:bg-gray-100"
                >
                  <span>Launch Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="https://docs.celo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-gray-800/50 text-white rounded-lg font-semibold transition-all duration-300 border border-gray-700 hover:bg-gray-700/50"
                >
                  View Documentation
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
