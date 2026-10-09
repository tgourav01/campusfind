import React from 'react';
import { MapPin, CalendarDays, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  const placeholder = item.type === 'LOST'
    ? 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80'
    : 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=80';

  return (
    <article className="item-card">
      <div className="item-image-wrap">
        <img src={item.imageUrl || placeholder} alt={item.title} className="item-image" />
        <span className={`type-pill ${item.type.toLowerCase()}`}>
          {item.type}
        </span>
      </div>
      <div className="item-body">
        <div className="item-category">{item.category}</div>
        <h3>{item.title}</h3>
        <p className="item-desc">{item.description}</p>
        <div className="item-meta">
          <span><MapPin size={15} /> {item.location.building}{item.location.room ? ` · ${item.location.room}` : ''}</span>
          <span><CalendarDays size={15} /> {new Date(item.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
        </div>
        <Link className="card-link" to={`/items/${item._id}`}>
          View details <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
