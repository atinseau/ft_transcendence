export const messageDate = (timestamp: Date) => {
    const date = new Date(timestamp);
    const formatter = new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  
    return formatter.format(date);
};