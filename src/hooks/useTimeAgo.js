import { useState, useEffect } from 'react';

const INTERVALS = [
  { label: 'year', seconds: 31536000 },
  { label: 'month', seconds: 2592000 },
  { label: 'day', seconds: 86400 },
  { label: 'hour', seconds: 3600 },
  { label: 'minute', seconds: 60 },
  { label: 'second', seconds: 1 },
];

export default function useTimeAgo(timestamp) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!timestamp) {
      setTimeAgo('');
      return;
    }

    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    for (let i = 0; i < INTERVALS.length; i++) {
      const interval = INTERVALS[i];
      const intervalInSeconds = interval.seconds;
      const intervalLabel = interval.label;

      if (seconds >= intervalInSeconds) {
        const count = Math.floor(seconds / intervalInSeconds);
        setTimeAgo(`${count} ${intervalLabel}${count !== 1 ? 's' : ''} ago`);
        return;
      }
    }

    setTimeAgo('Just now');
  }, [timestamp]);

  return timeAgo;
}