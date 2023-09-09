export function getItem(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
}

export function setItem(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
    return localStorage.removeItem(key);
}