"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "./Modal";
import { getFollowers, getFollowing } from "@/lib/services/users";
import type { FollowUser } from "@/lib/services/users";

interface FollowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  profileName: string;
  initialTab: "followers" | "following";
  currentUserId?: string;
}

export default function FollowsModal({
  isOpen,
  onClose,
  profileId,
  profileName,
  initialTab,
  currentUserId,
}: FollowsModalProps) {
  const [tab, setTab] = useState<"followers" | "following">(initialTab);
  const [followers, setFollowers] = useState<FollowUser[] | null>(null);
  const [following, setFollowing] = useState<FollowUser[] | null>(null);

  useEffect(() => {
    setTab(initialTab);
    // Reset lists so they reload fresh each time the modal opens
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
    <Modal isOpen={isOpen} onClose={onClose} title={profileName}>
      {/* Tabs */}
      <div className="flex border-b mb-4 -mt-2">
        <button
          onClick={() => setTab("followers")}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "followers"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Followers
        </button>
        <button
          onClick={() => setTab("following")}
          className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "following"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Following
        </button>
      </div>

      {/* User list */}
      {list === null ? (
        <p className="text-center text-gray-400 py-8 text-sm">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-center text-gray-400 py-8 text-sm">
          {tab === "followers" ? "No followers yet." : "Not following anyone yet."}
        </p>
      ) : (
        <ul className="space-y-4">
          {list.map((u) => (
            <li key={u.id}>
              <Link
                href={`/${u.username}`}
                onClick={onClose}
                className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
              >
                {u.avatar_url ? (
                  <img
                    src={u.avatar_url}
                    alt={u.full_name}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-400"
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
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {u.full_name}
                    </p>
                    {u.mutual && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full flex-shrink-0">
                        Mutual
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">@{u.username}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
