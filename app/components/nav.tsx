import NavLink from "./nav-link";

export default function Nav() {
  return (
    <header className="py-8 px-6">
      <nav className="max-w-4xl mx-auto flex justify-center items-center">
        <div className="flex items-center gap-4">
          <NavLink to="/">Home</NavLink>
          <NavLink prefetch="intent" to="/blog">
            Blog
          </NavLink>
        </div>
      </nav>
    </header>
  );
}
