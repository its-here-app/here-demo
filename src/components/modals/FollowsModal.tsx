"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { BottomPanel } from "../ui/BottomPanel";
import { Tab, Tabs } from "../ui/Tabs";
import { getFollowers, getFollowing } from "@/lib/services/users";
import type { FollowUser } from "@/lib/services/users";

interface FollowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  profileName: string;
  initialTab: "followers" | "following";
  currentUserId?: string;
  followerCount?: number;
  followingCount?: number;
}

export default function FollowsModal({
  isOpen,
  onClose,
  profileId,
  profileName,
  initialTab,
  currentUserId,
  followerCount,
  followingCount,
}: FollowsModalProps) {
  const [tab, setTab] = useState<"followers" | "following">(initialTab);
  const [followers, setFollowers] = useState<FollowUser[] | null>(null);
  const [following, setFollowing] = useState<FollowUser[] | null>(null);

  useEffect(() => {
    setTab(initialTab);
    setFollowers(null);
    setFollowing(null);
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    if (tab === "followers" && followers === null) {
      getFollowers(profileId, currentUserId).then(setFollowers);
    } else if (tab === "following" && following === null) {
      getFollowing(profileId, currentUserId).then(setFollowing);
    }
  }, [isOpen, tab, profileId, currentUserId, followers, following]);

  function renderList(list: FollowUser[] | null, emptyMsg: string) {
    if (list === null)
      return (
        <p className="text-center text-white/40 py-8 text-body-xs">
          Loading...
        </p>
      );
    if (list.length === 0)
      return (
        <p className="text-center text-white/40 py-8 text-body-xs">
          {emptyMsg}
        </p>
      );
    return (
      <ul className="-mt-2">
        {list.map((u) => (
          <li key={u.id}>
            <Link
              href={`/${u.username}`}
              onClick={onClose}
              className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-2 -mx-2 transition-colors"
            >
              <Avatar size="lg" src={u.avatar_url ?? undefined} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-body-xs text-white truncate">
                    {u.full_name}
                  </p>
                  {u.mutual && (
                    <span className="text-body-xs text-grey flex-shrink-0">
                      Mutual
                    </span>
                  )}
                </div>
                <p className="text-body-xs text-grey truncate">@{u.username}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <BottomPanel
      isOpen={isOpen}
      onClose={onClose}
      header={`@${profileName}`}
      centerHeader
      mobileHeight="30rem"
      desktopVariant="floating"
      desktopWidth="43rem"
      desktopHeight="440px"
    >
      {/* Tabs */}
      <Tabs className="">
        <Tab
          title={
            followingCount != null ? `${followingCount} Following` : "Following"
          }
          active={tab === "following"}
          onClick={() => setTab("following")}
        />
        <Tab
          title={
            followerCount != null ? `${followerCount} Followers` : "Followers"
          }
          active={tab === "followers"}
          onClick={() => setTab("followers")}
        />
      </Tabs>

      {/* Sliding user lists */}
      <div
        className={`flex w-[210%] transition-transform duration-400 ease-in-out ${
          tab === "following" ? "translate-x-0" : "-translate-x-1/2"
        }`}
      >
        <div className="w-1/2">
          {renderList(following, "Not following anyone yet.")}
        </div>
        <div className="w-1/2">
          {renderList(followers, "No followers yet.")}
        </div>
      </div>
    </BottomPanel>
  );
}
