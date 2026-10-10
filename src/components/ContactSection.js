import { useState } from 'react';
import { Alert, Button } from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';

const contactEmail = 'events@campushub.edu';

export default function ContactSection({ onNavigate }) {
  const [values, setValues] = useState({ name: '', email: '', topic: '', message: '' });
  const [errors, setErrors] = useState({});
  const [draftUrl, setDraftUrl] = useState('');

  const update = (field) => (event) => {
    setValues((current) => ({ ...current, [field]: event.target.value }));
    setDraftUrl('');
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
  };

  const prepareEmail = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!values.name.trim()) nextErrors.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) nextErrors.email = 'Enter a valid email address.';
    if (!values.topic) nextErrors.topic = 'Choose a topic for your message.';
    if (!values.message.trim()) nextErrors.message = 'Please add a short message.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const subject = `Campus Event Hub: ${values.topic}`;
    const body = `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\nTopic: ${values.topic}\n\n${values.message.trim()}`;
    setDraftUrl(`mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <section className="section-wrap contact-section" id="contact">
      <div className="contact-heading">
        <span className="contact-pill"><EmailRoundedIcon /> LET'S TALK CAMPUS</span>
        <h2>Got a question?<br /><span>We've got you.</span></h2>
        <p>Need a hand with an event, have an idea for the fest, or want to work together? Drop the team a note.</p>
      </div>

      <div className="contact-grid">
        <form className="contact-card" onSubmit={prepareEmail} noValidate>
          <h3>Send the team a message</h3>
          <div className="contact-fields">
            <label className="contact-field">Your name
              <input autoComplete="name" value={values.name} onChange={update('name')} placeholder="How should we address you?" aria-invalid={Boolean(errors.name)} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label className="contact-field">Email address
              <input type="email" autoComplete="email" value={values.email} onChange={update('email')} placeholder="you@college.edu" aria-invalid={Boolean(errors.email)} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>
          </div>
          <label className="contact-field">What's this about?
            <select value={values.topic} onChange={update('topic')} aria-invalid={Boolean(errors.topic)}>
              <option value="">Choose a topic</option>
              <option>Event registration</option>
              <option>Suggest an event</option>
              <option>Partnership or collaboration</option>
              <option>Something else</option>
            </select>
            {errors.topic && <span className="field-error">{errors.topic}</span>}
          </label>
          <label className="contact-field">Your message
            <textarea rows="4" value={values.message} onChange={update('message')} placeholder="Tell us what's on your mind..." aria-invalid={Boolean(errors.message)} />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </label>
          {draftUrl ? (
            <Alert severity="success" className="contact-success">
              Your message is ready. Open the email draft and press Send to reach our team.
              <a href={draftUrl}>Open email draft</a>
            </Alert>
          ) : (
            <Button type="submit" className="contact-submit" endIcon={<ArrowForwardRoundedIcon />}>Prepare my message</Button>
          )}
          <p className="contact-privacy">Your message is prepared in your email app; this website doesn't store or send your personal details.</p>
        </form>

        <aside className="contact-info">
          <div className="contact-info-card">
            <span className="contact-info-icon"><EmailRoundedIcon /></span>
            <div><span className="contact-info-label">EMAIL THE TEAM</span><h3>We're one note away.</h3><a href={`mailto:${contactEmail}`}>{contactEmail}</a></div>
          </div>
          <div className="contact-info-card">
            <span className="contact-info-icon contact-icon-cyan"><EventAvailableRoundedIcon /></span>
            <div><span className="contact-info-label">NEED EVENT DETAILS?</span><h3>Find your next campus moment.</h3><button onClick={() => onNavigate('events')}>Browse the event lineup <ArrowForwardRoundedIcon /></button></div>
          </div>
          <div className="contact-note">
            <AutoAwesomeRoundedIcon />
            <div><strong>Have an idea for the fest?</strong><p>We'd love to hear what you'd like to see on campus next.</p></div>
          </div>
        </aside>
      </div>
    </section>
  );
}
