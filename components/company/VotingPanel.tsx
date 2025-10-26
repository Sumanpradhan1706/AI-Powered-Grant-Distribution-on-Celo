'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount, useReadContract } from 'wagmi';
import { ThumbsUp, ThumbsDown, CheckCircle, AlertCircle, Loader2, DollarSign, Users, FileText, Github, Brain, Sparkles, TrendingUp, Award } from 'lucide-react';
import { formatUnits } from 'viem';

interface ProjectData {
    id: number;
    name: string;
    description: string;
    githubUrl: string;
    requestedAmount: string;
    votesFor: number;
    votesAgainst: number;
    isApproved: boolean;
    isFunded: boolean;
    projectAddress: string;
}

interface AIAnalysis {
    impactScore: number;
    breakdown: {
        codeQuality: number;
        communityEngagement: number;
        sustainability: number;
        impactPotential: number;
        innovation: number;
    };
    reasoning: string;
    recommendations: string[];
}

export default function VotingPanel() {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [votingProjectId, setVotingProjectId] = useState<number | null>(null);
    const [votingSupport, setVotingSupport] = useState<boolean | null>(null); // Track which button was clicked
    const [analyzingProjectId, setAnalyzingProjectId] = useState<number | null>(null);
    const [aiAnalysis, setAiAnalysis] = useState<{ [key: number]: AIAnalysis }>({});
    const [expandedProject, setExpandedProject] = useState<number | null>(null);
    const { address } = useAccount();

    // Add ref to prevent double voting
    const isVotingRef = useRef(false);

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

    const { data: hash, writeContract, isPending, isError, error, reset } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Read contract to get assigned projects
    const {
        data: assignedProjectIds,
        isLoading: isLoadingAssignments,
        isError: isAssignmentsError,
        error: assignmentsError
    } = useReadContract({
        address: contractAddress,
        abi: [
            {
                inputs: [{ name: '_companyAddress', type: 'address' }],
                name: 'getCompanyAssignedProjects',
                outputs: [{ name: '', type: 'uint256[]' }],
                stateMutability: 'view',
                type: 'function',
            },
        ],
        functionName: 'getCompanyAssignedProjects',
        args: address ? [address] : undefined,
    });

    // Debug logging for contract read
    useEffect(() => {
        console.log('🔍 VotingPanel - Contract Read Debug:');
        console.log('  Connected Address:', address);
        console.log('  Is Loading Assignments:', isLoadingAssignments);
        console.log('  Is Error:', isAssignmentsError);
        console.log('  Error:', assignmentsError);
        console.log('  Assigned Project IDs:', assignedProjectIds);
        console.log('  Assigned Project IDs Type:', typeof assignedProjectIds);
        console.log('  Is Array?:', Array.isArray(assignedProjectIds));
    }, [address, assignedProjectIds, isLoadingAssignments, isAssignmentsError, assignmentsError]);

    useEffect(() => {
        if (address && assignedProjectIds) {
            fetchProjects();
        }
    }, [assignedProjectIds, address]);

    const fetchProjects = async () => {
        try {
            console.log('📊 Fetching assigned projects from blockchain...');
            console.log('Assigned Project IDs:', assignedProjectIds);

            if (!assignedProjectIds || assignedProjectIds.length === 0) {
                console.log('⚠️ No projects assigned to this company');
                setProjects([]);
                return;
            }

            // Convert BigInt IDs to numbers
            const assignedIds = assignedProjectIds.map((id: bigint) => Number(id));
            console.log(`✅ Company has ${assignedIds.length} assigned project(s): ${assignedIds.join(', ')}`);

            // Fetch all assigned projects from blockchain
            const projectPromises = assignedIds.map(async (projectId) => {
                try {
                    const response = await fetch('/api/contract/read', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            functionName: 'getProject',
                            args: [projectId.toString()],
                        }),
                    });

                    if (!response.ok) {
                        console.error(`❌ Failed to fetch project ${projectId}`);
                        return null;
                    }

                    const data = await response.json();

                    if (data.success && data.result) {
                        const project = data.result;
                        console.log(`✅ Fetched project ${projectId}:`, project.name);

                        return {
                            id: typeof project.id === 'string' ? parseInt(project.id) : Number(project.id),
                            name: project.name || 'Unnamed Project',
                            description: project.description || 'No description',
                            githubUrl: project.githubUrl || '',
                            requestedAmount: typeof project.requestedAmount === 'string'
                                ? project.requestedAmount
                                : project.requestedAmount?.toString() || '0',
                            votesFor: typeof project.votesFor === 'string'
                                ? parseInt(project.votesFor)
                                : Number(project.votesFor || 0),
                            votesAgainst: typeof project.votesAgainst === 'string'
                                ? parseInt(project.votesAgainst)
                                : Number(project.votesAgainst || 0),
                            isApproved: project.isApproved || false,
                            isFunded: project.isFunded || false,
                            projectAddress: project.projectAddress || '',
                        };
                    }

                    return null;
                } catch (err) {
                    console.error(`❌ Error fetching project ${projectId}:`, err);
                    return null;
                }
            });

            const projectResults = await Promise.all(projectPromises);
            const validProjects = projectResults.filter((p): p is ProjectData => p !== null);

            console.log(`✅ Successfully fetched ${validProjects.length} projects from blockchain`);
            setProjects(validProjects);
        } catch (error) {
            console.error('❌ Error fetching projects:', error);
            setProjects([]);
        }
    };

    const analyzeProject = async (project: ProjectData) => {
        setAnalyzingProjectId(project.id);
        try {
            // First, fetch GitHub data
            console.log('Fetching GitHub data for:', project.githubUrl);
            const githubResponse = await fetch('/api/github/fetch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ githubUrl: project.githubUrl }),
            });

            let githubData = {
                commits: 0,
                pullRequests: 0,
                issues: 0,
                stars: 0,
                forks: 0,
                contributors: 0,
            };

            if (githubResponse.ok) {
                const githubResult = await githubResponse.json();
                if (githubResult.success && githubResult.data) {
                    githubData = {
                        commits: githubResult.data.commits || 0,
                        pullRequests: githubResult.data.pullRequests || 0,
                        issues: githubResult.data.issues || 0,
                        stars: githubResult.data.stars || 0,
                        forks: githubResult.data.forks || 0,
                        contributors: githubResult.data.contributors || 0,
                    };
                    console.log('GitHub data fetched:', githubData);
                }
            } else {
                console.warn('GitHub fetch failed, using default values');
            }

            // Then, analyze with AI using the GitHub data
            console.log('Analyzing project with AI...');
            const response = await fetch('/api/ai/score', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    projectData: {
                        githubUrl: project.githubUrl,
                        description: project.description,
                        name: project.name,
                        ...githubData,
                    }
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('AI analysis result:', result);
                setAiAnalysis(prev => ({
                    ...prev,
                    [project.id]: result.analysis
                }));
                setExpandedProject(project.id);
            } else {
                const errorData = await response.json();
                console.error('AI analysis failed:', errorData);
                alert('Failed to analyze project. Please try again.');
            }
        } catch (err) {
            console.error('Error analyzing project:', err);
            alert('Error analyzing project: ' + (err instanceof Error ? err.message : 'Unknown error'));
        } finally {
            setAnalyzingProjectId(null);
        }
    };

    const handleVote = useCallback(async (projectId: number, support: boolean, e?: React.MouseEvent) => {
        const timestamp = new Date().toISOString();
        console.log(`\n========== VOTE ATTEMPT START [${timestamp}] ==========`);
        console.log(`Project ID: ${projectId}`);
        console.log(`Support: ${support}`);
        console.log(`isVotingRef.current: ${isVotingRef.current}`);
        console.log(`votingProjectId: ${votingProjectId}`);

        // Prevent any event propagation or default behavior
        if (e) {
            console.log('Preventing event propagation and default');
            e.preventDefault();
            e.stopPropagation();
            // Stop immediately after preventDefault
            e.nativeEvent.stopImmediatePropagation();
        }

        // Check ref first - this prevents React from calling the function multiple times
        if (isVotingRef.current) {
            console.log('⚠️ BLOCKED: Already processing a vote via ref');
            console.log(`========== VOTE ATTEMPT END [${timestamp}] ==========\n`);
            return;
        }

        // Prevent double voting using state
        if (votingProjectId !== null) {
            console.log(`⚠️ BLOCKED: Already voting on project ${votingProjectId}`);
            console.log(`========== VOTE ATTEMPT END [${timestamp}] ==========\n`);
            return;
        }

        console.log(`🗳️ PROCEEDING with vote on project ${projectId} - Support: ${support}`);

        // Set ref to true immediately to prevent any duplicate calls
        isVotingRef.current = true;
        setVotingProjectId(projectId);
        setVotingSupport(support); // Store which button was clicked
        console.log('Set isVotingRef.current = true');
        console.log(`Set votingProjectId = ${projectId}`);
        console.log(`Set votingSupport = ${support}`);

        try {
            console.log(`\n📝 About to call writeContract:`);
            console.log(`   - Contract Address: ${contractAddress}`);
            console.log(`   - Function: voteOnProject`);
            console.log(`   - Args: [${projectId}, ${support}]`);

            writeContract({
                address: contractAddress,
                abi: [
                    {
                        inputs: [
                            { name: '_projectId', type: 'uint256' },
                            { name: '_support', type: 'bool' }
                        ],
                        name: 'voteOnProject',
                        outputs: [],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                ],
                functionName: 'voteOnProject',
                args: [BigInt(projectId), support],
            });
            console.log(`✅ writeContract called successfully for project ${projectId}`);
            console.log(`========== VOTE ATTEMPT END [${timestamp}] ==========\n`);
        } catch (err) {
            console.error('❌ Error in writeContract:', err);
            setVotingProjectId(null);
            setVotingSupport(null);
            isVotingRef.current = false;
            console.log(`========== VOTE ATTEMPT END [${timestamp}] ==========\n`);
        }
    }, [votingProjectId, writeContract, contractAddress]);    // Track writeContract state changes
    useEffect(() => {
        console.log(`📊 writeContract state changed:`);
        console.log(`   - isPending: ${isPending}`);
        console.log(`   - isConfirming: ${isConfirming}`);
        console.log(`   - isSuccess: ${isSuccess}`);
        console.log(`   - isError: ${isError}`);
        console.log(`   - hash: ${hash}`);
        if (error) {
            console.error(`   - error:`, error);
        }
    }, [isPending, isConfirming, isSuccess, isError, hash, error]);

    useEffect(() => {
        if (isSuccess) {
            console.log('✅ Vote confirmed successfully, resetting state');
            fetchProjects();
            setVotingProjectId(null);
            setVotingSupport(null);
            isVotingRef.current = false; // Reset the ref when transaction is confirmed
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isError && error) {
            console.error('❌ Transaction error occurred:', error);
            setVotingProjectId(null);
            setVotingSupport(null);
            isVotingRef.current = false;
        }
    }, [isError, error]);

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-orange-400';
    };

    const getScoreBgColor = (score: number) => {
        if (score >= 80) return 'bg-green-500/20 border-green-500/30';
        if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
        return 'bg-orange-500/20 border-orange-500/30';
    };

    return (
        <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-purple-400" />
                    Vote on Grant Proposals with AI Analysis
                </h3>

                {isLoadingAssignments ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-400" />
                        <p className="text-gray-400 text-lg">Loading assigned projects...</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Checking blockchain for projects assigned to your company
                        </p>
                    </div>
                ) : isAssignmentsError ? (
                    <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                        <p className="text-red-400 text-lg">Error loading assignments</p>
                        <p className="text-gray-500 text-sm mt-2">
                            {assignmentsError?.message || 'Failed to fetch assigned projects'}
                        </p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-500" />
                        <p className="text-gray-400 text-lg">No projects assigned to your company yet</p>
                        <p className="text-gray-500 text-sm mt-2">
                            Please wait for the admin to assign projects for review
                        </p>
                        <div className="mt-4 text-xs text-gray-600 bg-gray-800/50 rounded p-3 max-w-md mx-auto">
                            <p className="font-mono">Connected: {address}</p>
                            <p className="font-mono">Assigned IDs: {assignedProjectIds ? JSON.stringify(assignedProjectIds, (key, value) => typeof value === 'bigint' ? value.toString() : value) : 'null'}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map((project) => {
                            const analysis = aiAnalysis[project.id];
                            const isExpanded = expandedProject === project.id;
                            const isAnalyzing = analyzingProjectId === project.id;

                            return (
                                <div
                                    key={project.id}
                                    className={`bg-gray-900/50 rounded-lg p-6 border ${project.isFunded
                                        ? 'border-green-500/30'
                                        : project.isApproved
                                            ? 'border-yellow-500/30'
                                            : analysis
                                                ? 'border-purple-500/30'
                                                : 'border-gray-600'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h4 className="text-xl font-semibold text-white mb-2">
                                                {project.name}
                                            </h4>
                                            <p className="text-gray-300 text-sm mb-3">
                                                {project.description}
                                            </p>
                                            {project.githubUrl && (
                                                <div className="mb-3">
                                                    <a
                                                        href={project.githubUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                                                    >
                                                        <Github className="w-5 h-5 mr-2" />
                                                        View Repository on GitHub
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <div className="bg-green-500/20 rounded-lg px-4 py-2 border border-green-500/30">
                                                <DollarSign className="w-5 h-5 text-green-400 mx-auto mb-1" />
                                                <p className="text-2xl font-bold text-green-400">
                                                    {formatUnits(BigInt(project.requestedAmount), 18)}
                                                </p>
                                                <p className="text-xs text-gray-400">CELO</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Analysis Button */}
                                    {!analysis && !project.isFunded && (
                                        <button
                                            onClick={() => analyzeProject(project)}
                                            disabled={isAnalyzing}
                                            className="w-full mb-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-all flex items-center justify-center"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                    AI Analyzing Project...
                                                </>
                                            ) : (
                                                <>
                                                    <Brain className="w-5 h-5 mr-2" />
                                                    Analyze with AI Before Voting
                                                </>
                                            )}
                                        </button>
                                    )}

                                    {/* AI Analysis Results */}
                                    {analysis && isExpanded && (
                                        <div className="mb-4 space-y-4">
                                            {/* Overall Score */}
                                            <div className={`rounded-lg p-4 border ${getScoreBgColor(analysis.impactScore)}`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h5 className="text-lg font-bold text-white flex items-center">
                                                        <Sparkles className="w-5 h-5 mr-2 text-purple-400" />
                                                        AI Impact Analysis
                                                    </h5>
                                                    <div className="text-right">
                                                        <p className={`text-4xl font-bold ${getScoreColor(analysis.impactScore)}`}>
                                                            {analysis.impactScore}
                                                        </p>
                                                        <p className="text-xs text-gray-400">out of 100</p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-300 text-sm">{analysis.reasoning}</p>
                                            </div>

                                            {/* Score Breakdown */}
                                            <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                                <h6 className="text-sm font-semibold text-white mb-3 flex items-center">
                                                    <Award className="w-4 h-4 mr-2 text-yellow-400" />
                                                    Detailed Breakdown
                                                </h6>
                                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                                    {Object.entries(analysis.breakdown).map(([key, value]) => (
                                                        <div key={key} className="bg-gray-900/50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-400 mb-1 capitalize">
                                                                {key.replace(/([A-Z])/g, ' $1').trim()}
                                                            </p>
                                                            <p className="text-xl font-bold text-purple-400">{value}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Recommendations */}
                                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                                                <h6 className="text-sm font-semibold text-white mb-2 flex items-center">
                                                    <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                                                    AI Recommendations
                                                </h6>
                                                <ul className="space-y-1">
                                                    {analysis.recommendations.map((rec, idx) => (
                                                        <li key={idx} className="text-sm text-gray-300 flex items-start">
                                                            <span className="text-blue-400 mr-2">•</span>
                                                            {rec}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {project.isFunded ? (
                                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                            <p className="text-green-400 font-semibold flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                ✅ Grant Distributed - Project Funded!
                                            </p>
                                        </div>
                                    ) : project.isApproved ? (
                                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                                            <p className="text-yellow-400 font-semibold">
                                                ⏳ Approved - Awaiting Fund Distribution
                                            </p>
                                        </div>
                                    ) : analysis ? (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    e.nativeEvent.stopImmediatePropagation();
                                                    handleVote(project.id, true, e);
                                                }}
                                                disabled={isPending || isConfirming || votingProjectId !== null}
                                                type="button"
                                                className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center"
                                            >
                                                {votingProjectId === project.id && votingSupport === true && isPending ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Confirming Approve...
                                                    </>
                                                ) : votingProjectId === project.id && votingSupport === true && isConfirming ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Processing Approve...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ThumbsUp className="w-5 h-5 mr-2" />
                                                        Approve Grant
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    e.nativeEvent.stopImmediatePropagation();
                                                    handleVote(project.id, false, e);
                                                }}
                                                disabled={isPending || isConfirming || votingProjectId !== null}
                                                type="button"
                                                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center"
                                            >
                                                {votingProjectId === project.id && votingSupport === false && isPending ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Confirming Reject...
                                                    </>
                                                ) : votingProjectId === project.id && votingSupport === false && isConfirming ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Processing Reject...
                                                    </>
                                                ) : (
                                                    <>
                                                        <ThumbsDown className="w-5 h-5 mr-2" />
                                                        Reject
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                                            <p className="text-purple-400 text-sm flex items-center">
                                                <Brain className="w-4 h-4 mr-2" />
                                                💡 Analyze this project with AI first to see detailed insights and scoring
                                            </p>
                                        </div>
                                    )}

                                    {/* Success Message */}
                                    {isSuccess && votingProjectId === project.id && (
                                        <div className="mt-3 bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                                            <p className="text-green-400 text-sm flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                ✅ Vote recorded on blockchain successfully!
                                            </p>
                                        </div>
                                    )}

                                    {/* Error Display */}
                                    {isError && votingProjectId === project.id && (
                                        <div className="mt-3 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                            <p className="text-red-400 text-sm flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-2" />
                                                Error: {error?.message || 'Failed to submit vote'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-purple-400" />
                    How AI-Assisted Voting Works
                </h4>
                <ol className="space-y-2 text-gray-300 text-sm">
                    <li>1. <strong>AI Analysis:</strong> Click "Analyze with AI" to get detailed project evaluation</li>
                    <li>2. <strong>Review Score:</strong> AI provides impact score (0-100) and detailed breakdown</li>
                    <li>3. <strong>Make Decision:</strong> Use AI insights to make informed voting decision</li>
                    <li>4. <strong>Vote on Blockchain:</strong> Your vote is permanently recorded on Celo blockchain</li>
                    <li>5. <strong>Automatic Distribution:</strong> When 3/5 companies approve, grant is auto-distributed</li>
                </ol>
                <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                    <p className="text-blue-400 text-sm">
                        ✨ <strong>AI Analysis includes:</strong> Code quality, community engagement, sustainability,
                        impact potential, innovation score, and actionable recommendations.
                    </p>
                </div>
            </div>
        </div>
    );
}
