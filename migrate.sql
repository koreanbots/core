-- KOREANBOTSv2 마이그레이션 SQL쿼리문입니다.
use discordbots;

-- bots TABLE
ALTER TABLE `bots` CHANGE `servers` `servers` INT(11) NULL DEFAULT NULL, CHANGE `web` `web` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `git` `git` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `url` `url` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `category` `category` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '\'[]\'', CHANGE `status` `status` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `avatar` `avatar` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `tag` `tag` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `discord` `discord` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `state` `state` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '\'ok\'', CHANGE `vanity` `vanity` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `bg` `bg` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `banner` `banner` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;

-- USING NULL
UPDATE `bots` SET web=NULL where web='false' or web='';
UPDATE `bots` SET git=NULL where git='false' or git='';
UPDATE `bots` SET `url`=NULL where `url`='false' or `url`='';
UPDATE `bots` SET avatar=NULL where avatar='false' or avatar='';
UPDATE `bots` SET discord=NULL where discord='false' or discord='';
UPDATE `bots` SET vanity=NULL where vanity='false' or vanity='';
UPDATE `bots` SET bg=NULL where bg='false' or bg='';
UPDATE `bots` SET banner=NULL where banner='false' or banner='';
ALTER TABLE `bots` ADD COLUMN webhook TEXT DEFAULT NULL;
ALTER TABLE `bots` CHANGE id id VARCHAR(50) NOT NULL PRIMARY KEY;
ALTER TABLE `bots` CHANGE token token TEXT DEFAULT NULL;
ALTER TABLE `bots` ENGINE=mroonga;
ALTER TABLE `bots` COMMENT='engine "innodb"';
ALTER TABLE `bots` ADD `flags` INT NOT NULL DEFAULT 0;
ALTER TABLE `bots` ADD FULLTEXT KEY `search` (`name`, `intro`, `desc`) COMMENT 'tokenizer "TokenBigramIgnoreBlankSplitSymbolAlphaDigit"';

-- users TABLE
ALTER TABLE `users` ADD `flags` INT NOT NULL DEFAULT '0';
ALTER TABLE `users` ADD `email` TEXT NULL AFTER `id`;
ALTER TABLE `users` ADD `stared` TEXT NOT NULL DEFAULT '[]';
ALTER TABLE `users` ADD `discord` TEXT NOT NULL AFTER `token`;
UPDATE `users` SET `stared` = `votes` WHERE `id`=`id`;
ALTER TABLE `users` CHANGE `perm` `perm` TEXT NOT NULL DEFAULT 'user';
ALTER TABLE `users` CHANGE `votes` `votes` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{}';
ALTER TABLE `users` CHANGE `avatar` `avatar` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;
UPDATE `users` SET votes="{}";

-- submitted TABLE
ALTER TABLE `submitted` CHANGE `servers` `servers` INT(11) NULL DEFAULT NULL, CHANGE `web` `web` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `git` `git` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `url` `url` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `category` `category` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '\'[]\'', CHANGE `status` `status` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '\'???\'', CHANGE `name` `name` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `avatar` `avatar` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `verified` `verified` TINYINT(1) NULL DEFAULT '0', CHANGE `trusted` `trusted` TINYINT(1) NULL DEFAULT '0', CHANGE `discord` `discord` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;
ALTER TABLE `submitted` DROP `name`;
ALTER TABLE `submitted` DROP `tag`;
ALTER TABLE `submitted` DROP `votes`;
ALTER TABLE `submitted` DROP `servers`;
ALTER TABLE `submitted` DROP `status`;
ALTER TABLE `submitted` DROP `verified`;
ALTER TABLE `submitted` DROP `trusted`;
ALTER TABLE `submitted` DROP `avatar`;
ALTER TABLE `submitted` ADD `reason` TINYTEXT NULL DEFAULT NULL;  
UPDATE `submitted` SET web=NULL where web='false' or web='';
UPDATE `submitted` SET git=NULL where git='false' or git='';
UPDATE `submitted` SET `url`=NULL where `url`='false' or `url`='';
UPDATE `submitted` SET discord=NULL where discord='false' or discord='';

-- reports TABLE

CREATE TABLE `reports` ( `id` INT NOT NULL AUTO_INCREMENT , `issuer` TEXT NOT NULL , `type` TEXT NOT NULL , `reported` INT NOT NULL , `state` INT(1) NOT NULL DEFAULT '0' , `category` TEXT NOT NULL , `desc` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `reports` ADD `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `id`;
ALTER TABLE `reports` CHANGE `reported` `reported` TEXT NOT NULL;
ALTER TABLE `reports` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT, CHANGE `date` `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CHANGE `issuer` `issuer` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `type` `type` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `reported` `reported` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `category` `category` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `desc` `desc` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- FULLTEXT INDEX
ALTER TABLE `bots` ADD FULLTEXT(`name`, `desc`, `intro`);
SET GLOBAL innodb_ft_aux_table = 'discordbots/bots';

SET GLOBAL innodb_optimize_fulltext_only=ON;
