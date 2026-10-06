import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "bag"
  | "search"
  | "arrow-right"
  | "arrow-down"
  | "close"
  | "plus"
  | "minus"
  | "clock"
  | "leaf"
  | "menu"
  | "chevron-right"
  | "check"
  | "pin"
  | "heart"
  | "star"
  | "trash"
  | "sparkle"
  | "truck";

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
  filled?: boolean;
};

export function Icon({ name, size = 20, filled = false, ...props }: IconProps) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const paths: Record<IconName, ReactNode> = {
    bag: <><path d="M5.5 8.5h13l1 12h-15l1-12Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.2 4.2" /></>,
    "arrow-right": <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
    "arrow-down": <><path d="M12 4v15" /><path d="m5 13 7 7 7-7" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    minus: <path d="M5 12h14" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.3 2" /></>,
    leaf: <><path d="M20.5 3.5c-7.6.1-13.4 2.8-14.9 7.2-1.1 3.2 1.2 6.3 4.4 6.3 4.9 0 8.7-6.2 10.5-13.5Z" /><path d="M3.5 21c2.4-5.1 6.3-8.8 12.1-11.3" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    "chevron-right": <path d="m9 18 6-6-6-6" />,
    check: <path d="m5 12 4 4L19 6" />,
    pin: <><path d="M20 10.2c0 5.1-8 11-8 11s-8-5.9-8-11a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    heart: <path d="M20.8 8.8c0 5-8.8 10.2-8.8 10.2S3.2 13.8 3.2 8.8a4.4 4.4 0 0 1 8.8-1 4.4 4.4 0 0 1 8.8 1Z" fill={filled ? "currentColor" : "none"} />,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill={filled ? "currentColor" : "none"} />,
    trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="m6 7 1 13h10l1-13M9 7V4h6v3" /></>,
    sparkle: <><path d="m12 3 1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z" /><path d="m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></>,
    truck: <><path d="M3 6h11v11H3zM14 10h4l3 3v4h-7z" /><circle cx="7.5" cy="18" r="1.8" /><circle cx="17.5" cy="18" r="1.8" /></>,
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      {...common}
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
