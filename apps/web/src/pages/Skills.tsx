import { useEffect, useState } from 'react';
import { skillApi } from '@/services/api';
import type { Skill, UserSkill, SkillType, SkillLevel } from '@swaply/shared';
import toast from 'react-hot-toast';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [mySkills, setMySkills] = useState<{ canTeach: UserSkill[]; wantToLearn: UserSkill[] }>({
    canTeach: [],
    wantToLearn: [],
  });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSkillType, setSelectedSkillType] = useState<SkillType | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [skillsRes, mySkillsRes] = await Promise.all([
        skillApi.getAllSkills(),
        skillApi.getMySkills(),
      ]);

      setSkills(skillsRes.data.data?.skills || []);
      setMySkills(mySkillsRes.data.data || { canTeach: [], wantToLearn: [] });
    } catch (error) {
      toast.error('Failed to fetch skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (skillId: string, level: SkillLevel) => {
    if (!selectedSkillType) return;

    try {
      await skillApi.addUserSkill({
        skillId,
        skillType: selectedSkillType,
        level,
      } as any);

      toast.success('Skill added successfully');
      setShowAddModal(false);
      setSelectedSkillType(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (id: string) => {
    try {
      await skillApi.removeUserSkill(id);
      toast.success('Skill removed');
      fetchData();
    } catch (error) {
      toast.error('Failed to remove skill');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Skills</h1>
        <p className="mt-2 text-gray-600">
          Manage the skills you can teach and want to learn
        </p>
      </div>

      {/* Skills I Can Teach */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Skills I Can Teach</h2>
          <button
            onClick={() => {
              setSelectedSkillType('can_teach' as SkillType);
              setShowAddModal(true);
            }}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Skill
          </button>
        </div>

        {mySkills.canTeach.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No teaching skills added yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySkills.canTeach.map((userSkill) => (
              <div
                key={userSkill.id}
                className="border border-gray-200 rounded-lg p-4 flex items-start justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{userSkill.skill?.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">{userSkill.level}</p>
                  {userSkill.yearsOfExperience && (
                    <p className="text-xs text-gray-500 mt-1">
                      {userSkill.yearsOfExperience} years experience
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveSkill(userSkill.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Skills I Want to Learn */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Skills I Want to Learn</h2>
          <button
            onClick={() => {
              setSelectedSkillType('want_to_learn' as SkillType);
              setShowAddModal(true);
            }}
            className="btn btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-1" />
            Add Skill
          </button>
        </div>

        {mySkills.wantToLearn.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No learning skills added yet
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mySkills.wantToLearn.map((userSkill) => (
              <div
                key={userSkill.id}
                className="border border-gray-200 rounded-lg p-4 flex items-start justify-between"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{userSkill.skill?.name}</h3>
                  <p className="text-sm text-gray-600 capitalize">Target: {userSkill.level}</p>
                </div>
                <button
                  onClick={() => handleRemoveSkill(userSkill.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">Add Skill</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 cursor-pointer"
                  onClick={() => handleAddSkill(skill.id, 'intermediate' as SkillLevel)}
                >
                  <h4 className="font-medium text-gray-900">{skill.name}</h4>
                  <p className="text-sm text-gray-600 capitalize">{skill.category}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setSelectedSkillType(null);
                }}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
