'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useReadContract, useAccount } from 'wagmi';
import { parseUnits } from 'viem';
import { FileText, DollarSign, CheckCircle, AlertCircle, Loader2, Github } from 'lucide-react';

export default function ProjectProposal() {
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [githubUrl, setGithubUrl] = useState('');
    const [requestedAmount, setRequestedAmount] = useState('');
    const { address } = useAccount();

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

    const { data: hash, writeContract, isPending, isError, error } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    const handleProposeProject = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!projectName || !description || !githubUrl || !requestedAmount) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const amountInWei = parseUnits(requestedAmount, 18); // cUSD has 18 decimals

            writeContract({
                address: contractAddress,
                abi: [
                    {
                        inputs: [
                            { name: '_name', type: 'string' },
                            { name: '_description', type: 'string' },
                            { name: '_githubUrl', type: 'string' },
                            { name: '_requestedAmount', type: 'uint256' }
                        ],
                        name: 'proposeProject',
                        outputs: [{ name: '', type: 'uint256' }],
                        stateMutability: 'nonpayable',
                        type: 'function',
                    },
                ],
                functionName: 'proposeProject',
                args: [projectName, description, githubUrl, amountInWei],
            });
        } catch (err) {
            console.error('Error proposing project:', err);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            // Reset form on success
            setProjectName('');
            setDescription('');
            setGithubUrl('');
            setRequestedAmount('');
        }
    }, [isSuccess]);

    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-2 text-green-400" />
                Propose Your Project for Grant
            </h3>

            <form onSubmit={handleProposeProject} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Project Name
                    </label>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="My Awesome DApp"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your project, its impact, and how you'll use the grant..."
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <Github className="w-4 h-4 mr-1" />
                        GitHub Repository URL
                    </label>
                    <input
                        type="url"
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username/repo"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Requested Grant Amount (cUSD)
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={requestedAmount}
                        onChange={(e) => setRequestedAmount(e.target.value)}
                        placeholder="1000"
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        Enter the amount you need for your project development
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isPending || isConfirming}
                    className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white font-semibold transition-colors flex items-center justify-center"
                >
                    {isPending || isConfirming ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            {isPending ? 'Confirm in wallet...' : 'Submitting Proposal...'}
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5 mr-2" />
                            Submit Grant Proposal
                        </>
                    )}
                </button>

                {isSuccess && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center text-green-400">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            <div>
                                <p className="font-semibold">Proposal Submitted Successfully!</p>
                                <p className="text-sm mt-1">Companies will now vote on your grant request</p>
                                {hash && (
                                    <p className="text-xs mt-2 font-mono break-all">Tx: {hash}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isError && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                        <div className="flex items-start text-red-400">
                            <AlertCircle className="w-5 h-5 mr-2 mt-0.5" />
                            <div>
                                <p className="font-semibold">Proposal Failed</p>
                                <p className="text-sm mt-1">{error?.message || 'Unknown error'}</p>
                            </div>
                        </div>
                    </div>
                )}
            </form>

            <div className="mt-6 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <h4 className="text-green-400 font-semibold mb-2">📋 How It Works</h4>
                <ul className="text-sm text-gray-300 space-y-1">
                    <li>• 1. Submit your project with requested grant amount</li>
                    <li>• 2. 5 registered companies will vote on your proposal</li>
                    <li>• 3. If 3+ companies approve, grant is automatically sent to you!</li>
                    <li>• 4. All voting and distribution happens on-chain (transparent)</li>
                </ul>
            </div>
        </div>
    );
}
