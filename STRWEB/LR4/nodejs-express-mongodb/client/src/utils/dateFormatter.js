export const formatDateTime = (dateString, timezone = 'local') => {
    if (!dateString) return 'N/A';

    const date = new Date(dateString);
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    };

    if (timezone === 'utc') {
        return new Intl.DateTimeFormat('en-US', { ...options, timeZone: 'UTC' }).format(date) + ' UTC';
    } else {
        // 'undefined' uses the user's default locale and timezone
        return new Intl.DateTimeFormat(undefined, options).format(date);
    }
};
