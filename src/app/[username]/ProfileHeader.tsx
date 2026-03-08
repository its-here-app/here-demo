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
  signOut,
} from "@/lib/services/users";
import { NavBar } from "../../components/ui/NavBar";
import { Profile } from "../../components/ui/Profile";
import { IconButton } from "../../components/ui/IconButton";
import { ArrowLeft } from "../../components/ui/icons/ArrowLeft";
import { Overflow } from "../../components/ui/icons/Overflow";
import EditProfileModal from "../../components/EditProfileModal";
import FollowsModal from "../../components/FollowsModal";
import { Sheet } from "../../components/ui/Sheet";
import type { SheetItem } from "../../components/ui/Sheet";
import type { Profile as ProfileData } from "@/types";

interface ProfileHeaderProps {
  profile: ProfileData;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isOwnProfile = user?.id === profile.id;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [canShare, setCanShare] = useState(false);
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
    setCanShare(!!navigator.share);
  }, []);

  useEffect(() => {
    document.dispatchEvent(
      new CustomEvent("profile-mounted", { detail: { isOwnProfile } }),
    );
    return () => {
      document.dispatchEvent(new CustomEvent("profile-unmounted"));
    };
  }, [isOwnProfile]);

  useEffect(() => {
    function handler() {
      setIsSheetOpen(true);
    }
    document.addEventListener("profile-overflow", handler);
    return () => document.removeEventListener("profile-overflow", handler);
  }, []);

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

  function shareProfile() {
    navigator.share({
      title: profile.full_name,
      url: `${window.location.origin}/${profile.username}`,
    });
  }

  function copyProfileUrl() {
    navigator.clipboard.writeText(
      `${window.location.origin}/${profile.username}`,
    );
  }

  async function handleSignOut() {
    await signOut();
    router.push("/signin");
  }

  const shareItem: SheetItem = {
    label: "Share profile",
    onClick: shareProfile,
  };
  const logOutItem: SheetItem = {
    label: "Log out",
    onClick: handleSignOut,
    variant: "danger",
  };

  const sheetItems: SheetItem[] = isOwnProfile
    ? [
        ...(canShare ? [shareItem] : []),
        { label: "Copy profile URL", onClick: copyProfileUrl },
        logOutItem,
      ]
    : [
        ...(canShare ? [shareItem] : []),
        { label: "Copy profile URL", onClick: copyProfileUrl },
        relationship?.blocking
          ? { label: `Unblock @${profile.username}`, onClick: handleBlock }
          : {
              label: `Block @${profile.username}`,
              onClick: handleBlock,
              variant: "danger",
            },
        logOutItem,
      ];

  const profileType = isOwnProfile
    ? "yours"
    : relationship?.following
      ? "friend"
      : "others";

  return (
    <>
      <NavBar
        className="hidden lg:flex -mx-[var(--space-page-sm)] -mt-[var(--space-page)] pt-[var(--space-page)]"
        left={
          !isOwnProfile ? (
            <IconButton
              variant="secondary"
              icon={<ArrowLeft />}
              label="Back"
              onClick={() => router.back()}
            />
          ) : undefined
        }
        right={
          <IconButton
            variant="secondary"
            icon={<Overflow />}
            label="More options"
            onClick={() => setIsSheetOpen(true)}
          />
        }
      />

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
        onFollowersClick={() =>
          setFollowsModal({ open: true, tab: "followers" })
        }
        onFollowingClick={() =>
          setFollowsModal({ open: true, tab: "following" })
        }
      />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />

      <FollowsModal
        isOpen={followsModal.open}
        onClose={() => setFollowsModal((s) => ({ ...s, open: false }))}
        profileId={profile.id}
        profileName={profile.username}
        initialTab={followsModal.tab}
        currentUserId={user?.id}
        followerCount={counts?.followers}
        followingCount={counts?.following}
      />

      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Options"
        items={sheetItems}
      />
    </>
  );
}
