export function formatDeadline(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  // Format options
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", dateOptions);

  // Add relative time context
  if (days === 0) {
    return `Today, ${formattedDate}`;
  } else if (days === 1) {
    return `Tomorrow, ${formattedDate}`;
  } else if (days > 0 && days <= 7) {
    return `${days}d left - ${formattedDate}`;
  } else if (days < 0) {
    return `Overdue - ${formattedDate}`;
  }

  return formattedDate;
}

export function formatExpiredDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  const formattedDate = date.toLocaleString("en-US", dateOptions);

  if (days === 0) {
    return `Expired today - ${formattedDate}`;
  } else if (days === 1) {
    return `Expired yesterday - ${formattedDate}`;
  } else if (days <= 7) {
    return `Expired ${days}d ago - ${formattedDate}`;
  } else if (days <= 30) {
    const weeks = Math.floor(days / 7);
    return `Expired ${weeks}w ago - ${formattedDate}`;
  }

  return `Expired ${formattedDate}`;
}
