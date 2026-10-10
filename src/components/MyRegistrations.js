import { useEffect, useMemo, useState } from 'react';
import { Alert, Button } from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { downloadTicket } from '../utils/ticket';

export default function MyRegistrations({ registrations, initialEmail }) {
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [category, setCategory] = useState('All');

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
      setSubmittedEmail(initialEmail.toLowerCase());
    }
  }, [initialEmail]);

  const matches = useMemo(() => registrations.filter((registration) =>
    submittedEmail && registration.email === submittedEmail.toLowerCase()
  ), [registrations, submittedEmail]);
  const visibleMatches = matches.filter((registration) => category === 'All' || registration.category === category);
  const categories = ['All', ...new Set(matches.map((registration) => registration.category))];

  const search = (event) => {
    event.preventDefault();
    setSubmittedEmail(email.trim());
    setCategory('All');
  };

  return (
    <section className="section-wrap registrations-section" id="registrations">
      <div className="section-heading">
        <div><span className="section-kicker">YOUR CAMPUS LINEUP</span><h2>My registrations<span className="heading-period">.</span></h2></div>
        <span className="section-count">PRIVATE LOOKUP · {matches.length} FOUND</span>
      </div>
      <p className="section-intro">Your plans, all in one place. Look up your registrations with the email you signed up with.</p>
      <form className="registration-lookup" onSubmit={search}>
        <label className="search-field lookup-search"><SearchRoundedIcon /><input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your registration email" aria-label="Registration lookup email" /></label>
        <Button type="submit" className="lookup-button" endIcon={<ArrowForwardRoundedIcon />}>Find my events</Button>
      </form>
      {submittedEmail && matches.length > 0 && (
        <div className="registration-result">
          <div className="registration-result-top">
            <span>{matches.length} {matches.length === 1 ? 'EVENT' : 'EVENTS'} FOUND</span>
            {categories.length > 2 && <label>Show <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filter registrations by category">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>}
          </div>
          {visibleMatches.map((registration) => (
            <article className="registration-row" key={registration.id}>
              <span className="registration-row-icon"><EventAvailableRoundedIcon /></span>
              <div className="registration-row-main"><span>{registration.category}</span><h3>{registration.eventName}</h3><p>{registration.shortDate} · {registration.time} · {registration.venue}</p></div>
              <div className="registration-row-actions">
                <span className="registration-confirmed"><i /> CONFIRMED</span>
                {registration.paymentStatus === 'paid' && <Button className="registration-ticket-button" onClick={() => downloadTicket(registration)} startIcon={<DownloadRoundedIcon />}>Download ticket</Button>}
              </div>
            </article>
          ))}
        </div>
      )}
      {submittedEmail && matches.length === 0 && (
        <Alert severity="info" className="lookup-empty">No registrations found for this email yet. Your next campus moment is waiting in <a href="#events">the events lineup</a>.</Alert>
      )}
      {!submittedEmail && (
        <div className="registrations-prompt"><span><SearchRoundedIcon /></span><p>Enter your email above to privately find your registered events.</p></div>
      )}
    </section>
  );
}
