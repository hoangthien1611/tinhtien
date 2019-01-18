export function removeStorage(name: string) {
    try {
        localStorage.removeItem(name);
        localStorage.removeItem(name + '_expiresIn');
    } catch (e) {
        console.log('removeStorage: Error removing key [' + name + '] from localStorage');
        return false;
    }
    return true;
}

export function getStorage(key: string) {
    try {
        return localStorage.getItem(key);
    } catch (e) {
        console.log('getStorage: Error reading key [' + key + '] from localStorage');
        return null;
    }
}

export function setStorage(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        console.log('setStorage: Error setting key [' + key + '] in localStorage');
        return false;
    }
    console.log(value);
    return true;
}

/* set storage with schedule to expires
   expires caculated by seconds
*/
export function setStorageToExpires(key: string, value: string, expires: string) {
    if (expires === undefined || expires === null) {
        expires = (24 * 60 * 60).toString();
    } else {
        expires = Math.abs(parseInt(expires)).toString();
    }

    let now = Date.now();
    let schedule = now + parseInt(expires) * 1000;
    try {
        localStorage.setItem(key, value);
        localStorage.setItem(key + '_expiresIn', schedule.toString());
    } catch (e) {
        console.log('setStorage: Error setting key [' + key + '] in localStorage');
        return false;
    }
    return true;
}