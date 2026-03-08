import { useState, useEffect } from "react";

export function useShare() {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  async function share(url: string) {
    try {
      await navigator.share({ title: document.title, url });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") throw err;
    }
  }

  return { canShare, share };
}
