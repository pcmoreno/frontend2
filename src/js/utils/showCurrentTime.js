/**
 * Returns current time string
 * @returns {string} date string
 */
export default function showCurrentTime() {
    const date = new Date();

    return date.toLocaleTimeString();
}
