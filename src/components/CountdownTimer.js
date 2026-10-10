import { useEffect, useState } from 'react';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

const getRemaining = (event) => {
  const difference = new Date(`${event.date}T${event.time}:00`).getTime() - Date.now();
  if (difference <= 0) return null;
  return {
    days: Math.floor(difference / 86400000),
    hours: Math.floor((difference % 86400000) / 3600000),
    minutes: Math.floor((difference % 3600000) / 60000),
    seconds: Math.floor((difference % 60000) / 1000),
  };
};

export default function CountdownTimer({ event }) {
  const [remaining, setRemaining] = useState(() => event ? getRemaining(event) : null);

  useEffect(() => {
    setRemaining(event ? getRemaining(event) : null);
    const timer = window.setInterval(() => setRemaining(event ? getRemaining(event) : null), 1000);
    return () => window.clearInterval(timer);
  }, [event]);

  return (
    <div className="countdown-panel">
      <div className="countdown-heading">
        <span className="countdown-icon"><AccessTimeRoundedIcon /></span>
        <div><span className="section-kicker">THE COUNTDOWN IS ON</span><h3>{event ? event.name : 'Until the next big moment'}</h3></div>
        <span className="live-label"><i /> {event && remaining ? 'UP NEXT' : 'STAY TUNED'}</span>
      </div>
      {event && remaining ? (
        <div className="countdown-units">
          {Object.entries(remaining).map(([unit, value]) => (
            <div className="countdown-unit" key={unit}><strong>{String(value).padStart(2, '0')}</strong><span>{unit}</span></div>
          ))}
          <div className="countdown-event-meta">{event.shortDate}<br />{event.time} · {event.venue}</div>
        </div>
      ) : (
        <p className="countdown-ended">{event ? 'This event has begun or has passed. The next moment is just around the corner.' : 'There are no upcoming events right now. Check back soon.'}</p>
      )}
    </div>
  );
}
