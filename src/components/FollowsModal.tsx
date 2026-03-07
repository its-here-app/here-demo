"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BottomPanel } from "./ui/BottomPanel";
import { Tab, Tabs } from "./ui/Tabs";
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

  const list = tab === "followers" ? followers : following;

  return (
    <BottomPanel
      isOpen={isOpen}
      onClose={onClose}
      title={`@${profileName}`}
      centerTitle
      boldTitle
      panelHeight="30rem"
      desktopVariant="floating"
      desktopWidth="43rem"
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

      {/* User list */}
      {list === null ? (
        <p className="text-center text-white/40 py-8 text-body-xs">
          Loading...
        </p>
      ) : list.length === 0 ? (
        <p className="text-center text-white/40 py-8 text-body-xs">
          {tab === "followers"
            ? "No followers yet."
            : "Not following anyone yet."}
        </p>
      ) : (
        <ul className="-mt-2">
          {list.map((u) => (
            <li key={u.id}>
              <Link
                href={`/${u.username}`}
                onClick={onClose}
                className="flex items-center gap-2 hover:bg-white/10 rounded-lg p-2 -mx-2 transition-colors"
              >
                {u.avatar_url ? (
                  <img
                    src={u.avatar_url}
                    alt={u.full_name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-white/40"
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
                  <p className="text-body-xs text-grey truncate">
                    @{u.username}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </BottomPanel>
  );
}
