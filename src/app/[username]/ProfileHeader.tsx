"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/navigation";
import {
  getRelationship,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  getFollowerCount,
  getFollowingCount,
} from "@/lib/services/users";
import { Profile } from "../../components/ui/Profile";
import { Button } from "../../components/ui/Button";
import EditProfileModal from "../../components/EditProfileModal";
import FollowsModal from "../../components/FollowsModal";
import type { Profile as ProfileData } from "@/types";

interface ProfileHeaderProps {
  profile: ProfileData;
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

  const profileType = isOwnProfile
    ? "yours"
    : relationship?.following
    ? "friend"
    : "others";

  return (
    <>
      <Profile
        type={profileType}
        name={profile.full_name}
        username={profile.username}
        bio={profile.bio ?? undefined}
        avatarSrc={profile.avatar_url ?? undefined}
        followerCount={counts?.followers ?? 0}
        followingCount={counts?.following ?? 0}
        onEditProfile={() => setIsEditModalOpen(true)}
        onFollow={handleFollow}
        onFollowersClick={() => setFollowsModal({ open: true, tab: "followers" })}
        onFollowingClick={() => setFollowsModal({ open: true, tab: "following" })}
      />

      {!isOwnProfile && user && relationship && (
        <div className="flex justify-center mt-2">
          <Button variant="outline" onClick={handleBlock}>
            {relationship.blocking ? "Unblock" : "Block"}
          </Button>
        </div>
      )}

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
