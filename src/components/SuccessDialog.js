import { Button, Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import { downloadTicket } from '../utils/ticket';

export default function SuccessDialog({ registration, onClose, onViewRegistrations }) {
  if (!registration) return null;

  return (
    <Dialog open={Boolean(registration)} onClose={onClose} fullWidth maxWidth="sm" className="app-dialog success-dialog">
      <DialogTitle className="success-close"><IconButton aria-label="Close confirmation" onClick={onClose}><CloseRoundedIcon /></IconButton></DialogTitle>
      <DialogContent className="success-content">
        <div className="success-icon"><CheckCircleRoundedIcon /></div>
        <span className="section-kicker">YOU'RE ON THE LIST</span>
        <h2>It's happening, {registration.name.split(' ')[0]}.</h2>
        <p className="success-message">Your spot is confirmed. We can't wait to see you there.</p>
        <div className="success-event">
          <span className="success-category">{registration.category}</span>
          <h3>{registration.eventName}</h3>
          <p>{registration.shortDate} · {registration.time}</p>
          <p>{registration.venue}</p>
        </div>
        <p className="success-email">Confirmation saved for <strong>{registration.email}</strong></p>
        <p className="success-payment">Demo payment complete · ₹{registration.amount} · {registration.paymentReference}</p>
        <Button className="ticket-download" onClick={() => downloadTicket(registration)} startIcon={<DownloadRoundedIcon />}>Download event ticket</Button>
        <Button className="dialog-submit" onClick={onViewRegistrations} endIcon={<ArrowForwardRoundedIcon />}>View my registrations</Button>
      </DialogContent>
    </Dialog>
  );
}
