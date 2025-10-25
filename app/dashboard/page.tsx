'use client';

import { useState } from 'react';
import Navbar from '@/components/landing/Navbar';
import ProjectLeaderboard from '@/components/dashboard/ProjectLeaderboard';
import TreasuryBalance from '@/components/dashboard/TreasuryBalance';
import FundingHistory from '@/components/dashboard/FundingHistory';
import RegisterProject from '@/components/dashboard/RegisterProject';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900/10 to-gray-900">
      <Navbar />
      
      <main className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Grant Distribution Dashboard
            </h1>
            <p className="text-gray-400">
              Monitor projects, track funding, and manage grants powered by AI
            </p>
          </div>

          {/* Treasury Balance */}
          <div className="mb-8">
            <TreasuryBalance />
          </div>

          {/* Main Content */}
          <Tabs defaultValue="leaderboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-gray-800/50 border border-gray-700">
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="history">Funding History</TabsTrigger>
              <TabsTrigger value="register">Register Project</TabsTrigger>
            </TabsList>

            <TabsContent value="leaderboard" className="space-y-6">
              <ProjectLeaderboard />
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <FundingHistory />
            </TabsContent>

            <TabsContent value="register" className="space-y-6">
              <RegisterProject />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
