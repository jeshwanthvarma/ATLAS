-- =====================================================
-- ATLAS Database Schema
-- Version: 0.2.0
-- Database: PostgreSQL
-- Author: Jeshwanth Varma
-- Project: ATLAS - Unified Infrastructure Monitoring
-- =====================================================

-- Drop existing tables (development only)

-- Tables will be created in this order:
-- 1. roles
-- =====================================================
-- TABLE: roles
-- Stores user roles for role-based access control
-- =====================================================

CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 2. users
-- =====================================================
-- TABLE: users
-- Stores application users
-- =====================================================

CREATE TABLE users (

    user_id SERIAL PRIMARY KEY,

    role_id INTEGER NOT NULL,

    firebase_uid VARCHAR(128) UNIQUE NOT NULL,

    first_name VARCHAR(100) NOT NULL,

    last_name VARCHAR(100),

    username VARCHAR(100) UNIQUE,

    email VARCHAR(255) UNIQUE NOT NULL,

    auth_provider VARCHAR(30) DEFAULT 'firebase',

    is_active BOOLEAN DEFAULT TRUE,

    last_login TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
        FOREIGN KEY(role_id)
        REFERENCES roles(role_id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT

);
-- 3. sessions
-- =====================================================
-- TABLE: sessions
-- Stores user login sessions
-- =====================================================

CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,

    jwt_token TEXT NOT NULL,

    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    logout_time TIMESTAMP,

    ip_address VARCHAR(50),
    user_agent TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    CONSTRAINT fk_sessions_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

-- 4. servers
-- =====================================================
-- TABLE: servers
-- Stores monitored servers
-- =====================================================

CREATE TABLE servers (
    server_id SERIAL PRIMARY KEY,

    server_name VARCHAR(100) NOT NULL,

    hostname VARCHAR(255) NOT NULL,

    ip_address VARCHAR(50) NOT NULL,

    operating_system VARCHAR(100),

    status VARCHAR(20) DEFAULT 'Online',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 5. system_metrics
-- =====================================================
-- TABLE: system_metrics
-- Stores CPU, RAM and Disk statistics
-- =====================================================

CREATE TABLE system_metrics (
    metric_id SERIAL PRIMARY KEY,

    server_id INTEGER NOT NULL,

    cpu_usage DECIMAL(5,2),

    memory_usage DECIMAL(5,2),

    disk_usage DECIMAL(5,2),

    uptime BIGINT,

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_metrics_server
        FOREIGN KEY (server_id)
        REFERENCES servers(server_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
-- 6. network_metrics
-- =====================================================
-- TABLE: network_metrics
-- Stores network statistics
-- =====================================================

CREATE TABLE network_metrics (
    network_metric_id SERIAL PRIMARY KEY,

    server_id INTEGER NOT NULL,

    upload_speed DECIMAL(10,2),

    download_speed DECIMAL(10,2),

    bytes_sent BIGINT,

    bytes_received BIGINT,

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_network_server
        FOREIGN KEY (server_id)
        REFERENCES servers(server_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
-- 7. services
-- =====================================================
-- TABLE: services
-- Stores monitored services
-- =====================================================

CREATE TABLE services (
    service_id SERIAL PRIMARY KEY,

    server_id INTEGER NOT NULL,

    service_name VARCHAR(100) NOT NULL,

    service_status VARCHAR(30) NOT NULL,

    last_checked TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_services_server
        FOREIGN KEY (server_id)
        REFERENCES servers(server_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
-- 8. alerts
-- =====================================================
-- TABLE: alerts
-- Stores system alerts
-- =====================================================

CREATE TABLE alerts (
    alert_id SERIAL PRIMARY KEY,

    server_id INTEGER NOT NULL,

    alert_type VARCHAR(100),

    severity VARCHAR(20),

    message TEXT,

    is_resolved BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alerts_server
        FOREIGN KEY (server_id)
        REFERENCES servers(server_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
-- 9. logs
-- =====================================================
-- TABLE: logs
-- Stores system logs
-- =====================================================

CREATE TABLE logs (
    log_id SERIAL PRIMARY KEY,

    server_id INTEGER NOT NULL,

    log_level VARCHAR(20),

    source VARCHAR(100),

    message TEXT,

    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_logs_server
        FOREIGN KEY (server_id)
        REFERENCES servers(server_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
-- 10. settings
-- =====================================================
-- TABLE: settings
-- Stores application settings
-- =====================================================

CREATE TABLE settings (
    setting_id SERIAL PRIMARY KEY,

    setting_key VARCHAR(100) UNIQUE NOT NULL,

    setting_value TEXT,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- 11. audit_logs
-- =====================================================
-- TABLE: audit_logs
-- Stores user activity logs
-- =====================================================

CREATE TABLE audit_logs (
    audit_id SERIAL PRIMARY KEY,

    user_id INTEGER NOT NULL,

    action VARCHAR(255),

    details TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_audit_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
