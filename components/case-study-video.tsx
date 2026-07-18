"use client";

import { useEffect, useRef, useState } from "react";

type CaseStudyVideoProps = {
  src: string;
  poster: string;
  title: string;
};

export function CaseStudyVideo({ src, poster, title }: CaseStudyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [ready, setReady] = useState(false);

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
    if (reduceMotion || saveData) video.pause();

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
    };
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
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
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onCanPlay={() => setReady(true)}
        aria-label={`${title} project video`}
      />
      <div className="case-video-overlay" />
      <div className="case-video-status" data-ready={ready}>
        <span>{ready ? "Film ready" : "Loading film"}</span>
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
