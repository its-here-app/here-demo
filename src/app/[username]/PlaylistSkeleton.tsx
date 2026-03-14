import ProfileMessage from "./ProfileMessage";
import ProfileTabsShell from "./ProfileTabsShell";

export default function PlaylistSkeleton() {
  return (
    <ProfileTabsShell>
      <ProfileMessage>Loading playlists...</ProfileMessage>
    </ProfileTabsShell>
  );
}
