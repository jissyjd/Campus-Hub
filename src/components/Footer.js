import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';

export default function Footer({ onNavigate }) {
  const footerLinks = [
    ['Explore events', 'events'],
    ['My registrations', 'registrations'],
    ['Live dashboard', 'dashboard'],
    ['Contact the team', 'contact'],
  ];

  return (
    <footer className="site-footer">
      <div className="footer-main section-wrap">
        <div className="footer-brand"><span className="brand-mark"><AutoAwesomeRoundedIcon /></span><div><strong>Campus Event Hub</strong><p>Discover. Participate. Celebrate.</p></div></div>
        <nav className="footer-nav" aria-label="Footer navigation">
          <span>FIND YOUR WAY</span>
          {footerLinks.map(([label, section]) => <button key={section} onClick={() => onNavigate(section)}>{label}</button>)}
        </nav>
        <div className="footer-contact"><span>QUESTIONS? WE'RE RIGHT HERE.</span><a href="mailto:events@campushub.edu"><MailOutlineRoundedIcon /> events@campushub.edu</a><button className="footer-contact-link" onClick={() => onNavigate('contact')}>SEND US A MESSAGE <span aria-hidden="true">↗</span></button></div>
      </div>
      <div className="footer-bottom section-wrap"><span>© 2026 CAMPUS EVENT HUB · MADE FOR THE MOMENTS THAT MATTER</span><span>THE CAMPUS IS YOURS.</span></div>
    </footer>
  );
}
