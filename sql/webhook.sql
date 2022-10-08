-- Webhook 기능 추가를 위한 SQL 쿼리문입니다.
use discordbots;

-- bots TABLE
ALTER TABLE `bots` ADD COLUMN webhook_status INT NOT NULL DEFAULT '1';

-- servers TABLE
ALTER TABLE `servers` ADD COLUMN webhook TEXT DEFAULT NULL;
ALTER TABLE `servers` ADD COLUMN webhook_status INT NOT NULL DEFAULT '1';
