'use client';

import { useEffect, useState } from 'react';
import { Clock, ExternalLink, DollarSign } from 'lucide-react';
import { formatDate, formatAddress } from '@/lib/utils';

interface Grant {
  id: number;
  project_id: number;
  project_name: string;
  amount: string;
  transaction_hash: string;
  reason: string;
  distributed_at: string;
}

export default function FundingHistory() {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch grants from API or contract
    // For now, using mock data
    setGrants([
      {
        id: 1,
        project_id: 1,
        project_name: 'Celo DeFi Protocol',
        amount: '5000',
        transaction_hash: '0x1234...5678',
        reason: 'Outstanding contribution to Celo ecosystem',
        distributed_at: new Date().toISOString(),
      },
    ]);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
        <div className="text-center text-gray-400">Loading funding history...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Clock className="w-6 h-6 text-blue-400" />
          <span>Funding History</span>
        </h2>
        <p className="text-gray-400 mt-2">Complete transaction history of all grant distributions</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Project</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Reason</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Transaction</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {grants.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  No grants distributed yet
                </td>
              </tr>
            ) : (
              grants.map((grant) => (
                <tr key={grant.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-white font-medium">{grant.project_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1 text-green-400 font-semibold">
                      <DollarSign className="w-4 h-4" />
                      <span>{grant.amount} cUSD</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    <div className="text-gray-400 text-sm truncate">{grant.reason}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-400 text-sm">{formatDate(grant.distributed_at)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`https://alfajores.celoscan.io/tx/${grant.transaction_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span className="font-mono text-sm">{formatAddress(grant.transaction_hash)}</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
