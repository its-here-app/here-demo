"use client";

import { useEffect } from "react";

export default function NewPlaylistModal() {
  useEffect(() => {
    window.location.replace("/playlists/new");
  }, []);
  return null;
}
