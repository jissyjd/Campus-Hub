import { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

const links = [
  ['Home', 'home'],
  ['Events', 'events'],
  ['My registrations', 'registrations'],
  ['Contact', 'contact'],
  ['Dashboard', 'dashboard'],
];

export default function Navbar({ theme, onToggleTheme, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (section) => {
    onNavigate(section);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="nav-shell">
        <button className="brand" onClick={() => navigate('home')} aria-label="Campus Event Hub home">
          <span className="brand-mark"><AutoAwesomeRoundedIcon /></span>
          <span>campus<span className="brand-light">hub</span><small>EVENTS, AMPLIFIED</small></span>
        </button>

        <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
          {links.map(([label, id]) => (
            <button className="nav-link" key={id} onClick={() => navigate(id)}>{label}</button>
          ))}
          <Button className="theme-toggle" onClick={onToggleTheme} startIcon={theme === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </nav>

        <div className="nav-actions">
          <IconButton className="mobile-theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} onClick={onToggleTheme}>
            {theme === 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
          <IconButton className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <CloseRoundedIcon /> : <MenuRoundedIcon />}
          </IconButton>
        </div>
      </div>
    </header>
  );
}
