"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <div className="shell service-error" role="alert">
      <p className="eyebrow">Something went wrong</p>
      <h1>We hit an unexpected problem.</h1>
      <p>Your basket is safe in this browser.</p>
      <button className="primary-link" type="button" onClick={reset}>Try again</button>
    </div>
  );
}
