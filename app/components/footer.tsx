import { Link } from "remix";

export default function Footer() {
  return (
    <footer className="max-w-4xl mx-auto px-6 min-h-screen flex items-center justify-center">
      <div className="flex gap-12">
        <h3 className="text-4xl font-bold place-self-center">Remix Blog</h3>
        <div className="flex flex-col">
          <ul className="flex flex-col gap-4">
            <Link to="/" className="text-xl">
              Home
            </Link>
            <Link to="/blog" className="text-xl">
              Blog
            </Link>
          </ul>
        </div>
      </div>
    </footer>
  );
}
