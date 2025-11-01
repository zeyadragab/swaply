import { useEffect, useState } from 'react';
import { sessionApi } from '@/services/api';
import type { Session } from '@swaply/shared';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { CalendarIcon, VideoCameraIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, [filter]);

  const fetchSessions = async () => {
    try {
      const params: any = {};
      if (filter === 'upcoming') {
        params.upcoming = true;
      }

      const response = await sessionApi.getMySessions(params);
      let fetchedSessions = response.data.data?.sessions || [];

      if (filter === 'past') {
        fetchedSessions = fetchedSessions.filter(
          (s) => s.status === 'completed' || s.status === 'cancelled'
        );
      }

      setSessions(fetchedSessions);
    } catch (error) {
      toast.error('Failed to fetch sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSession = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this session?')) return;

    try {
      await sessionApi.cancelSession(id, 'Cancelled by user');
      toast.success('Session cancelled');
      fetchSessions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel session');
    }
  };

  const handleStartSession = async (id: string) => {
    try {
      const response = await sessionApi.startSession(id);
      const { agoraToken, appId } = response.data.data!;

      // In a real app, you would open a video call component here
      toast.success('Session started! Video call feature coming soon.');
      fetchSessions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start session');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sessions</h1>
          <p className="mt-2 text-gray-600">Manage your learning and teaching sessions</p>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-outline'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`btn ${filter === 'past' ? 'btn-primary' : 'btn-outline'}`}
          >
            Past
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : sessions.length === 0 ? (
        <div className="card text-center py-12">
          <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by finding a match!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        session.status
                      )}`}
                    >
                      {session.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Teacher:</span> {session.teacher?.displayName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Learner:</span> {session.learner?.displayName}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Skill:</span> {session.skill?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Date:</span>{' '}
                      {format(new Date(session.scheduledStartTime), 'MMM d, yyyy h:mm a')}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Duration:</span> {session.durationMinutes} minutes
                    </p>
                    {session.tokenCost > 0 && (
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cost:</span> {session.tokenCost} tokens
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {session.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => handleStartSession(session.id)}
                        className="btn btn-primary flex items-center"
                      >
                        <VideoCameraIcon className="h-5 w-5 mr-1" />
                        Start
                      </button>
                      <button
                        onClick={() => handleCancelSession(session.id)}
                        className="btn btn-outline text-red-600 flex items-center"
                      >
                        <XMarkIcon className="h-5 w-5 mr-1" />
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
