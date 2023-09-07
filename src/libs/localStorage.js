export function getItemJson(key) {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
}

export function getSession() {
    return getItemJson("session");
}

export function getUser() {
    return getItemJson("user");
}