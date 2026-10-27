import { BrandMark } from "@/components/brand-mark";

type BrandLogoProps = {
  size?: "sm" | "md" | "lg";
  showMark?: boolean;
};

const SIZES = {
  sm: {
    wrap: "gap-2",
    mark: "h-7 w-7",
    text: "text-xl",
  },
  md: {
    wrap: "gap-2.5",
    mark: "h-8 w-8",
    text: "text-2xl",
  },
  lg: {
    wrap: "gap-3",
    mark: "h-11 w-11",
    text: "text-4xl sm:text-5xl",
  },
} as const;

export function BrandLogo({ size = "md", showMark = true }: BrandLogoProps) {
  const styles = SIZES[size];

  return (
    <span className={`inline-flex items-center ${styles.wrap}`}>
      {showMark ? <BrandMark className={`shrink-0 ${styles.mark}`} /> : null}
      <span className={`font-serif leading-none tracking-tight text-ink ${styles.text}`}>
        Voz<span className="text-pine">Texto</span>
      </span>
    </span>
  );
}
