// everything related to localStorage
export default class LS {
    // get some information from localStorage
    getInfo(keyName) {
        let info = localStorage.getItem(keyName);
        // check if info is null
        if (!info) {
            info = [];
            return info;
        }

        return JSON.parse(info);
    }

    // set some info into localStorage
    setInfo(keyName, info) {
        localStorage.setItem(keyName, JSON.stringify(info));
    }

    // clear localStorage
    clear() {
        localStorage.clear();
    }
}