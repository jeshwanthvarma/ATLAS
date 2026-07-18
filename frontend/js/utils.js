// ======================================================
// Utility Functions
// ======================================================

class Utils {

    static formatBytes(bytes) {

        if (!bytes || bytes <= 0)
            return "0 B";

        const units = ["B", "KB", "MB", "GB", "TB"];

        const power = Math.floor(Math.log(bytes) / Math.log(1024));

        return (
            (bytes / Math.pow(1024, power)).toFixed(1)
            + " "
            + units[power]
        );

    }

    static formatUptime(seconds) {

        if (!seconds)
            return "--";

        const days = Math.floor(seconds / 86400);

        const hours = Math.floor((seconds % 86400) / 3600);

        const minutes = Math.floor((seconds % 3600) / 60);

        if (days > 0)
            return `${days}d ${hours}h`;

        if (hours > 0)
            return `${hours}h ${minutes}m`;

        return `${minutes}m`;

    }

    static escapeHtml(text) {

        const div = document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

    static truncate(text, length = 50) {

        if (!text)
            return "";

        if (text.length <= length)
            return text;

        return text.substring(0, length) + "...";

    }

    static getStatusClass(status) {

        return CONSTANTS.STATUS_CLASS[status] || "status-on";

    }

}