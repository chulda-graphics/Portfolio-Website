"use client";

import { useEffect, useRef, useState } from "react";

type CaseStudyVideoProps = {
  src: string;
  poster: string;
  title: string;
};

export function CaseStudyVideo({ src, poster, title }: CaseStudyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const userRequestedPlay = useRef(false);
  const autoplayAllowed = useRef(true);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [mediaEnabled, setMediaEnabled] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const saveData =
      "connection" in navigator &&
      Boolean(
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData,
      );
    autoplayAllowed.current = !reduceMotion && !saveData;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && autoplayAllowed.current) {
          setMediaEnabled(true);
          observer.disconnect();
        }
      },
      { rootMargin: "80%" },
    );
    observer.observe(video);

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      observer.disconnect();
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!mediaEnabled) {
      userRequestedPlay.current = true;
      autoplayAllowed.current = true;
      setMediaEnabled(true);
      return;
    }
    if (video.paused) await video.play();
    else video.pause();
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setMuted(nextMuted);
  };

  return (
    <section className="case-video" aria-label={`${title} film`}>
      <video
        ref={videoRef}
        src={mediaEnabled ? src : undefined}
        poster={poster}
        autoPlay={mediaEnabled}
        muted
        loop
        playsInline
        preload={mediaEnabled ? "metadata" : "none"}
        onCanPlay={async () => {
          setReady(true);
          if (autoplayAllowed.current || userRequestedPlay.current) {
            await videoRef.current?.play().catch(() => undefined);
          }
        }}
        aria-label={`${title} project video`}
      />
      <div className="case-video-overlay" />
      <div className="case-video-status" data-ready={ready}>
        <span>{ready ? "Film ready" : mediaEnabled ? "Loading film" : "Film queued"}</span>
      </div>
      <div className="case-video-controls">
        <button type="button" onClick={togglePlayback}>
          {playing ? "Pause film" : "Play film"}
        </button>
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Turn project film sound on" : "Mute project film"}
        >
          Sound {muted ? "off" : "on"}
        </button>
      </div>
    </section>
  );
}
