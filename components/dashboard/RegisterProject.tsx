'use client';

import { useState } from 'react';
import { useAccount } from 'wagmi';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterProject() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    githubUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Fetch GitHub data
      toast.info('Fetching GitHub data...');
      const githubResponse = await fetch('/api/github/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl: formData.githubUrl }),
      });

      const githubData = await githubResponse.json();
      if (!githubData.success) {
        throw new Error(githubData.error || 'Failed to fetch GitHub data');
      }

      // Step 2: Calculate AI score
      toast.info('Calculating impact score with AI...');
      const aiResponse = await fetch('/api/ai/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectData: {
            ...formData,
            ...githubData.data,
          },
        }),
      });

      const aiData = await aiResponse.json();
      if (!aiData.success) {
        throw new Error(aiData.error || 'Failed to calculate impact score');
      }

      // Step 3: Register project in database
      toast.info('Registering project...');
      const projectResponse = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectAddress: address,
          name: formData.name,
          description: formData.description,
          githubUrl: formData.githubUrl,
        }),
      });

      const projectData = await projectResponse.json();
      if (!projectData.success) {
        throw new Error(projectData.error || 'Failed to register project');
      }

      toast.success('Project registered successfully!');
      setFormData({ name: '', description: '', githubUrl: '' });
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to register project');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-12 border border-gray-700 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h3>
          <p className="text-gray-400">
            Please connect your wallet to register your project for grant distribution
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Send className="w-6 h-6 text-blue-400" />
          <span>Register Your Project</span>
        </h2>
        <p className="text-gray-400 mt-2">
          Submit your project for AI evaluation and grant eligibility
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Project Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="My Awesome Celo Project"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe your project, its impact on the Celo ecosystem, and key achievements..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            GitHub Repository URL
          </label>
          <input
            type="url"
            required
            value={formData.githubUrl}
            onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
            className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://github.com/username/repo"
          />
        </div>

        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            <strong>Note:</strong> Your project will be analyzed by our AI system which evaluates
            code quality, community engagement, and impact potential. This process may take a few moments.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Register Project</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
