import { useState } from 'react';
import { Share2, Check } from 'lucide-react';
import { Button, notify } from '@/ui';

/**
 * Copy the current page URL to clipboard.
 * Falls back to document.execCommand for older browsers.
 */
export default function CopyLinkButton({ size = 'sm' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback
        const el = document.createElement('textarea');
        el.value = url;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      setCopied(true);
      notify.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error('Could not copy link. Please copy the URL manually.');
    }
  };

  return (
    <Button
      size={size}
      variant="secondary"
      leftIcon={
        copied
          ? <Check className="h-4 w-4 text-success" />
          : <Share2 className="h-4 w-4" />
      }
      onClick={handleCopy}
    >
      {copied ? 'Copied!' : 'Share'}
    </Button>
  );
}
