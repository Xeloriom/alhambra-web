'use client';

import { useRef, useEffect } from 'react';

interface HeroVideoProps {
  url: string;
  overlay?: string;
}

export function HeroVideo({ url, overlay = 'rgba(5,5,5,0.68)' }: HeroVideoProps) {
  const ref   = useRef<HTMLVideoElement>(null);
  const isHLS = url.endsWith('.m3u8');

  useEffect(() => {
    const video = ref.current; if (!video) return;
    let hls: import('hls.js').default | null = null;

    if (!isHLS) {
      video.src = url; video.play().catch(() => {});
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url; video.play().catch(() => {});
    } else {
      import('hls.js').then(({ default: Hls }) => {
        if (!Hls.isSupported() || !ref.current) return;
        hls = new Hls({ startLevel: -1, maxBufferLength: 30 });
        hls.loadSource(url);
        hls.attachMedia(ref.current);
        hls.on(Hls.Events.MANIFEST_PARSED, () => ref.current?.play().catch(() => {}));
      });
    }

    return () => { hls?.destroy(); };
  }, [url, isHLS]);

  return (
    <div className="absolute inset-0 z-0">
      <video ref={ref} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0" style={{ background: overlay }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-48" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%)' }} />
    </div>
  );
}
