import MoonSvg from "~/assets/moon.svg";
import LightBulbSvg from "~/assets/light-bulb.svg";
import { Theme, useTheme } from "~/utils/theme";

export function preloadSvg() {
  return [
    { rel: "preload", href: MoonSvg, as: "image", type: "image/svg+xml" },
    { rel: "preload", href: LightBulbSvg, as: "image", type: "image/svg+xml" },
  ];
}

export function SsrPlaceholder() {
  return <div className="h-8 w-8" />;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useTheme();

  const dark = !theme || theme === Theme.dark;

  return (
    <button
      onClick={() =>
        setTheme((prev) => (prev === Theme.dark ? Theme.light : Theme.dark))
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`w-8 h-8 ${dark ? "text-gray-200" : "text-zinc-500"}`}
      >
        {dark ? (
          <use href={`${MoonSvg}#dark-mode-moon`} />
        ) : (
          <use href={`${LightBulbSvg}#light-mode-bulb`} />
        )}
      </svg>
    </button>
  );
}
