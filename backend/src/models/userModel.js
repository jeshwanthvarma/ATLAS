class User {
    constructor(data) {
        this.userId = data.user_id;
        this.roleId = data.role_id;
        this.firstName = data.first_name;
        this.lastName = data.last_name;
        this.username = data.username;
        this.email = data.email;
        this.passwordHash = data.password_hash;
        this.isActive = data.is_active;
        this.createdAt = data.created_at;
    }
}

module.exports = User;