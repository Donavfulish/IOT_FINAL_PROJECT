CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	email TEXT UNIQUE,
	password TEXT
);
CREATE TABLE bins(
	id SERIAL PRIMARY KEY,
	battery DECIMAL(5,3),
	fill_level DECIMAL(5,3),
	is_display_fill BOOLEAN,
	message TEXT,
	led_mode VARCHAR(10) NOT NULL 
        CHECK (led_mode IN ('auto', 'manual')),
	time_on_led TIME,
	time_off_led TIME

);
CREATE TABLE bin_histories(
	id SERIAL PRIMARY KEY,
	bin_id INT REFERENCES bins(id),
	temperature DECIMAL(5,2),
	time_at TIMESTAMP
);
CREATE TABLE event_logs(
	id SERIAL PRIMARY KEY,
	bin_id INT REFERENCES bins(id),
	message TEXT,
	time_at TIMESTAMP
);
CREATE TABLE alerts(
	id SERIAL PRIMARY KEY,
	bin_id INT REFERENCES bins(id),
	title TEXT,
	message TEXT,
	time_at TIMESTAMP
);
CREATE TABLE config_system_alerts(
	fill_level DECIMAL(5,3), 
	battery DECIMAL(5,3), 
	temperature DECIMAL(5,2)
);




INSERT INTO users (email, password) VALUES
('user1@example.com', 'pass123'),
('user2@example.com', 'secret456'),
('user3@example.com', 'mypassword'),
('user4@example.com', 'admin123'),
('user5@example.com', 'testpass');

INSERT INTO bins (battery, fill_level, is_display_fill, message, led_mode, time_on_led, time_off_led) VALUES
(0.950, 0.200, TRUE,  'Hoạt động bình thường', 'auto',   '06:00', '18:00'),
(0.870, 0.750, TRUE,  'Gần đầy',               'manual', NULL, NULL ),
(0.600, 0.100, FALSE, 'Tiết kiệm pin',         'auto',   '08:00', '20:00'),
(0.400, 0.900, TRUE,  'Cảnh báo đầy',          'auto',   '07:00', '19:00'),
(0.300, 0.500, FALSE, 'Pin yếu',               'manual', NULL,    NULL);

INSERT INTO bin_histories (bin_id, temperature, time_at) VALUES
(1, 35.20, NOW() - INTERVAL '58 minutes'),
(2, 36.10, NOW() - INTERVAL '56 minutes'),
(3, 34.80, NOW() - INTERVAL '54 minutes'),
(4, 37.40, NOW() - INTERVAL '52 minutes'),
(5, 38.00, NOW() - INTERVAL '50 minutes'),

(1, 35.50, NOW() - INTERVAL '48 minutes'),
(2, 36.30, NOW() - INTERVAL '46 minutes'),
(3, 34.90, NOW() - INTERVAL '44 minutes'),
(4, 37.70, NOW() - INTERVAL '42 minutes'),
(5, 38.10, NOW() - INTERVAL '40 minutes'),

(1, 35.60, NOW() - INTERVAL '38 minutes'),
(2, 36.80, NOW() - INTERVAL '36 minutes'),
(3, 34.70, NOW() - INTERVAL '34 minutes'),
(4, 37.90, NOW() - INTERVAL '32 minutes'),
(5, 38.30, NOW() - INTERVAL '30 minutes'),

(1, 35.40, NOW() - INTERVAL '28 minutes'),
(2, 36.50, NOW() - INTERVAL '26 minutes'),
(3, 34.60, NOW() - INTERVAL '24 minutes'),
(4, 37.60, NOW() - INTERVAL '22 minutes'),
(5, 38.20, NOW() - INTERVAL '20 minutes');

INSERT INTO event_logs (bin_id, message, time_at) VALUES
(1, 'Bật đèn LED', NOW() - INTERVAL '10 minutes'),
(2, 'Cập nhật mức đầy', NOW() - INTERVAL '20 minutes'),
(3, 'Cảnh báo nhiệt độ', NOW() - INTERVAL '30 minutes'),
(4, 'Pin yếu', NOW() - INTERVAL '40 minutes'),
(5, 'Tắt đèn LED', NOW() - INTERVAL '50 minutes');

INSERT INTO alerts (bin_id, title, message, time_at) VALUES
(1, 'Cảnh báo đầy',       'Thùng rác gần đầy 80%', NOW() - INTERVAL '1 day'),
(2, 'Pin yếu',            'Mức pin dưới 30%',      NOW() - INTERVAL '2 days'),
(3, 'Nhiệt độ cao',       'Nhiệt độ vượt ngưỡng', NOW() - INTERVAL '3 days'),
(4, 'Lỗi cảm biến',       'Không đọc được dữ liệu',NOW() - INTERVAL '4 days'),
(5, 'Hoạt động trở lại',  'Cảm biến đã ổn định',   NOW() - INTERVAL '5 days');

INSERT INTO config_system_alerts (fill_level, battery, temperature) VALUES
(0.800, 0.300, 40.00);
