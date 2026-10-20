type IconProps = {className?: string; size?: number};

const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
});

export function IconSearch({className, size}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconAccount({className, size}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function IconCart({className, size}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 7h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 7Z" />
      <path d="M9 10V6a3 3 0 0 1 6 0v4" />
    </svg>
  );
}

export function IconMenu({className, size}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconClose({className, size}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconArrow({className, size}: IconProps) {
  return (
    <svg {...base(size)} className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
