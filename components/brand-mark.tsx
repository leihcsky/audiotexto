type BrandMarkProps = {
  className?: string;
  title?: string;
};

export function BrandMark({ className = "h-8 w-8", title }: BrandMarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <rect width="32" height="32" rx="7" fill="#0f6e56" />
      <path
        d="M9 18.5v-5M13 21V11M17 19v-6M21 22V12M25 18.5v-5"
        stroke="#fffdf8"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
