-- =====================================================
-- ATLAS Seed Data
-- Version: 0.2.0
-- =====================================================

-- ------------------------------------
-- Roles
-- ------------------------------------

INSERT INTO roles (role_name, description)
VALUES
('Admin', 'Full system access'),
('Operator', 'Infrastructure monitoring'),
('Viewer', 'Read only access');

-- ------------------------------------
-- Default Server
-- ------------------------------------

INSERT INTO servers
(server_name, hostname, ip_address, operating_system)
VALUES
(
'Local Ubuntu Server',
'Jeshwanth',
'127.0.0.1',
'Ubuntu 24.04 LTS'
);

-- ------------------------------------
-- Application Settings
-- ------------------------------------

INSERT INTO settings
(setting_key, setting_value)
VALUES
('theme','dark'),
('refresh_interval','5'),
('cpu_alert','90'),
('memory_alert','90'),
('disk_alert','95');