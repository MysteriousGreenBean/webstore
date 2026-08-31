export default function Loading() {
  return (
    <div className="shell page-loading" aria-live="polite" aria-busy="true">
      <span className="loading-mark" aria-hidden="true">M</span>
      <p>Loading the collection…</p>
    </div>
  );
}
