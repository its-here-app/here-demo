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
    <div className={`flex flex-col items-center w-full ${className ?? ""}`}>
      {/* Avatar + Info row */}
      <div className="flex flex-col gap-4 items-center py-4  w-full lg:flex-row lg:gap-[3.75rem] lg:items-center lg:py-0 lg:px-0 lg:w-full lg:max-w-145">
        {/* Avatar */}
        <div className="relative shrink-0">
          <Avatar size="xl" lgSize="2xl" src={avatarSrc} username={name} />
          {decorations}
        </div>

        {/* Info + Buttons */}
        <div className="flex flex-col items-center w-full lg:items-start sm:max-w-sm">
          <div className="flex flex-col items-center lg:items-start lg:gap-1">
            <p className="text-header-radio-1 text-primary text-center lg:text-left lg:text-display-radio-3">
              {name}
            </p>
            {username && (
              <p className="text-body-xs text-grey text-center lg:text-left hidden lg:block">
                @{username}
              </p>
            )}
          </div>

          <div className="flex flex-col items-center gap-4 w-full lg:items-start lg:gap-3 lg:mt-3">
            {bio && (
              <p className="text-body-sm text-secondary text-center max-w-sm lg:text-left lg:w-full">
                {bio}
              </p>
            )}
            <div className="flex gap-2 justify-center lg:justify-start">
              <button
                onClick={onFollowersClick}
                className="text-body-xs text-grey hover:underline"
              >
                {followerCount} followers
              </button>
              <span className="text-body-xs text-grey">•</span>
              <button
                onClick={onFollowingClick}
                className="text-body-xs text-grey hover:underline"
              >
                {followingCount} following
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 w-full mt-4 lg:mt-5">
            {type === "yours" && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={onEditProfile}
              >
                Edit profile
              </Button>
            )}
            {isOthers && (
              <Button variant="outline" className="flex-1" onClick={onFollow}>
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
      </div>
    </div>
  );
}
