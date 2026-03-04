interface StartPlaylistProps {
  /** active = cream bg with black text; default = black bg with cream text */
  active?: boolean;
  className?: string;
}

export function StartPlaylist({ active = false, className }: StartPlaylistProps) {
  return (
    <img
      src={active ? "/stickers/start-playlist-active.svg" : "/stickers/start-playlist.svg"}
      alt="Start your playlist"
      width={249}
      height={120}
      className={className}
    />
  );
}
