import React, { useEffect, useState } from 'react';
import { MILESTONES } from '../utils/milestones';

export function MilestoneNotification({ milestone, onDismiss }) {
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHiding(true);
      setTimeout(onDismiss, 400);
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!milestone) return null;

  return (
    <div className={`milestone-notification ${hiding ? 'hiding' : ''}`}>
      <div className="milestone-notification-label">해금</div>
      <div className="milestone-notification-name">{milestone.name}</div>
      <div className="milestone-notification-desc">{milestone.description}</div>
    </div>
  );
}
