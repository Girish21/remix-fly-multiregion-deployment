import {
  json,
  Links,
  LiveReload,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { LinksFunction, LoaderFunction } from "remix";
import Nav from "~/components/nav";

import appStyles from "~/styles/app.css";
import Footer, { preloadFooterSvg } from "./components/footer";
import {
  SsrTheme,
  Theme,
  ThemeMeta,
  ThemeProvider,
  useTheme,
} from "./utils/theme";
import { getThemeSession } from "./utils/theme-session.server";
import { preloadSvg } from "./components/theme-toggle";

type LoaderData = { theme: Theme | null };

const HUNDRED_YEARS = 60 * 60 * 24 * 365 * 100;

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: appStyles },
    ...preloadSvg(),
    ...preloadFooterSvg(),
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
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

  const { getTheme } = await getThemeSession(request);

  return json<LoaderData>(
    { theme: getTheme() },
    {
      headers: {
        "Strict-Transport-Security": `max-age=${HUNDRED_YEARS}`,
      },
    }
  );
};

function App() {
  const [theme] = useTheme();

  return (
    <html lang="en" className={`h-full ${theme ? theme : "dark"}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <ThemeMeta />
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-white dark:bg-slate-800">
        <div className="h-full flex flex-col">
          <Nav />
          <main className="flex-1 px-6">
            <Outlet />
          </main>
          <Footer />
        </div>
        <SsrTheme serverTheme={!!theme} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function AppProviders() {
  const { theme } = useLoaderData<LoaderData>();

  return (
    <ThemeProvider ssrTheme={theme}>
      <App />
    </ThemeProvider>
  );
}
