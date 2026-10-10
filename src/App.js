import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Alert } from '@mui/material';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CountdownTimer from './components/CountdownTimer';
import EventFilters from './components/EventFilters';
import EventCard from './components/EventCard';
import RegistrationDialog from './components/RegistrationDialog';
import SuccessDialog from './components/SuccessDialog';
import MyRegistrations from './components/MyRegistrations';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import eventData from './data/events';

const Dashboard = lazy(() => import('./components/Dashboard'));

const STORAGE_KEYS = { registrations: 'campusHub.registrations', theme: 'campusHub.theme' };
const parseRegistrations = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEYS.registrations);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Could not restore Campus Event Hub registrations.', error);
    return [];
  }
};
const parseTheme = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.theme) === 'light' ? 'light' : 'dark';
  } catch (error) {
    console.error('Could not restore the Campus Event Hub theme preference.', error);
    return 'dark';
  }
};
const getEventStart = (event) => new Date(`${event.date}T${event.time}:00`).getTime();
const formatEventDate = (date) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${date}T12:00:00`));

export default function App() {
  const [registrations, setRegistrations] = useState(parseRegistrations);
  const [theme, setTheme] = useState(parseTheme);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [successRegistration, setSuccessRegistration] = useState(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Events');
  const [sort, setSort] = useState('date');
  const [registrationError, setRegistrationError] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [clock, setClock] = useState(Date.now());
  const [loadDashboard, setLoadDashboard] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch (error) {
      console.error('Could not save the Campus Event Hub theme preference.', error);
    }
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const dashboard = document.getElementById('dashboard');
    if (!dashboard) return undefined;
    if (!('IntersectionObserver' in window)) {
      setLoadDashboard(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setLoadDashboard(true);
        observer.disconnect();
        window.removeEventListener('scroll', loadWhenNear);
      }
    }, { rootMargin: '500px 0px' });
    const loadWhenNear = () => {
      const bounds = dashboard.getBoundingClientRect();
      if (bounds.top < window.innerHeight + 500 && bounds.bottom > -500) {
        setLoadDashboard(true);
        observer.disconnect();
        window.removeEventListener('scroll', loadWhenNear);
      }
    };
    window.addEventListener('scroll', loadWhenNear, { passive: true });
    observer.observe(dashboard);
    loadWhenNear();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', loadWhenNear);
    };
  }, []);

  const events = useMemo(() => eventData.map((event, index) => {
    const registered = registrations.filter((registration) => registration.eventId === event.id).length;
    const start = getEventStart(event);
    const availableSeats = Math.max(0, event.capacity - registered);
    return {
      ...event,
      shortDate: formatEventDate(event.date),
      shortName: event.name.split(':')[0].split('—')[0].trim(),
      cardIndex: `0${index + 1}`,
      registered,
      availableSeats,
      isPast: start <= Date.now(),
    };
  }), [registrations, clock]);
  const upcomingEvent = events.filter((event) => getEventStart(event) > Date.now()).sort((first, second) => getEventStart(first) - getEventStart(second))[0] || null;
  const visibleEvents = useMemo(() => events
    .filter((event) => (category === 'All Events' || event.category === category) && event.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((first, second) => sort === 'seats'
      ? second.availableSeats - first.availableSeats
      : getEventStart(first) - getEventStart(second)), [events, category, search, sort]);

  const register = (details, event) => {
    const normalizedEmail = details.email.toLowerCase();
    if (getEventStart(event) <= Date.now()) return { ok: false, message: 'This event has already started or passed.' };
    if (event.availableSeats < 1) return { ok: false, message: 'This event is fully booked. Please choose another event.' };
    if (registrations.some((registration) => registration.eventId === event.id && registration.email === normalizedEmail)) {
      return { ok: false, message: 'This email is already registered for this event.' };
    }

    const registration = {
      id: `${event.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      eventId: event.id,
      eventName: event.name,
      category: event.category,
      date: event.date,
      shortDate: event.shortDate,
      time: event.time,
      venue: event.venue,
      name: details.name,
      email: normalizedEmail,
      phone: details.phone,
      registeredAt: new Date().toISOString(),
      amount: event.price,
      paymentStatus: 'paid',
      paymentMethod: 'demo',
      paymentReference: `DEMO-${Date.now().toString(36).toUpperCase()}`,
    };
    const nextRegistrations = [...registrations, registration];
    try {
      window.localStorage.setItem(STORAGE_KEYS.registrations, JSON.stringify(nextRegistrations));
    } catch (error) {
      console.error('Could not save Campus Event Hub registrations.', error);
      setRegistrationError('Your browser could not save registrations. Check your browser storage settings and try again.');
      return { ok: false, message: 'Your registration could not be saved. Please check your browser storage settings and try again.' };
    }
    setRegistrations(nextRegistrations);
    setSelectedEvent(null);
    setSuccessRegistration(registration);
    setRegistrationError('');
    return { ok: true };
  };

  const navigate = (section) => {
    if (section === 'dashboard') setLoadDashboard(true);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app-shell">
      <Navbar theme={theme} onToggleTheme={() => setTheme((current) => current === 'dark' ? 'light' : 'dark')} onNavigate={navigate} />
      <main>
        <HeroSection onExplore={() => navigate('events')} nextEvent={upcomingEvent} />
        <div className="section-wrap countdown-wrap"><CountdownTimer event={upcomingEvent} /></div>

        <section className="section-wrap events-section" id="events">
          <div className="section-heading">
            <div><span className="section-kicker">FIND YOUR NEXT THING</span><h2>The good stuff<span className="heading-period">.</span></h2></div>
            <span className="section-count">{String(visibleEvents.length).padStart(2, '0')} / {String(events.length).padStart(2, '0')} EVENTS</span>
          </div>
          <p className="section-intro">Ideas worth showing up for. Pick a lane, follow a curiosity, or just see where the day takes you.</p>
          <EventFilters search={search} onSearchChange={setSearch} category={category} onCategoryChange={setCategory} sort={sort} onSortChange={setSort} />
          {registrationError && <Alert severity="warning" className="form-alert storage-alert">{registrationError}</Alert>}
          {visibleEvents.length > 0 ? (
            <div className="events-grid">
              {visibleEvents.map((event) => <EventCard key={event.id} event={event} onRegister={(selected) => setSelectedEvent(selected)} />)}
            </div>
          ) : (
            <div className="events-empty"><span><ArrowDownwardRoundedIcon /></span><h3>No events found. Yet.</h3><p>Try a different search or choose another category to find your next campus moment.</p><button onClick={() => { setSearch(''); setCategory('All Events'); }}>Clear all filters</button></div>
          )}
        </section>

        <MyRegistrations registrations={registrations} initialEmail={lookupEmail} />
        <ContactSection onNavigate={navigate} />
        <section className="dashboard-deferred" id="dashboard" aria-label="Campus dashboard">
          {loadDashboard ? (
            <Suspense fallback={<div className="dashboard-loading">Loading live campus stats…</div>}>
              <Dashboard events={events} registrations={registrations} theme={theme} />
            </Suspense>
          ) : <div className="dashboard-loading">Campus stats load when you get closer.</div>}
        </section>
      </main>
      <Footer onNavigate={navigate} />
      <RegistrationDialog event={selectedEvent} registrations={registrations} onClose={() => setSelectedEvent(null)} onSubmit={register} />
      <SuccessDialog registration={successRegistration} onClose={() => setSuccessRegistration(null)} onViewRegistrations={() => {
        const email = successRegistration?.email || '';
        setLookupEmail(email);
        setSuccessRegistration(null);
        navigate('registrations');
      }} />
    </div>
  );
}
