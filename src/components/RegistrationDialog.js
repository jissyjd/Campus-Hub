import { useEffect, useState } from 'react';
import { Alert, Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

const validate = (values, registrations, event) => {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) errors.email = 'Enter a valid email address.';
  if (!/^[6-9]\d{9}$/.test(values.phone.trim())) errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  if (event && registrations.some((registration) => registration.eventId === event.id && registration.email.toLowerCase() === values.email.trim().toLowerCase())) {
    errors.email = 'This email is already registered for this event.';
  }
  return errors;
};

export default function RegistrationDialog({ event, registrations, onClose, onSubmit }) {
  const [values, setValues] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [step, setStep] = useState('details');

  useEffect(() => {
    setValues({ name: '', email: '', phone: '' });
    setErrors({});
    setFormError('');
    setStep('details');
  }, [event]);

  if (!event) return null;

  const update = (field) => (change) => {
    const value = change.target.value;
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: '' }));
  };

  const submit = (change) => {
    change.preventDefault();
    const nextErrors = validate(values, registrations, event);
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length) return;
    setFormError('');
    setStep('payment');
  };

  return (
    <Dialog open={Boolean(event)} onClose={onClose} fullWidth maxWidth="sm" className="app-dialog">
      <DialogTitle className="dialog-title">
        <div><span className="section-kicker">{step === 'details' ? 'SAVE YOUR SPOT' : 'SECURE CHECKOUT · DEMO'}</span><h2>{step === 'details' ? "You're in? Let's make it official." : 'Review your event payment.'}</h2></div>
        <IconButton aria-label={step === 'details' ? 'Close registration form' : 'Close payment'} onClick={onClose}><CloseRoundedIcon /></IconButton>
      </DialogTitle>
      <DialogContent className="dialog-content">
        <div className="selected-event"><span className="selected-event-icon"><EventAvailableRoundedIcon /></span><div><strong>{event.name}</strong><span>{event.shortDate} · {event.time} · {event.venue}</span></div></div>
        {formError && <Alert severity="error" className="form-alert">{formError}</Alert>}
        {step === 'details' ? (
          <form className="registration-form" onSubmit={submit} noValidate>
            <label className="form-field">Full name
              <input value={values.name} onChange={update('name')} placeholder="e.g. Aanya Sharma" aria-invalid={Boolean(errors.name)} />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </label>
            <label className="form-field">Email address
              <input type="email" value={values.email} onChange={update('email')} placeholder="you@college.edu" aria-invalid={Boolean(errors.email)} />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </label>
            <label className="form-field">Indian mobile number
              <div className={`phone-input${errors.phone ? ' has-error' : ''}`}><span>+91</span><input type="tel" inputMode="numeric" maxLength="10" value={values.phone} onChange={update('phone')} placeholder="98765 43210" aria-invalid={Boolean(errors.phone)} /></div>
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </label>
            <p className="form-privacy">Your details are saved with your registration after demo checkout is completed.</p>
            <Button type="submit" className="dialog-submit" endIcon={<ArrowForwardRoundedIcon />}>Continue to payment · ₹{event.price}</Button>
          </form>
        ) : (
          <div className="checkout-panel">
            <div className="checkout-attendee"><span>ATTENDEE</span><strong>{values.name}</strong><small>{values.email}</small></div>
            <div className="checkout-line"><span>Event ticket</span><strong>₹{event.price}</strong></div>
            <div className="checkout-total"><span>Total due</span><strong>₹{event.price}</strong></div>
            <Alert severity="info" className="demo-payment-alert">Demo checkout only. No card details are requested and no real payment will be processed.</Alert>
            <Button className="dialog-submit" startIcon={<LockRoundedIcon />} onClick={() => {
              const result = onSubmit({ name: values.name.trim(), email: values.email.trim().toLowerCase(), phone: values.phone.trim() }, event);
              if (!result.ok) setFormError(result.message);
            }}>Complete demo payment · ₹{event.price}</Button>
            <Button className="checkout-back" startIcon={<ArrowBackRoundedIcon />} onClick={() => { setFormError(''); setStep('details'); }}>Back to attendee details</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
