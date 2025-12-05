import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { to: '/', label: 'Главная' },
    { to: '/currency', label: 'Курс валют' },
    { to: '/waifu', label: 'Аниме арты' },
    { to: '/anime', label: 'Аниме каталог' },
  ];

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1>Multi API App</h1>
        <ul className="nav-links">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link to={item.to} className={pathname === item.to ? 'active' : ''}>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;