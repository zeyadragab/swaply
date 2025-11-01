import { useEffect, useState } from 'react';
import { tokenApi } from '@/services/api';
import type { TokenTransaction } from '@swaply/shared';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { CurrencyDollarIcon, ArrowUpIcon, ArrowDownIcon, GiftIcon } from '@heroicons/react/24/outline';

export default function Tokens() {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, balanceRes] = await Promise.all([
        tokenApi.getTransactions({ limit: 50 }),
        tokenApi.getBalance(),
      ]);

      setTransactions(transactionsRes.data.data?.transactions || []);
      setBalance(balanceRes.data.data?.balance || 0);
      setTotalEarned(balanceRes.data.data?.totalEarned || 0);
      setTotalSpent(balanceRes.data.data?.totalSpent || 0);
    } catch (error) {
      toast.error('Failed to fetch token data');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimDaily = async () => {
    try {
      const response = await tokenApi.claimDailyChallenge();
      toast.success(`Claimed ${response.data.data?.tokensEarned} tokens!`);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to claim daily tokens');
    }
  };

  const getTransactionIcon = (type: string) => {
    if (type.includes('earned') || type === 'purchased' || type === 'refund') {
      return <ArrowUpIcon className="h-5 w-5 text-green-600" />;
    }
    return <ArrowDownIcon className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tokens</h1>
        <p className="mt-2 text-gray-600">Manage your token balance and transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-primary-500 p-3 rounded-lg">
              <CurrencyDollarIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Balance</p>
              <p className="text-3xl font-bold text-gray-900">{balance}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-500 p-3 rounded-lg">
              <ArrowUpIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Earned</p>
              <p className="text-3xl font-bold text-gray-900">{totalEarned}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-red-500 p-3 rounded-lg">
              <ArrowDownIcon className="h-8 w-8 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900">{totalSpent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Earn More Tokens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleClaimDaily}
            className="btn btn-primary flex items-center justify-center"
          >
            <GiftIcon className="h-5 w-5 mr-2" />
            Claim Daily Tokens
          </button>
          <button className="btn btn-outline">Purchase Tokens</button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>

        {loading ? (
          <p className="text-center py-8 text-gray-500">Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No transactions yet</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {format(new Date(transaction.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-semibold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount}
                  </p>
                  <p className="text-sm text-gray-600">Balance: {transaction.balanceAfter}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
