const LocalStorageKeys = {
    username: buildLocalStorageKey("username"),
    password: buildLocalStorageKey("password"),
    encodeKey: buildLocalStorageKey("encode-key"),
    language: buildLocalStorageKey("language"),
};

const getStorage = (key: string) => {
    return localStorage.getItem(key);
};

const setStorage = (key: string, value: any) => {
    localStorage.setItem(key, value);
};

function buildLocalStorageKey(key: string) {
    if (typeof window !== "undefined" && window.location && window.location.hostname) {
        return `${window.location.hostname}.${key}`;
    }

    return key;
}

export { LocalStorageKeys, getStorage, setStorage };
