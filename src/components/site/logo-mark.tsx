/** The "M" mark: a neural-net path through swarm agents. Colors follow the theme. */
const LogoMark = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    aria-hidden="true"
    className={`${className} transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110`}
  >
    <defs>
      <linearGradient id="logoMarkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'var(--color-primary)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--color-accent)' }} />
      </linearGradient>
    </defs>
    {[
      [20, 75, 35, 25],
      [35, 25, 50, 60],
      [50, 60, 65, 25],
      [65, 25, 80, 75],
    ].map(([x1, y1, x2, y2]) => (
      <line
        key={`${x1}-${y1}`}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeOpacity="0.25"
        strokeDasharray="3 3"
      />
    ))}
    <path
      d="M 15 50 C 30 75, 70 20, 85 45"
      style={{ stroke: 'var(--color-secondary)' }}
      strokeWidth="2"
      strokeLinecap="round"
      strokeOpacity="0.7"
      strokeDasharray="4 4"
    />
    <path
      d="M 20 75 L 35 25 L 50 60 L 65 25 L 80 75"
      stroke="url(#logoMarkGradient)"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="75" r="4.5" fill="currentColor" opacity="0.7" />
    <circle cx="35" cy="25" r="6" fill="url(#logoMarkGradient)" />
    <circle cx="50" cy="60" r="5.5" fill="url(#logoMarkGradient)" />
    <circle cx="65" cy="25" r="6" fill="url(#logoMarkGradient)" />
    <circle cx="80" cy="75" r="4.5" fill="currentColor" opacity="0.7" />
    <circle
      cx="28"
      cy="45"
      r="2"
      style={{ fill: 'var(--color-secondary)' }}
      className="animate-pulse"
    />
    <circle
      cx="72"
      cy="55"
      r="1.8"
      style={{ fill: 'var(--color-secondary)' }}
      className="animate-pulse"
    />
  </svg>
);

export default LogoMark;
