import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';

export default function HeroSection({ onExplore, nextEvent }) {
  return (
    <section className="hero section-wrap" id="home">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> THE CAMPUS, IN FULL COLOUR</div>
        <h1 className="hero-title"><span className="hero-title-brand">NEXORA'26</span><span className="hero-title-campus">CAMPUS HUB</span></h1>
        <div className="hero-actions">
          <button className="button-primary" onClick={onExplore}>Explore events <ArrowForwardRoundedIcon /></button>
          <div className="hero-note"><AutoAwesomeRoundedIcon /><span>Discover. Participate. Celebrate.</span></div>
        </div>
        <div className="hero-proof">
          <AvatarGroup className="avatar-stack" max={3} aria-label="Campus community">
            <Avatar alt="Campus community member">R</Avatar>
            <Avatar alt="Campus community member">A</Avatar>
            <Avatar alt="Campus community member">M</Avatar>
          </AvatarGroup>
          <span>Find your people.<br /><strong>Make it a campus thing.</strong></span>
        </div>
      </div>
      <div className="hero-art" aria-label="Abstract illustration of the campus festival">
        <div className="art-particle-cloud" aria-hidden="true" />
        <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
        <div className="art-glow" />
        <div className="art-core"><span>CE</span><small>2026</small></div>
        <span className="art-star star-one">✳</span><span className="art-star star-two">✦</span>
        <span className="art-label label-top">ONE CAMPUS<br />MANY WORLDS</span>
        <span className="art-label label-bottom">YOUR NEXT<br />FAVOURITE THING</span>
        <div className="hero-float-card">
          <span className="float-indicator"><span /></span>
          <div><small>NEXT UP</small><strong>{nextEvent ? nextEvent.name : 'More moments ahead'}</strong><span>{nextEvent ? nextEvent.shortDate : 'Stay tuned for the next event'}</span></div>
          <ArrowForwardRoundedIcon />
        </div>
      </div>
      <div className="hero-bottomline"><span>01 / DISCOVER YOUR CAMPUS</span><span>SCROLL TO EXPLORE ↓</span></div>
    </section>
  );
}
