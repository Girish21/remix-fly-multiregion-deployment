import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { LinksFunction, LoaderFunction } from "remix";
import Nav from "~/components/nav";

import appStyles from "~/styles/app.css";
import Footer from "./components/footer";

const HUNDRED_YEARS = 60 * 60 * 24 * 365 * 100;

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: appStyles }];
};

export const loader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);
  const forwardedProto = request.headers.get("X-Forwarded-Proto");
  const host = request.headers.get("X-Forwarded-Host") ?? url.host;
  const pathname = url.pathname;
  const query = url.search ?? "";
  const hash = url.hash ?? "";

  if (forwardedProto === "http") {
    return redirect(`https://${host}${pathname}${query}${hash}`, {
      headers: {
        "X-Forwarded-Proto": "https",
        "Strict-Transport-Security": `max-age=${HUNDRED_YEARS}`,
      },
    });
  }
  return json(null, {
    headers: {
      "Strict-Transport-Security": `max-age=${HUNDRED_YEARS}`,
    },
  });
};

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full dark:bg-slate-800">
        <div className="h-full flex flex-col">
          <Nav />
          <main className="flex-1 px-6">
            <Outlet />
          </main>
          <Footer />
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
