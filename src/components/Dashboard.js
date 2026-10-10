import { useMemo } from 'react';
import { Alert, Card, CardContent } from '@mui/material';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import EventSeatRoundedIcon from '@mui/icons-material/EventSeatRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const palette = ['#1d4350', '#a43931', '#6f999b', '#c66d5d', '#90aaa5'];
export default function Dashboard({ events, registrations, theme }) {
  const chartText = theme === 'light' ? '#697087' : '#a8acc1';
  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: chartText, usePointStyle: true, pointStyle: 'circle', padding: 18, font: { family: 'DM Sans', size: 11 } } },
      tooltip: { backgroundColor: theme === 'light' ? '#25283a' : '#171a2c', titleColor: '#fff', bodyColor: '#c8cbe0', padding: 12, cornerRadius: 10, displayColors: true },
    },
  };
  const axis = {
    ticks: { color: chartText, font: { family: 'DM Sans', size: 10 }, maxRotation: 0, autoSkip: true },
    grid: { color: theme === 'light' ? 'rgba(49, 55, 88, 0.10)' : 'rgba(139, 145, 180, 0.10)', drawBorder: false },
    border: { display: false },
  };

  const data = useMemo(() => {
    const counts = events.map((event) => registrations.filter((registration) => registration.eventId === event.id).length);
    const categories = [...new Set(events.map((event) => event.category))];
    const categoryCounts = categories.map((category) => events.reduce((sum, event, index) => sum + (event.category === category ? counts[index] : 0), 0));
    const seats = events.map((event) => Math.max(0, event.capacity - counts[events.indexOf(event)]));
    const popular = events.map((event, index) => ({ name: event.name, count: counts[index] })).sort((first, second) => second.count - first.count);
    return {
      categories,
      categoryCounts,
      counts,
      seats,
      popular,
      totalRegistrations: registrations.length,
      totalSeats: seats.reduce((sum, count) => sum + count, 0),
      fullEvents: seats.filter((count) => count === 0).length,
    };
  }, [events, registrations]);

  const summary = [
    { label: 'Total events', value: events.length, icon: <EventNoteRoundedIcon />, tone: 'purple' },
    { label: 'Registrations', value: data.totalRegistrations, icon: <GroupRoundedIcon />, tone: 'cyan' },
    { label: 'Available seats', value: data.totalSeats.toLocaleString(), icon: <EventSeatRoundedIcon />, tone: 'green' },
    { label: 'Fully booked', value: data.fullEvents, icon: <LockRoundedIcon />, tone: 'orange' },
  ];
  const eventLabels = events.map((event) => event.shortName);
  const bars = (values, color) => ({
    labels: eventLabels,
    datasets: [{ data: values, backgroundColor: color, borderRadius: 6, maxBarThickness: 28 }],
  });
  const axesOptions = { ...baseOptions, plugins: { ...baseOptions.plugins, legend: { display: false } }, scales: { x: axis, y: { ...axis, beginAtZero: true, ticks: { ...axis.ticks, precision: 0 } } } };
  const registrationOptions = { ...axesOptions, scales: { ...axesOptions.scales, x: { ...axis, grid: { display: false }, ticks: { ...axis.ticks, maxRotation: 35, minRotation: 0 } } } };
  const popularData = {
    labels: data.popular.map((event) => event.name),
    datasets: [{ data: data.popular.map((event) => event.count), backgroundColor: '#a43931', borderRadius: 5, maxBarThickness: 20 }],
  };
  const popularOptions = {
    ...baseOptions,
    indexAxis: 'y',
    plugins: { ...baseOptions.plugins, legend: { display: false } },
    scales: { x: { ...axis, beginAtZero: true, ticks: { ...axis.ticks, precision: 0 } }, y: { ...axis, grid: { display: false } } },
  };
  const isEmpty = data.totalRegistrations === 0;
  const nearlyFullEvents = events.filter((event, index) => data.seats[index] > 0 && data.seats[index] <= 10);
  const availabilityAlert = data.totalSeats === 0
    ? { severity: 'error', message: 'All event seats are currently taken. Check back for updates.' }
    : nearlyFullEvents.length > 0
      ? { severity: 'warning', message: `${nearlyFullEvents.map((event) => event.name).join(', ')} ${nearlyFullEvents.length === 1 ? 'is' : 'are'} nearly full.` }
      : isEmpty
        ? { severity: 'info', message: 'Be the first to register. Dashboard charts update as students join events.' }
        : { severity: 'success', message: `${events.length - data.fullEvents} events still have seats available.` };

  return (
    <div className="section-wrap dashboard-section">
      <div className="section-heading">
        <div><span className="section-kicker">THE FEST, AT A GLANCE</span><h2>Campus pulse<span className="heading-period">.</span></h2></div>
        <span className="section-count"><i className="dashboard-live-dot" /> LIVE EVENT DATA</span>
      </div>
      <p className="section-intro">A live read on the moments, momentum, and seats left across campus.</p>
      <Alert severity={availabilityAlert.severity} className="dashboard-alert">{availabilityAlert.message}</Alert>
      <div className="summary-grid">
        {summary.map((item) => (
          <Card className={`summary-card tone-${item.tone}`} key={item.label}><CardContent>
            <span className="summary-icon">{item.icon}</span><span className="summary-label">{item.label}</span><strong>{item.value}</strong><span className="summary-foot">{item.label === 'Total events' ? 'IN THE LINEUP' : item.label === 'Registrations' ? 'ACROSS ALL EVENTS' : item.label === 'Available seats' ? 'READY FOR YOU' : 'AT CAPACITY'}</span>
          </CardContent></Card>
        ))}
      </div>
      {isEmpty && <p className="dashboard-empty">Charts will come to life as students register. Be the first to claim a spot.</p>}
      <div className="chart-grid">
        <Card className="chart-card chart-donut"><CardContent><div className="chart-heading"><div><span>01 / REGISTRATIONS</span><h3>Category mix</h3></div><span className="chart-unit">BY CATEGORY</span></div><div className="chart-canvas"><Doughnut data={{ labels: data.categories, datasets: [{ data: data.categoryCounts, backgroundColor: palette, borderColor: 'transparent', hoverOffset: 5 }] }} options={{ ...baseOptions, cutout: '72%', plugins: { ...baseOptions.plugins, legend: { position: 'bottom', ...baseOptions.plugins.legend } } }} /></div></CardContent></Card>
        <Card className="chart-card"><CardContent><div className="chart-heading"><div><span>02 / EVENT ACTIVITY</span><h3>Registrations by event</h3></div><span className="chart-unit">PEOPLE</span></div><div className="chart-canvas"><Bar data={bars(data.counts, '#1d4350')} options={registrationOptions} /></div></CardContent></Card>
        <Card className="chart-card"><CardContent><div className="chart-heading"><div><span>03 / ROOM TO JOIN</span><h3>Available seats</h3></div><span className="chart-unit">SEATS LEFT</span></div><div className="chart-canvas"><Bar data={bars(data.seats, '#a43931')} options={registrationOptions} /></div></CardContent></Card>
        <Card className="chart-card"><CardContent><div className="chart-heading"><div><span>04 / CROWD FAVOURITES</span><h3>Most popular events</h3></div><span className="chart-unit">RANKED</span></div><div className="chart-canvas chart-canvas-wide"><Bar data={popularData} options={popularOptions} /></div></CardContent></Card>
      </div>
    </div>
  );
}
