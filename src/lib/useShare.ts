import { createElement } from "react";
import { useState, useEffect, useRef } from "react";
import { Check } from "@/components/ui/icons/Check";
import { toast } from "@/components/ui/Toast";

export function copyToClipboard(url: string) {
  navigator.clipboard.writeText(url).then(() => {
    toast({
      icon: createElement(Check, { focus: true }),
      message: "Link copied to clipboard",
    });
  });
}

export function useShare() {
  const [canShare, setCanShare] = useState(false);
  const sharing = useRef(false);

  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);

  async function share(url: string, title?: string) {
    if (sharing.current) return;
    sharing.current = true;
    try {
      await navigator.share({ title: title ?? document.title, url });
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") throw err;
    } finally {
      sharing.current = false;
    }
  }

  return { canShare, share };
}
