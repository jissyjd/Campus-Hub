import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import { categories } from '../data/events';

export default function EventFilters({ search, onSearchChange, category, onCategoryChange, sort, onSortChange }) {
  return (
    <div className="event-filters">
      <label className="search-field">
        <SearchRoundedIcon />
        <input type="search" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search events..." aria-label="Search events by name" />
        <kbd>⌕</kbd>
      </label>
      <div className="filter-bottom">
        <div className="category-filters" aria-label="Filter by category">
          {['All Events', ...categories].map((item) => (
            <button key={item} className={`filter-chip${category === item ? ' active' : ''}`} onClick={() => onCategoryChange(item)} aria-pressed={category === item}>{item}</button>
          ))}
        </div>
        <label className="sort-control"><TuneRoundedIcon /><span>Sort</span>
          <select value={sort} onChange={(event) => onSortChange(event.target.value)} aria-label="Sort events">
            <option value="date">Soonest first</option>
            <option value="seats">Most seats</option>
          </select>
        </label>
      </div>
    </div>
  );
}
