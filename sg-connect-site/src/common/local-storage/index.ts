export const localStorageKeys = {};

export function removeLocalStorageItem(key: string) {
    localStorage.removeItem(key);
}

export function storeLocalStorageItem<Type>(key: string, data: Type) {
    localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorageItem<Type>(key: string): Type {
    return JSON.parse(localStorage.getItem(key) ?? "");
}

export function buildLocalStorageKey(key: string) {
    if (typeof window !== "undefined" && window.location && window.location.hostname) {
        return `${window.location.hostname}.${key}`;
    }

    return key;
}
