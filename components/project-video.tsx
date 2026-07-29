"use client";

import { useEffect, useRef, useState } from "react";

type ProjectVideoProps = {
  src: string;
  label: string;
  className?: string;
  priority?: boolean;
};

export function ProjectVideo({
  src,
  label,
  className = "",
  priority = false,
}: ProjectVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let isVisible = false;
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      setIsReady(true);
    }

    const play = () => {
      if (!isVisible || document.visibilityState !== "visible") return;
      const promise = video.play();
      promise?.catch(() => {
        // Muted autoplay can still be deferred while a tab is backgrounded.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) play();
        else video.pause();
      },
      { rootMargin: priority ? "80% 0px" : "30% 0px", threshold: 0.01 },
    );

    const handleVisibility = () => {
      if (document.visibilityState === "visible") play();
      else video.pause();
    };

    observer.observe(video);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      video.pause();
    };
  }, [priority, src]);

  return (
    <div
      className={`project-video${isReady ? " is-ready" : ""}${hasError ? " has-error" : ""} ${className}`.trim()}
      aria-busy={!isReady && !hasError}
    >
      <video
        ref={videoRef}
        aria-label={label}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        onCanPlay={() => setIsReady(true)}
        onPlaying={() => setIsReady(true)}
        onError={() => setHasError(true)}
      >
        <source src={src} type="video/mp4" />
      </video>
      {hasError ? (
        <p className="video-fallback" role="status">
          Video preview unavailable
        </p>
      ) : null}
    </div>
  );
}
