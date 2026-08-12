export default function AppLogo({ inverse = false }) {
  return (
    <div className={`app-logo${inverse ? ' app-logo--inverse' : ''}`}>
      <span className="app-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 32 32" role="img">
          <path d="M5 11.5 16 5l11 6.5L16 18 5 11.5Z" />
          <path d="M9 15.5V22c0 1.5 3.1 3.5 7 3.5s7-2 7-3.5v-6.5" />
        </svg>
      </span>
      <span className="app-logo__text">
        <strong>SmartCampus</strong>
        <small>Service Desk</small>
      </span>
    </div>
  );
}
