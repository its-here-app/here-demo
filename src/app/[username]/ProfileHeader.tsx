"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/navigation";
import {
  signOut,
  getRelationship,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  getFollowerCount,
  getFollowingCount,
} from "@/lib/services/users";
import EditProfileModal from "../../components/EditProfileModal";
import FollowsModal from "../../components/FollowsModal";
import type { Profile } from "@/types";

interface ProfileHeaderProps {
  profile: Profile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isOwnProfile = user?.id === profile.id;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [followsModal, setFollowsModal] = useState<{
    open: boolean;
    tab: "followers" | "following";
  }>({ open: false, tab: "followers" });
  const [counts, setCounts] = useState<{
    followers: number;
    following: number;
  } | null>(null);
  const [relationship, setRelationship] = useState<{
    following: boolean;
    blocking: boolean;
    blockedBy: boolean;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      getFollowerCount(profile.id),
      getFollowingCount(profile.id),
    ]).then(([followers, following]) => setCounts({ followers, following }));
  }, [profile.id]);

  useEffect(() => {
    if (!user || isOwnProfile) return;
    getRelationship(user.id, profile.id).then(setRelationship);
  }, [user, profile.id, isOwnProfile]);

  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  function handleEditSuccess() {
    router.refresh();
  }

  async function handleFollow() {
    if (!user || !relationship) return;
    if (relationship.following) {
      await unfollowUser(user.id, profile.id);
      setRelationship((r) => r && { ...r, following: false });
      setCounts((c) => c && { ...c, followers: c.followers - 1 });
    } else {
      await followUser(user.id, profile.id);
      setRelationship((r) => r && { ...r, following: true });
      setCounts((c) => c && { ...c, followers: c.followers + 1 });
    }
  }

  async function handleBlock() {
    if (!user || !relationship) return;
    if (relationship.blocking) {
      await unblockUser(user.id, profile.id);
      setRelationship((r) => r && { ...r, blocking: false });
    } else {
      const wasFollowing = relationship.following;
      await blockUser(user.id, profile.id);
      setRelationship((r) => r && { ...r, blocking: true, following: false });
      if (wasFollowing) {
        setCounts((c) => c && { ...c, followers: c.followers - 1 });
      }
    }
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
                alt={profile.full_name}
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
            <h1 className="text-2xl font-bold mb-1">{profile.full_name}</h1>
            <p className="text-gray-600 mb-4">@{profile.username}</p>

            {profile.bio && <p className="text-gray-700 mb-4">{profile.bio}</p>}

            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => setFollowsModal({ open: true, tab: "followers" })}
                className="text-sm hover:underline"
              >
                <span className="font-semibold text-gray-900">
                  {counts?.followers ?? "—"}
                </span>{" "}
                <span className="text-gray-500">followers</span>
              </button>
              <button
                onClick={() => setFollowsModal({ open: true, tab: "following" })}
                className="text-sm hover:underline"
              >
                <span className="font-semibold text-gray-900">
                  {counts?.following ?? "—"}
                </span>{" "}
                <span className="text-gray-500">following</span>
              </button>
            </div>

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

            {!isOwnProfile && user && relationship && (
              <div className="mt-6 flex gap-3">
                {!relationship.blocking && (
                  <button
                    onClick={handleFollow}
                    disabled={relationship.blockedBy}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {relationship.following ? "Following" : "Follow"}
                  </button>
                )}
                <button
                  onClick={handleBlock}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  {relationship.blocking ? "Unblock" : "Block"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <FollowsModal
        isOpen={followsModal.open}
        onClose={() => setFollowsModal((s) => ({ ...s, open: false }))}
        profileId={profile.id}
        profileName={profile.full_name}
        initialTab={followsModal.tab}
        currentUserId={user?.id}
      />
    </>
  );
}
