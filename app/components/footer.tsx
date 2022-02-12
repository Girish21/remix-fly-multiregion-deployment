import { Link } from "remix";

export default function Footer() {
  return (
    <footer className="max-w-4xl mx-auto px-6 py-[28rem]">
      <div className="grid place-content-center">
        <div className="flex gap-12">
          <h3 className="text-2xl place-self-center">Remix Blog</h3>
          <div className="flex flex-col">
            <ul className="flex flex-col gap-4">
              <Link to="/">Home</Link>
              <Link to="/blog">Blog</Link>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
