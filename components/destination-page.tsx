type DestinationPageProps = {
  index: string;
  title: string;
};

export function DestinationPage({ index, title }: DestinationPageProps) {
  return (
    <main className="destination-shell">
      <header className="destination-header">
        <a href="/">Dhrex</a>
        <span>{index} / 04</span>
      </header>

      <div className="destination-content">
        <p>Portfolio section</p>
        <h1>{title}</h1>
        <p>This section is ready for its dedicated Version 2 brief.</p>
      </div>

      <a className="destination-home" href="/">
        Back to index ↖
      </a>
    </main>
  );
}
