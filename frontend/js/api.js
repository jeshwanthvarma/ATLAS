// ======================================================
// ATLAS API Service
// Handles all communication with the backend
// ======================================================

class API {

    static async request(endpoint, options = {}) {

        try {

            const response = await fetch(`${CONFIG.API_BASE}${endpoint}`, {
                headers: {
                    "Content-Type": "application/json",
                    ...(options.headers || {})
                },
                ...options
            });

            const data = await response.json();

            return {
                success: response.ok,
                status: response.status,
                data
            };

        } catch (error) {

            console.error("API Error:", error);

            return {
                success: false,
                status: 500,
                error: error.message
            };

        }

    }

    static getSystem() {
        return this.request(CONFIG.ENDPOINTS.SYSTEM);
    }

    static getCPU() {
        return this.request(CONFIG.ENDPOINTS.CPU);
    }

    static getMemory() {
        return this.request(CONFIG.ENDPOINTS.MEMORY);
    }

    static getDisk() {
        return this.request(CONFIG.ENDPOINTS.DISK);
    }

    static getNetwork() {
        return this.request(CONFIG.ENDPOINTS.NETWORK);
    }

}