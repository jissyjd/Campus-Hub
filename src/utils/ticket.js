const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}[character]));

export function downloadTicket(registration) {
  if (!registration || registration.paymentStatus !== 'paid') return;

  const safeRegistration = {
    name: escapeHtml(registration.name),
    eventName: escapeHtml(registration.eventName),
    category: escapeHtml(registration.category),
    date: escapeHtml(registration.shortDate),
    time: escapeHtml(registration.time),
    venue: escapeHtml(registration.venue),
    email: escapeHtml(registration.email),
    amount: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(registration.amount),
    ticketId: escapeHtml(registration.id),
    paymentReference: escapeHtml(registration.paymentReference),
  };
  const ticket = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeRegistration.eventName} — Campus Event Hub Ticket</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 32px 16px; color: #f1f3f1; background: #0a1418; font: 15px/1.5 Arial, sans-serif; }
    main { width: min(620px, 100%); margin: 5vh auto; overflow: hidden; border: 1px solid #36545a; border-radius: 20px; background: #10232a; box-shadow: 0 24px 70px #0006; }
    header { padding: 30px; background: linear-gradient(110deg, #1d4350, #a43931); }
    header span { font-size: 12px; font-weight: 700; letter-spacing: 2px; }
    header h1 { margin: 10px 0 0; font-size: clamp(26px, 6vw, 38px); line-height: 1.1; }
    section { padding: 24px 30px; }
    .label { display: block; margin-bottom: 5px; color: #a0b2b2; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .attendee { margin: 0 0 22px; font-size: 21px; font-weight: 700; }
    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 18px 14px; padding: 20px 0; border-top: 1px solid #ffffff22; border-bottom: 1px solid #ffffff22; }
    .details strong { display: block; overflow-wrap: anywhere; }
    .confirmation { display: flex; justify-content: space-between; gap: 12px; margin-top: 20px; color: #a0b2b2; font-size: 12px; }
    .confirmation strong { color: #f1f3f1; text-align: right; }
    footer { padding: 16px 30px; border-top: 1px solid #ffffff22; color: #a0b2b2; font-size: 12px; }
    @media (max-width: 440px) { body { padding: 12px; } header, section { padding: 22px; } .details { grid-template-columns: 1fr; } }
    @media print { body { padding: 0; color: #172326; background: #fff; } main { width: 100%; margin: 0; border-color: #ccd8d6; color: #172326; box-shadow: none; background: #fff; } .details { border-color: #ccd8d6; } .label, .confirmation, footer { color: #526466; } .confirmation strong { color: #172326; } }
  </style>
</head>
<body>
  <main>
    <header><span>NEXORA'26 · CAMPUS HUB</span><h1>Event ticket</h1></header>
    <section>
      <span class="label">Attendee</span><p class="attendee">${safeRegistration.name}</p>
      <div class="details">
        <div><span class="label">Event</span><strong>${safeRegistration.eventName}</strong></div>
        <div><span class="label">Category</span><strong>${safeRegistration.category}</strong></div>
        <div><span class="label">Date & time</span><strong>${safeRegistration.date} · ${safeRegistration.time}</strong></div>
        <div><span class="label">Venue</span><strong>${safeRegistration.venue}</strong></div>
        <div><span class="label">Ticket ID</span><strong>${safeRegistration.ticketId}</strong></div>
        <div><span class="label">Paid (demo checkout)</span><strong>${safeRegistration.amount}</strong></div>
      </div>
      <div class="confirmation"><span>Payment reference</span><strong>${safeRegistration.paymentReference}</strong></div>
      <div class="confirmation"><span>Registration email</span><strong>${safeRegistration.email}</strong></div>
    </section>
    <footer>Keep this ticket handy and show it at the event entrance. This ticket records a demo checkout and is not proof of a real-world payment.</footer>
  </main>
</body>
</html>`;
  const blob = new Blob([ticket], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${registration.eventId || 'campus-event'}-ticket.html`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
