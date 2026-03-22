"use client";

import { useState, useEffect, useRef } from "react";
import { useShare, copyToClipboard } from "@/lib/useShare";
import { useAuth } from "../../lib/authContext";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { AppBarConfig } from "@/lib/appBarContext";
import { IconButton } from "@/components/ui/IconButton";
import { ArrowLeft } from "@/components/ui/icons/ArrowLeft";
import { Block } from "@/components/ui/icons/Block";
import { Edit } from "@/components/ui/icons/Edit";
import { Link } from "@/components/ui/icons/Link";
import { Logout } from "@/components/ui/icons/Logout";
import { Overflow } from "@/components/ui/icons/Overflow";
import { Share } from "@/components/ui/icons/Share";
import { Person } from "@/components/ui/icons/Person";
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
import { Profile } from "../../components/Profile";
import { FullLogo } from "@/components/ui/Logo";
import EditProfileModal from "../../components/modals/EditProfileModal";
import FollowsModal from "../../components/modals/FollowsModal";
import { Sheet, ConfirmSheet } from "../../components/ui/Sheet";
import type { SheetItem } from "../../components/ui/Sheet";
import type { Profile as ProfileData } from "@/types";

interface ProfileHeaderProps {
  profile: ProfileData;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user } = useAuth();
  const router = useRouter();
  const isOwnProfile = user?.id === profile.id;

  const [canGoBack, setCanGoBack] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isConfirmBlockOpen, setIsConfirmBlockOpen] = useState(false);
  const [isConfirmUnblockOpen, setIsConfirmUnblockOpen] = useState(false);
  const overflowRef = useRef<HTMLButtonElement>(null);
  const { canShare, share } = useShare();
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
    setCanGoBack(window.history.length > 1);
  }, []);

  useEffect(() => {
    if (!user || isOwnProfile) return;
    getRelationship(user.id, profile.id).then(setRelationship);
  }, [user, profile.id, isOwnProfile]);

  function handleEditSuccess() {
    router.refresh();
  }

  async function handleFollow() {
    if (!user) {
      router.push("/signin");
      return;
    }
    if (!relationship) return;
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
      router.refresh();
    } else {
      const wasFollowing = relationship.following;
      await blockUser(user.id, profile.id);
      setRelationship((r) => r && { ...r, blocking: true, following: false });
      if (wasFollowing) {
        setCounts((c) => c && { ...c, followers: c.followers - 1 });
      }
    }
  }

  function copyProfileUrl() {
    copyToClipboard(`${window.location.origin}/${profile.username}`);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/signin");
  }

  const shareItem: SheetItem = {
    label: "Share profile",
    onClick: () => share(`${window.location.origin}/${profile.username}`),
    icon: <Share />,
  };
  const logOutItem: SheetItem = {
    label: "Log out",
    onClick: handleSignOut,
    variant: "danger",
    icon: <Logout />,
  };

  const sheetItems: SheetItem[] = isOwnProfile
    ? [
        ...(canShare ? [shareItem] : []),
        {
          label: "Edit profile",
          onClick: () => setIsEditModalOpen(true),
          icon: <Edit />,
        },
        { label: "Copy profile URL", onClick: copyProfileUrl, icon: <Link /> },
        logOutItem,
      ]
    : [
        ...(canShare ? [shareItem] : []),
        {
          label: "Remove follower [TODO]",
          onClick: () => {
            /* TODO */
          },
          icon: <Person />,
        },
        { label: "Copy profile URL", onClick: copyProfileUrl, icon: <Link /> },
        relationship?.blocking
          ? {
              label: `Unblock @${profile.username}`,
              onClick: () => setIsConfirmUnblockOpen(true),
              variant: "danger" as const,
              icon: <Block />,
            }
          : {
              label: `Block @${profile.username}`,
              onClick: () => setIsConfirmBlockOpen(true),
              variant: "danger",
              icon: <Block />,
            },
      ];

  const profileType = isOwnProfile
    ? "yours"
    : relationship?.blocking
      ? "blocked"
      : relationship?.following
        ? "friend"
        : "others";

  return (
    <>
      <AppBarConfig
        left={
          !user ? (
            <NextLink href="/" className="cursor-pointer">
              <FullLogo />
            </NextLink>
          ) : !isOwnProfile || canGoBack ? (
            <IconButton
              variant="secondary"
              mobileTransparent
              icon={<ArrowLeft />}
              label="Back"
              onClick={() => router.back()}
            />
          ) : undefined
        }
        center={
          <p className="text-body-xs text-secondary lg:hidden">
            @{profile.username}
          </p>
        }
        right={
          !user ? (
            <NextLink href="/signin" className="text-body-sm-bold text-primary">
              Sign in
            </NextLink>
          ) : (
            <IconButton
              variant="secondary"
              mobileTransparent
              icon={<Overflow orientation="horizontal" />}
              label="More options"
              ref={overflowRef}
              onClick={() => setIsSheetOpen((s) => !s)}
            />
          )
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
        onFollow={
          !user
            ? undefined
            : relationship?.blocking
              ? () => setIsConfirmUnblockOpen(true)
              : handleFollow
        }
        onFollowersClick={() =>
          user
            ? setFollowsModal({ open: true, tab: "followers" })
            : router.push("/signin")
        }
        onFollowingClick={() =>
          user
            ? setFollowsModal({ open: true, tab: "following" })
            : router.push("/signin")
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
        onFollowBack={() => setCounts((c) => c && { ...c, following: c.following + 1 })}
      />

      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        anchorRef={overflowRef}
        title="Options"
        items={sheetItems}
      />

      <ConfirmSheet
        isOpen={isConfirmBlockOpen}
        onClose={() => setIsConfirmBlockOpen(false)}
        title="Are you sure?"
        items={[
          { label: "Never mind", onClick: () => {} },
          {
            label: `Yes, block @${profile.username}`,
            onClick: handleBlock,
            variant: "danger",
          },
        ]}
      />

      <ConfirmSheet
        isOpen={isConfirmUnblockOpen}
        onClose={() => setIsConfirmUnblockOpen(false)}
        title="Are you sure?"
        items={[
          { label: "Never mind", onClick: () => {} },
          {
            label: `Yes, unblock @${profile.username}`,
            onClick: handleBlock,
            variant: "danger",
          },
        ]}
      />
    </>
  );
}
