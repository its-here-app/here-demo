import type { ReactNode } from "react";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

export type ProfileType = "yours" | "others" | "friend";

interface ProfileProps {
  type?: ProfileType;
  name: string;
  username?: string;
  bio?: string;
  followerCount?: number;
  followingCount?: number;
  avatarSrc?: string;
  instagramHandle?: string;
  onEditProfile?: () => void;
  onFollow?: () => void;
  onInstagram?: () => void;
  onFollowersClick?: () => void;
  onFollowingClick?: () => void;
  decorations?: ReactNode;
  className?: string;
}

export function Profile({
  type = "yours",
  name,
  username,
  bio,
  followerCount = 0,
  followingCount = 0,
  avatarSrc,
  instagramHandle,
  onEditProfile,
  onFollow,
  onInstagram,
  onFollowersClick,
  onFollowingClick,
  decorations,
  className,
}: ProfileProps) {
  const isOthers = type === "others";
  const isFriend = type === "friend";

  return (
    <div className={`flex flex-col gap-4 items-center pb-4 pt-2 px-3 w-full ${className ?? ""}`}>
      {/* Avatar */}
      <div className="relative">
        <Avatar size="xl" src={avatarSrc} username={name} />
        {decorations}
      </div>

      {/* Info */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex flex-col items-center gap-1">
          <p className="text-header-radio-1 text-black text-center">{name}</p>
          {username && <p className="text-body-sm text-grey text-center">@{username}</p>}
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          {bio && (
            <p className="text-body-sm text-black/60 text-center w-[220px] line-clamp-3">{bio}</p>
          )}
          <div className="flex gap-3 justify-center">
            <button onClick={onFollowersClick} className="text-body-xs text-grey hover:underline">
              {followerCount} followers
            </button>
            <span className="text-body-xs text-grey">•</span>
            <button onClick={onFollowingClick} className="text-body-xs text-grey hover:underline">
              {followingCount} following
            </button>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 w-full">
        {type === "yours" && (
          <Button variant="outline" className="flex-1" onClick={onEditProfile}>
            Edit profile
          </Button>
        )}
        {isOthers && (
          <Button variant="filled" className="flex-1" onClick={onFollow}>
            Follow
          </Button>
        )}
        {isFriend && (
          <Button variant="filled" className="flex-1" onClick={onFollow}>
            Following
          </Button>
        )}
        {(isOthers || isFriend) && instagramHandle && (
          <Button variant="tonal" onClick={onInstagram}>
            Instagram
          </Button>
        )}
      </div>
    </div>
  );
}
