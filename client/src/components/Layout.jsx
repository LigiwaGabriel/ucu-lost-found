import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  async function handleLogout() {
    await logout();
    setOpen(false);
    nav('/login');
  }

  return (
    <>
      <a className="skip-link" href="#main">Skip to main content</a>
      <header className="site-header">
        <Link to="/" className="brand">UCU Lost &amp; Found</Link>
        <button className="menu-btn" aria-expanded={open} aria-controls="site-nav" onClick={() => setOpen(!open)}>
          Menu
        </button>
        <nav id="site-nav" aria-label="Main" className={open ? 'open' : ''} onClick={() => setOpen(false)}>
          <NavLink to="/" end>Browse</NavLink>
          {user && <NavLink to="/report/new">Report item</NavLink>}
          {user && <NavLink to="/my-reports">My reports</NavLink>}
          {user && <NavLink to="/my-claims">My claims</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          {!user && <NavLink to="/login">Log in</NavLink>}
          {!user && <NavLink to="/register">Register</NavLink>}
          {user && <button className="link-btn" onClick={handleLogout}>Log out ({user.full_name.split(' ')[0]})</button>}
        </nav>
      </header>
      <main id="main" tabIndex="-1">{children}</main>
      <footer className="site-footer">UCU Campus Lost &amp; Found · fictional demo data only</footer>
    </>
  );
}
