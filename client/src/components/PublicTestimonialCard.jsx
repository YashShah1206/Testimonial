import React from 'react';
import styles from './PublicTestimonialCard.module.css';

const PublicTestimonialCard = ({ testimonial, accentColor }) => {
  const { name, email, company, rating, testimonial: quoteText, photo, createdAt } = testimonial;

  // Format date
  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Calculate 1-2 character initials for avatar fallback
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return fullName.slice(0, 2).toUpperCase();
  };

  // Generate a curated gradient background color if no accent is supplied
  const getAvatarBg = (str) => {
    if (accentColor) return accentColor;
    const gradients = [
      'linear-gradient(135deg, #6366f1, #4f46e5)',
      'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      'linear-gradient(135deg, #10b981, #047857)',
      'linear-gradient(135deg, #f59e0b, #b45309)',
      'linear-gradient(135deg, #ec4899, #be185d)'
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const photoUrl = photo 
    ? (photo.startsWith('http') ? photo : `http://localhost:5000${photo}`) 
    : null;

  // Custom inline styles for widget theming
  const cardStyle = {};
  if (accentColor) {
    cardStyle['--card-accent'] = accentColor;
    cardStyle['--star-color'] = accentColor;
    cardStyle['--avatar-bg'] = accentColor;
  }

  const renderSentimentBadge = () => {
    const sentiment = testimonial.sentiment || 'Unknown';
    let bg = 'rgba(100, 116, 139, 0.2)';
    let color = '#94a3b8';
    let icon = '•';

    if (sentiment === 'Positive') {
      bg = 'rgba(16, 185, 129, 0.2)';
      color = '#10b981';
      icon = '😊';
    } else if (sentiment === 'Negative') {
      bg = 'rgba(239, 68, 68, 0.2)';
      color = '#ef4444';
      icon = '😞';
    } else if (sentiment === 'Neutral') {
      bg = 'rgba(148, 163, 184, 0.2)';
      color = '#cbd5e1';
      icon = '😐';
    }

    return (
      <span style={{
        backgroundColor: bg,
        color: color,
        padding: '0.2rem 0.55rem',
        borderRadius: '20px',
        fontSize: '0.72rem',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        border: `1px solid ${color}40`,
        marginLeft: 'auto'
      }}>
        <span>{icon}</span> {sentiment}
      </span>
    );
  };

  return (
    <div className={styles.card} style={cardStyle}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
        <div className={styles.rating} aria-label={`Rating: ${rating} out of 5 stars`}>
          {Array.from({ length: 5 }, (_, idx) => (
            <span key={idx} style={{ opacity: idx < rating ? 1 : 0.25 }}>
              ★
            </span>
          ))}
        </div>
        {renderSentimentBadge()}
      </div>

      <div className={styles.quoteContainer}>
        <p className={styles.quote}>"{quoteText}"</p>
      </div>

      <div className={styles.authorSection}>
        <div className={styles.avatarContainer}>
          {photoUrl ? (
            <img src={photoUrl} alt={`${name}'s avatar`} className={styles.photo} />
          ) : (
            <div 
              className={styles.initialsAvatar}
              style={{ background: getAvatarBg(name || email || 'U') }}
            >
              {getInitials(name || email)}
            </div>
          )}
        </div>

        <div className={styles.authorMeta}>
          <span className={styles.name}>{name}</span>
          {company && <span className={styles.company}>{company}</span>}
          <span className={styles.date}>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PublicTestimonialCard;
