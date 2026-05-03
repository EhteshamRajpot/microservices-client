import Link from "next/link";

export default function Header({ currentUser }) {
  const links = [
    !currentUser && { label: "Sign Up", href: "/auth/signup" },
    !currentUser && { label: "Sign In", href: "/auth/signin" },
    currentUser && { label: "Sell Tickets", href: "/tickets/new" },
    currentUser && { label: "My Orders", href: "/orders" },
    currentUser && { label: "Sign Out", href: "/auth/signout" },
  ]
    .filter(Boolean)
    .map(({ label, href }) => (
      <li key={href} className="nav-item">
        <Link className="nav-link" href={href}>
          {label}
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-expand navbar-light bg-light mb-4">
      <Link className="navbar-brand" href="/">
        GitTix
      </Link>
      <div className="d-flex justify-content-end flex-grow-1">
        <ul className="nav ms-auto d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
}
