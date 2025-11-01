import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { sessionApi, tokenApi } from '@/services/api';
import type { Session } from '@swaply/shared';
import { CalendarIcon, AcademicCapIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, tokensRes] = await Promise.all([
        sessionApi.getMySessions({ upcoming: true }),
        tokenApi.getBalance(),
      ]);

      setUpcomingSessions(sessionsRes.data.data?.sessions || []);
      setTokenBalance(tokensRes.data.data?.balance || 0);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      name: 'Token Balance',
      value: user?.tokenBalance || 0,
      icon: CurrencyDollarIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Lessons Taught',
      value: user?.totalLessonsTaught || 0,
      icon: AcademicCapIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Lessons Attended',
      value: user?.totalLessonsAttended || 0,
      icon: CalendarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Learning Hours',
      value: Math.round(user?.totalLearningHours || 0),
      icon: ClockIcon,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your skill exchange journey
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Sessions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Sessions</h2>
          <Link to="/sessions" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : upcomingSessions.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">No upcoming sessions</p>
            <Link to="/matches" className="mt-4 inline-block btn btn-primary">
              Find Matches
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingSessions.slice(0, 5).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{session.title}</h3>
                  <p className="text-sm text-gray-600">
                    with {session.teacher?.displayName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {format(new Date(session.scheduledStartTime), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(session.scheduledStartTime), 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link to="/skills" className="card hover:shadow-lg transition-shadow">
          <AcademicCapIcon className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Manage Skills</h3>
          <p className="text-sm text-gray-600">Add or update your skills</p>
        </Link>

        <Link to="/matches" className="card hover:shadow-lg transition-shadow">
          <CalendarIcon className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Find Matches</h3>
          <p className="text-sm text-gray-600">Connect with other learners</p>
        </Link>

        <Link to="/tokens" className="card hover:shadow-lg transition-shadow">
          <CurrencyDollarIcon className="h-8 w-8 text-primary-600 mb-2" />
          <h3 className="font-semibold text-gray-900">Get Tokens</h3>
          <p className="text-sm text-gray-600">Purchase or earn more tokens</p>
        </Link>
      </div>
    </div>
  );
}
