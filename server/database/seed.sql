USE ucu_lost_found;

INSERT IGNORE INTO categories (name) VALUES
 ('Keys'),('Phones & Electronics'),('Bags'),('Books & Stationery'),('Clothing'),('ID & Cards'),('Other');

INSERT IGNORE INTO locations (name) VALUES
 ('N5B Lecture Room'),('Hamu Mukasa Library'),('Touch of Class Restaurant'),
 ('Premium Hostel'),('Main Chapel'),('Admin Block'),('Sports Ground');

-- Fictional accounts are created by `npm run db:setup` (passwords hashed with bcrypt).
-- Student:  okello@example.test / Student@123
-- Student:  namusoke@example.test / Student@123
-- Admin:    admin@example.test / Admin@12345
