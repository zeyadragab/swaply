import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/services/api';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    country: user?.country || '',
    timeZone: user?.timeZone || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await userApi.updateMe(formData);
      updateUser(response.data.data!.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-outline"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                className="mt-1 input disabled:bg-gray-100"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                disabled={!isEditing}
                className="mt-1 input disabled:bg-gray-100"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bio
            </label>
            <textarea
              rows={4}
              disabled={!isEditing}
              className="mt-1 input disabled:bg-gray-100"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell others about yourself..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                disabled={!isEditing}
                className="mt-1 input disabled:bg-gray-100"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time Zone
              </label>
              <input
                type="text"
                disabled={!isEditing}
                className="mt-1 input disabled:bg-gray-100"
                value={formData.timeZone}
                onChange={(e) => setFormData({ ...formData, timeZone: e.target.value })}
                placeholder="e.g., America/New_York"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              disabled={!isEditing}
              className="mt-1 input disabled:bg-gray-100"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Stats Section */}
      <div className="mt-8 grid grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Teaching Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Lessons</span>
              <span className="font-semibold">{user?.totalLessonsTaught}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Teaching Hours</span>
              <span className="font-semibold">{user?.totalTeachingHours?.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Rating</span>
              <span className="font-semibold">{user?.averageRatingAsTeacher?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Lessons</span>
              <span className="font-semibold">{user?.totalLessonsAttended}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Learning Hours</span>
              <span className="font-semibold">{user?.totalLearningHours?.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-semibold">{user?.currentStreak} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
