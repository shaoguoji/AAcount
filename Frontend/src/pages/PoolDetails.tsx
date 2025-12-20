import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { ArrowDownLeft, ArrowUpRight, Wallet, User, Calendar, Loader2 } from 'lucide-react';
import { AAcountPoolABI } from '../contracts';



export const PoolDetails: React.FC = () => {
    const { address } = useParams<{ address: string }>();
    const { address: userAddress } = useAccount();
    const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'members' | 'rules'>('overview');

    // Rules Form State
    const [ruleName, setRuleName] = useState('');
    const [ruleDescription, setRuleDescription] = useState('');
    const [ruleAmount, setRuleAmount] = useState('');
    const [ruleType, setRuleType] = useState<0 | 1>(0); // 0: INFLOW, 1: OUTFLOW

    // Contract Reads
    const { data: name } = useReadContract({
        address: address as `0x${string}`,
        abi: AAcountPoolABI,
        functionName: 'name',
    });

    const { data: description } = useReadContract({
        address: address as `0x${string}`,
        abi: AAcountPoolABI,
        functionName: 'description',
    });

    const { data: balance, refetch: refetchBalance } = useReadContract({
        address: address as `0x${string}`,
        abi: AAcountPoolABI,
        functionName: 'getBalance',
    });

    const { data: creator } = useReadContract({
        address: address as `0x${string}`,
        abi: AAcountPoolABI,
        functionName: 'creator',
    });

    const { data: isOrganizer } = useReadContract({
        address: address as `0x${string}`,
        abi: AAcountPoolABI,
        functionName: 'isOrganizer',
        args: [userAddress || '0x0000000000000000000000000000000000000000'],
    });

    const { data: transactions, refetch: refetchTx } = useReadContract({
        address: address as `0x${string}`,
        abi: AAcountPoolABI,
        functionName: 'getTransactions',
    });

    const { data: organizers, refetch: refetchOrganizers } = useReadContract({
        address: address as `0x${string}`,
        abi: AAcountPoolABI,
        functionName: 'getOrganizers',
    });

    const { data: rules, refetch: refetchRules } = useReadContract({
        address: address as `0x${string}`,
        abi: AAcountPoolABI,
        functionName: 'getRules',
    });

    // Actions
    const { data: hash, writeContract, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Forms State
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [recipient, setRecipient] = useState('');
    const [actionType, setActionType] = useState<'deposit' | 'withdraw' | 'addOrganizer'>('deposit');

    React.useEffect(() => {
        if (isSuccess) {
            setAmount('');
            setReason('');
            setRecipient('');
            refetchBalance();
            refetchTx();
            refetchOrganizers();
            refetchRules();
        }
    }, [isSuccess, refetchBalance, refetchTx, refetchOrganizers, refetchRules]);

    const handleCreateRule = (e: React.FormEvent) => {
        e.preventDefault();
        writeContract({
            address: address as `0x${string}`,
            abi: AAcountPoolABI,
            functionName: 'createRule',
            args: [ruleName, ruleType, parseEther(ruleAmount || '0'), ruleDescription],
        });
    };

    const handleAction = (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) return;

        if (actionType === 'deposit') {
            writeContract({
                address: address as `0x${string}`,
                abi: AAcountPoolABI,
                functionName: 'deposit',
                args: [reason || 'Deposit'],
                value: parseEther(amount),
            });
        } else if (actionType === 'withdraw') {
            writeContract({
                address: address as `0x${string}`,
                abi: AAcountPoolABI,
                functionName: 'withdraw',
                args: [recipient as `0x${string}`, parseEther(amount), reason],
            });
        } else if (actionType === 'addOrganizer') {
            writeContract({
                address: address as `0x${string}`,
                abi: AAcountPoolABI,
                functionName: 'addOrganizer',
                args: [recipient as `0x${string}`],
            });
        }
    };

    if (!name) return <div className="p-8 text-center text-gray-500">Loading Pool...</div>;

    const txList = (transactions as any[]) || [];

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{String(name)}</h1>
                        <p className="text-gray-500 max-w-2xl">{String(description)}</p>
                    </div>
                    <div className="bg-blue-50 px-6 py-3 rounded-xl">
                        <div className="text-sm text-blue-600 font-medium mb-1">Total Balance</div>
                        <div className="text-3xl font-bold text-gray-900">
                            {balance ? formatEther(balance as bigint) : '0'} ETH
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'overview' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Overview & History
                    {activeTab === 'overview' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('actions')}
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'actions' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Actions
                    {activeTab === 'actions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('members')}
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'members' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Members
                    {activeTab === 'members' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('rules')}
                    className={`px-4 py-2 font-medium text-sm transition-colors relative ${activeTab === 'rules' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Rules
                    {activeTab === 'rules' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></div>}
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                    </div>
                    {txList.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">No transactions recorded yet.</div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {[...txList].reverse().map((tx: any) => {
                                const type = Number(tx.activityType); // 0: DEPOSIT, 1: WITHDRAW, 2: ADD_ORGANIZER, 3: JOIN

                                let icon = <ArrowDownLeft size={20} />;
                                let colorClass = 'bg-gray-100 text-gray-600';
                                let amountSign = '';
                                let amountColor = 'text-gray-900';

                                if (type === 0) { // DEPOSIT
                                    icon = <ArrowDownLeft size={20} />;
                                    colorClass = 'bg-green-100 text-green-600';
                                    amountSign = '+';
                                    amountColor = 'text-green-600';
                                } else if (type === 1) { // WITHDRAW
                                    icon = <ArrowUpRight size={20} />;
                                    colorClass = 'bg-red-100 text-red-600';
                                    amountSign = '-';
                                    amountColor = 'text-red-600';
                                } else if (type === 2) { // ADD_ORGANIZER
                                    icon = <User size={20} />;
                                    colorClass = 'bg-purple-100 text-purple-600';
                                    amountSign = '';
                                    amountColor = 'text-gray-500';
                                } else if (type === 3) { // JOIN
                                    icon = <User size={20} />;
                                    colorClass = 'bg-blue-100 text-blue-600';
                                    amountSign = '';
                                    amountColor = 'text-gray-500';
                                }

                                return (
                                    <div key={String(tx.id)} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${colorClass}`}>
                                                {icon}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{tx.description || 'No description'}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <User size={12} /> {tx.initiator.slice(0, 6)}...{tx.initiator.slice(-4)}
                                                    <span className="mx-1">•</span>
                                                    <Calendar size={12} /> {new Date(Number(tx.timestamp) * 1000).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`font-bold ${amountColor}`}>
                                            {amountSign}{tx.amount > 0n ? formatEther(tx.amount) : '0'} ETH
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Actions Tab */}
            {activeTab === 'actions' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Deposit Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Wallet className="text-blue-600" /> Deposit Funds
                        </h2>
                        <div className="space-y-4">
                            <input
                                type="number"
                                placeholder="Amount (ETH)"
                                value={actionType === 'deposit' ? amount : ''}
                                onChange={(e) => { setAmount(e.target.value); setActionType('deposit'); }}
                                onClick={() => setActionType('deposit')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Reason (e.g. Event Ticket)"
                                value={actionType === 'deposit' ? reason : ''}
                                onChange={(e) => { setReason(e.target.value); setActionType('deposit'); }}
                                onClick={() => setActionType('deposit')}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleAction}
                                disabled={isPending || isConfirming || actionType !== 'deposit'}
                                className={`w-full py-2 rounded-lg font-medium text-white transition-all ${actionType === 'deposit' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300'}`}
                            >
                                {isPending && actionType === 'deposit' ? <Loader2 className="animate-spin mx-auto" /> : 'Confirm Deposit'}
                            </button>
                        </div>
                    </div>

                    {/* Organizer Actions */}
                    {(isOrganizer || creator === userAddress) && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <User className="text-purple-600" /> Organizer Actions
                            </h2>
                            <div className="space-y-6">
                                {/* Withdraw */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Withdraw / Reimburse</h3>
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            placeholder="Recipient Address"
                                            value={actionType === 'withdraw' ? recipient : ''}
                                            onChange={(e) => { setRecipient(e.target.value); setActionType('withdraw'); }}
                                            onClick={() => setActionType('withdraw')}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                placeholder="Amount"
                                                value={actionType === 'withdraw' ? amount : ''}
                                                onChange={(e) => { setAmount(e.target.value); setActionType('withdraw'); }}
                                                onClick={() => setActionType('withdraw')}
                                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={actionType === 'withdraw' ? reason : ''}
                                                onChange={(e) => { setReason(e.target.value); setActionType('withdraw'); }}
                                                onClick={() => setActionType('withdraw')}
                                                className="w-1/2 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAction}
                                            disabled={isPending || isConfirming || actionType !== 'withdraw'}
                                            className={`w-full py-2 rounded-lg font-medium text-white transition-all ${actionType === 'withdraw' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300'}`}
                                        >
                                            {isPending && actionType === 'withdraw' ? <Loader2 className="animate-spin mx-auto" /> : 'Process Withdrawal'}
                                        </button>
                                    </div>
                                </div>

                                {creator === userAddress && (
                                    <div className="pt-4 border-t border-gray-100">
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Add New Organizer</h3>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="New Organizer Address"
                                                value={actionType === 'addOrganizer' ? recipient : ''}
                                                onChange={(e) => { setRecipient(e.target.value); setActionType('addOrganizer'); }}
                                                onClick={() => setActionType('addOrganizer')}
                                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                                            />
                                            <button
                                                onClick={handleAction}
                                                disabled={isPending || isConfirming || actionType !== 'addOrganizer'}
                                                className={`px-4 py-2 rounded-lg font-medium text-white transition-all ${actionType === 'addOrganizer' ? 'bg-gray-800 hover:bg-gray-900' : 'bg-gray-300'}`}
                                            >
                                                {isPending && actionType === 'addOrganizer' ? <Loader2 className="animate-spin" /> : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Organizers</h2>
                    {(!organizers || (organizers as any[]).length === 0) ? (
                        <div className="text-gray-500">No organizers found.</div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {(organizers as string[]).map((org) => (
                                <li key={org} className="py-3 flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                                            <User size={16} />
                                        </div>
                                        <span className="text-gray-700 font-mono text-sm">{org}</span>
                                    </div>
                                    {org === creator && (
                                        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">Creator</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* Rules Tab */}
            {activeTab === 'rules' && (
                <div className="space-y-6">
                    {/* Create Rule Form (Organizers Only) */}
                    {(isOrganizer || creator === userAddress) && (
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900">Create New Operating Rule</h2>
                            <form onSubmit={handleCreateRule} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name</label>
                                        <input
                                            type="text"
                                            value={ruleName}
                                            onChange={(e) => setRuleName(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g. Monthly Fee"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ETH)</label>
                                        <input
                                            type="number"
                                            value={ruleAmount}
                                            onChange={(e) => setRuleAmount(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="0 for dynamic amount"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="ruleType"
                                                checked={ruleType === 0}
                                                onChange={() => setRuleType(0)}
                                                className="mr-2"
                                            />
                                            Inflow (Collection/Deposit)
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="ruleType"
                                                checked={ruleType === 1}
                                                onChange={() => setRuleType(1)}
                                                className="mr-2"
                                            />
                                            Outflow (Expense/Refund)
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <input
                                        type="text"
                                        value={ruleDescription}
                                        onChange={(e) => setRuleDescription(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Brief description of this rule"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isPending || isConfirming}
                                    className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition disabled:opacity-50"
                                >
                                    {isPending ? <Loader2 className="animate-spin" size={20} /> : 'Create Rule'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Rules List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">Active Rules</h2>
                        </div>
                        {(!rules || (rules as any[]).length === 0) ? (
                            <div className="p-8 text-center text-gray-500">No rules defined yet.</div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {(rules as any[]).map((rule, idx) => (
                                    <div key={idx} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${rule.ruleType === 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {rule.ruleType === 0 ? 'Inflow' : 'Outflow'}
                                                </span>
                                                <h3 className="font-bold text-gray-900">{rule.name}</h3>
                                            </div>
                                            <p className="text-gray-500 text-sm mb-1">{rule.description}</p>
                                            <div className="text-sm font-medium text-gray-900">
                                                {rule.amount > 0n ? `${formatEther(rule.amount)} ETH` : 'Dynamic Amount'}
                                            </div>
                                        </div>

                                        {rule.ruleType === 0 && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        const link = `${window.location.origin}/pool/${address}/pay/${idx}`;
                                                        navigator.clipboard.writeText(link);
                                                        alert('Payment link copied!');
                                                    }}
                                                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                                                >
                                                    Copy Payment Link
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PoolDetails;
