'use client';

const COLOR_MAP = {
  accent: 'stroke-accent',
  success: 'stroke-status-success',
  warning: 'stroke-status-warning',
  error: 'stroke-status-error',
  inactive: 'stroke-status-inactive',
} as const;

export function ProgressArc({
  completed,
  total,
  size = 48,
  strokeWidth = 5,
  color = 'accent',
  className,
}: {
  completed: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  color?: keyof typeof COLOR_MAP;
  className?: string;
}) {
  const radius = 50 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? completed / total : 0;
  const offset = circumference * (1 - progress);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`${completed} of ${total} tasks complete`}
      className={className}
    >
      {/* Background track */}
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-edge"
      />
      {/* Progress arc */}
      {total > 0 && (
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${COLOR_MAP[color]} transition-[stroke-dashoffset] duration-500 ease-out`}
          transform="rotate(-90 50 50)"
        />
      )}
      {/* Center text */}
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-content-primary text-[18px] font-semibold"
      >
        {completed}/{total}
      </text>
    </svg>
  );
}
