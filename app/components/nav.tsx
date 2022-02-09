import { NavLink } from "remix";

export default function Nav() {
  return (
    <header>
      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink prefetch="intent" to="/about">
          About
        </NavLink>
        <NavLink prefetch="intent" to="/blog">
          Blog
        </NavLink>
      </nav>
    </header>
  );
}
