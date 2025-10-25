'use client';

import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { DollarSign, TrendingUp, Users, Wallet } from 'lucide-react';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;
const cUSD_ADDRESS = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1'; // Alfajores cUSD

export default function TreasuryBalance() {
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: [
      {
        inputs: [],
        name: 'getTreasuryBalance',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'getTreasuryBalance',
  });

  const balanceInCUSD = balance ? parseFloat(formatEther(balance as bigint)) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-xl p-6 border border-blue-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-blue-500/20 rounded-lg">
            <Wallet className="w-6 h-6 text-blue-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {balanceInCUSD.toFixed(2)} cUSD
        </div>
        <div className="text-sm text-gray-400">Treasury Balance</div>
      </div>

      <div className="bg-gradient-to-br from-green-900/50 to-green-800/30 rounded-xl p-6 border border-green-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-green-500/20 rounded-lg">
            <DollarSign className="w-6 h-6 text-green-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">$2.5M</div>
        <div className="text-sm text-gray-400">Total Distributed</div>
      </div>

      <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-xl p-6 border border-purple-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-purple-500/20 rounded-lg">
            <Users className="w-6 h-6 text-purple-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">524</div>
        <div className="text-sm text-gray-400">Projects Funded</div>
      </div>

      <div className="bg-gradient-to-br from-orange-900/50 to-orange-800/30 rounded-xl p-6 border border-orange-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-orange-500/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-orange-400" />
          </div>
        </div>
        <div className="text-3xl font-bold text-white mb-1">+125%</div>
        <div className="text-sm text-gray-400">Growth This Month</div>
      </div>
    </div>
  );
}
