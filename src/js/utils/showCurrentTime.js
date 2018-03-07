/**
 * Returns current time string
 * @returns {string} date string
 */
export default function showCurrentTime() {
    let date = new Date();

    return date.toLocaleTimeString();
}
