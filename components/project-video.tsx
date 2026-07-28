type ProjectVideoProps = {
  src: string;
  label: string;
  className?: string;
};

export function ProjectVideo({ src, label, className = "" }: ProjectVideoProps) {
  return (
    <div className={`project-video ${className}`.trim()}>
      <video
        aria-label={label}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
}
