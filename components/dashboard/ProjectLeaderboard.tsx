'use client';

import { useEffect, useState } from 'react';
import { Trophy, Star, GitBranch, TrendingUp, ExternalLink, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatAddress } from '@/lib/utils';

interface Project {
  id: number;
  name: string;
  description: string;
  project_address: string;
  github_url: string;
  impact_score: number;
  total_grants_received: number;
  is_verified: boolean;
}

export default function ProjectLeaderboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (index: number) => {
    if (index === 0) return 'from-yellow-500 to-orange-500';
    if (index === 1) return 'from-gray-400 to-gray-500';
    if (index === 2) return 'from-orange-700 to-orange-800';
    return 'from-blue-500 to-purple-500';
  };

  const getRankIcon = (index: number) => {
    if (index < 3) return <Trophy className="w-5 h-5" />;
    return <Award className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700">
        <div className="text-center text-gray-400">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <TrendingUp className="w-6 h-6 text-blue-400" />
          <span>Project Leaderboard</span>
        </h2>
        <p className="text-gray-400 mt-2">Top projects ranked by AI-calculated impact scores</p>
      </div>

      <div className="divide-y divide-gray-700">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            No projects registered yet. Be the first to register!
          </div>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-start space-x-4">
                {/* Rank */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${getRankColor(index)} flex items-center justify-center text-white font-bold shadow-lg`}>
                  {index < 3 ? getRankIcon(index) : index + 1}
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                    {project.is_verified && (
                      <div className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 rounded text-xs text-blue-400 flex items-center space-x-1">
                        <Star className="w-3 h-3" />
                        <span>Verified</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{project.description}</p>

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-gray-400">
                      <span>Address:</span>
                      <span className="font-mono text-blue-400">{formatAddress(project.project_address)}</span>
                    </div>
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <GitBranch className="w-4 h-4" />
                      <span>GitHub</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Score */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-3xl font-bold text-gradient mb-1">
                    {project.impact_score}
                  </div>
                  <div className="text-xs text-gray-400 mb-2">Impact Score</div>
                  <div className="text-sm text-green-400 font-semibold">
                    ${(project.total_grants_received / 1e18).toFixed(2)} Funded
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
