import type * as React from "react";

import LinkOrAnchor from "./link-or-anchor";
import GitHubSvg from "~/assets/github.svg";
import TwitterSvg from "~/assets/twitter.svg";

export function preloadFooterSvg() {
  return [
    { rel: "preload", href: GitHubSvg, as: "image", type: "image/svg+xml" },
    { rel: "preload", href: TwitterSvg, as: "image", type: "image/svg+xml" },
  ];
}

export default function Footer() {
  return (
    <footer className="max-w-4xl mx-auto px-6 min-h-screen flex items-center justify-center">
      <div className="flex gap-32">
        <div className="flex flex-col gap-8">
          <h3 className="text-4xl font-bold place-self-center text-gray-800 dark:text-gray-100">
            Remix Blog
          </h3>
          <div className="flex items-center justify-center gap-6">
            <Link href="https://github.com/remix-run/remix">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-gray-500 dark:text-gray-300"
              >
                <use href={`${GitHubSvg}#icon-github`} />
              </svg>
            </Link>
            <Link href="https://twitter.com/remix_run">
              <Svg>
                <use href={`${TwitterSvg}#icon-twitter`} />
              </Svg>
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <ul className="flex flex-col gap-4">
            <Link href="/">Home</Link>
            <Link href="/blog">Blog</Link>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-gray-500 dark:text-gray-300"
    >
      {children}
    </svg>
  );
}

function Link({
  children,
  href,
  reload,
}: {
  children: React.ReactNode;
  href: string;
  reload?: boolean;
}) {
  return (
    <LinkOrAnchor
      href={href}
      reloadDocument={reload}
      className="text-xl text-gray-600 dark:text-gray-200"
      prefetch={!href.includes(":") ? "intent" : "none"}
    >
      {children}
    </LinkOrAnchor>
  );
}
