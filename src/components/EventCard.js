import { Button, Card, CardContent } from '@mui/material';
import ArrowOutwardRoundedIcon from '@mui/icons-material/ArrowOutwardRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';

export default function EventCard({ event, onRegister }) {
  const full = event.availableSeats === 0;
  const passed = event.isPast;

  return (
    <Card className={`event-card accent-${event.accent}`}>
      <div className="event-card-art">
        <span className="event-symbol">{event.visual}</span>
        <span className={`event-status${full ? ' status-full' : passed ? ' status-past' : ''}`}><i />{full ? 'FULL' : passed ? 'ENDED' : 'OPEN'}</span>
        <span className="event-art-index">{event.cardIndex}</span>
      </div>
      <CardContent className="event-card-content">
        <div className="event-card-meta"><div className="event-category">{event.category}</div><span className="event-price">₹{event.price}</span></div>
        <h3>{event.name}</h3>
        <p className="event-description">{event.description}</p>
        <div className="event-details">
          <span><CalendarMonthRoundedIcon />{event.shortDate}</span>
          <span><ScheduleRoundedIcon />{event.time}</span>
          <span><LocationOnRoundedIcon />{event.venue}</span>
        </div>
        <div className="event-card-footer">
          <div className={`seat-count${event.availableSeats < 12 && event.availableSeats > 0 ? ' seats-low' : ''}`}>
            <span className="seat-meter"><i style={{ width: `${Math.max(0, (event.availableSeats / event.capacity) * 100)}%` }} /></span>
            <span>{full ? 'No seats left' : `${event.availableSeats} / ${event.capacity} seats`}</span>
          </div>
          <Button className="event-register" onClick={() => onRegister(event)} disabled={full || passed} endIcon={<ArrowOutwardRoundedIcon />}>
            {full ? 'Fully booked' : passed ? 'Event ended' : 'Join event'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
