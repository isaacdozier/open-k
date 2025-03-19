const DATA_STORAGE_PREFIX = 'data_';
const DEFAULT_CACHE_AGE = 3000; // 3 seconds in milliseconds

class DataService {
    constructor() {
        this.localStorage = window.localStorage;
        this.axios = axios;
    }

    async request(id, type, age = DEFAULT_CACHE_AGE) {
        const key = this.generateStorageKey(id, type);
        const cachedData = this.getCachedData(key);

        if (cachedData && this.isCacheValid(cachedData, age)) {
            return JSON.stringify(cachedData.data);
        }

        try {
            const response = await this.axios.get(`./api/data/${id}/${type}/`);
            this.cacheData(key, response.data);
            return JSON.stringify(response.data);
        } catch (error) {
            console.error('API Error:', error);
            return null;
        }
    }

    generateStorageKey(id, type) {
        return `${DATA_STORAGE_PREFIX}${id}/${type}`;
    }

    getCachedData(key) {
        const storedData = this.localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : null;
    }

    isCacheValid(cachedData, maxAge) {
        const age = Date.now() - cachedData.timestamp;
        return age < maxAge;
    }

    cacheData(key, data) {
        this.localStorage.setItem(key, JSON.stringify({
            data,
            timestamp: Date.now()
        }));
    }
}

export default new DataService();