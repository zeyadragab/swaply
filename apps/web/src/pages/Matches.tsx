import { useEffect, useState } from 'react';
import { skillApi } from '@/services/api';
import type { User } from '@swaply/shared';
import toast from 'react-hot-toast';
import { UsersIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export default function Matches() {
  const [matches, setMatches] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const response = await skillApi.findMatches(50);
      setMatches(response.data.data?.matches || []);
    } catch (error) {
      toast.error('Failed to fetch matches');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Skill Matches</h1>
        <p className="mt-2 text-gray-600">
          Connect with users who can teach what you want to learn
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : matches.length === 0 ? (
        <div className="card text-center py-12">
          <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No matches found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add more skills to find potential matches
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <div key={match.id} className="card">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {match.firstName?.[0]}{match.lastName?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {match.displayName || `${match.firstName} ${match.lastName}`}
                  </h3>
                  {match.country && (
                    <p className="text-sm text-gray-600">{match.country}</p>
                  )}
                  {match.bio && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{match.bio}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase">Stats</p>
                  <div className="mt-1 flex space-x-4 text-sm">
                    <span className="text-gray-600">
                      {match.totalLessonsTaught} lessons taught
                    </span>
                    <span className="text-gray-600">
                      {match.averageRatingAsTeacher?.toFixed(1) || 'N/A'} rating
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 btn btn-primary flex items-center justify-center">
                  <EnvelopeIcon className="h-5 w-5 mr-1" />
                  Message
                </button>
                <button className="btn btn-outline">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
