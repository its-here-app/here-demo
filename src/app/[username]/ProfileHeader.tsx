"use client";

import { useState } from "react";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import EditProfileModal from "../../components/EditProfileModal";

interface ProfileHeaderProps {
  profile: {
    id: string;
    name: string;
    username: string;
    bio: string | null;
    avatar_url: string | null;
    created_at: string;
  };
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const isOwnProfile = user?.id === profile.id;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  function handleEditSuccess() {
    // Refresh the page to show updated data
    router.refresh();
  }

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
        {isOwnProfile && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        )}

        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
            <p className="text-gray-600 mb-4">@{profile.username}</p>

            {profile.bio && <p className="text-gray-700 mb-4">{profile.bio}</p>}

            <div className="text-sm text-gray-500">
              <p>
                Joined{" "}
                {new Date(profile.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {isOwnProfile && (
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
