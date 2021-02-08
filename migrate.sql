-- KOREANBOTSv2 마이그레이션 SQL쿼리문입니다.
use discordbots;

-- bots TABLE
ALTER TABLE `bots` CHANGE `servers` `servers` INT(11) NULL DEFAULT NULL, CHANGE `web` `web` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `git` `git` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `url` `url` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `category` `category` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '\'[]\'', CHANGE `status` `status` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `avatar` `avatar` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `tag` `tag` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `discord` `discord` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL, CHANGE `state` `state` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '\'ok\'', CHANGE `vanity` `vanity` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `bg` `bg` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `banner` `banner` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;

-- USING NULL
UPDATE `bots` SET web=NULL where web='false';
UPDATE `bots` SET git=NULL where git='false';
UPDATE `bots` SET url=NULL where url='false';
UPDATE `bots` SET avatar=NULL where avatar='false';
UPDATE `bots` SET discord=NULL where discord='false';
UPDATE `bots` SET vanity=NULL where vanity='false';
UPDATE `bots` SET bg=NULL where bg='false';
UPDATE `bots` SET banner=NULL where banner='false';
ALTER TABLE `bots` ADD COLUMN partnered BOOLEAN NOT NULL DEFAULT 0;
ALTER TABLE `bots` CHANGE id id VARCHAR(50) NOT NULL PRIMARY KEY;
ALTER TABLE `bots` ENGINE=mroonga;
ALTER TABLE `bots` COMMENT='engine "innodb"';
ALTER TABLE bots ADD FULLTEXT KEY `search` (`name`, `intro`, `desc`) COMMENT 'tokenizer "TokenBigramIgnoreBlankSplitSymbolAlphaDigit"';

-- users TABLE
UPDATE `users` SET perm=0;
ALTER TABLE `users` CHANGE `perm` `perm` INT(5) NOT NULL DEFAULT '0';
ALTER TABLE `users` ADD `email` TEXT NULL AFTER `id`;
ALTER TABLE `users` ADD `stared` TEXT NOT NULL DEFAULT '[]';
ALTER TABLE `users` ADD `discord` TEXT NOT NULL AFTER `token`;
UPDATE `users` SET `stared` = `votes` WHERE `id`=`id`;
ALTER TABLE `users` CHANGE `votes` `votes` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{}';
ALTER TABLE `users` CHANGE `avatar` `avatar` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;
UPDATE `users` SET votes="{}";

-- submitted TABLE
ALTER TABLE `submitted` CHANGE `servers` `servers` INT(11) NULL DEFAULT NULL, CHANGE `web` `web` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `git` `git` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `url` `url` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `category` `category` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '\'[]\'', CHANGE `status` `status` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '\'???\'', CHANGE `name` `name` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `avatar` `avatar` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `verified` `verified` TINYINT(1) NULL DEFAULT '0', CHANGE `trusted` `trusted` TINYINT(1) NULL DEFAULT '0', CHANGE `discord` `discord` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;
ALTER TABLE `submitted` CHANGE `status` `status` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;

-- submits TABLE

CREATE TABLE `submits` (
  `id` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` int(11) NOT NULL,
  `owners` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `lib` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `intro` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `web` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `git` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT '\'[]\'',
  `tag` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `discord` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` int(1) NOT NULL DEFAULT 0,
  `reason` tinytext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- reports TABLE

CREATE TABLE `reports` ( `id` INT NOT NULL AUTO_INCREMENT , `issuer` TEXT NOT NULL , `type` TEXT NOT NULL , `reported` INT NOT NULL , `state` INT(1) NOT NULL DEFAULT '0' , `category` TEXT NOT NULL , `desc` TEXT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;
ALTER TABLE `reports` ADD `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `id`;
ALTER TABLE `reports` CHANGE `reported` `reported` TEXT NOT NULL;
ALTER TABLE `reports` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT, CHANGE `date` `date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CHANGE `issuer` `issuer` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `type` `type` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `reported` `reported` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `category` `category` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL, CHANGE `desc` `desc` TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL;

-- FULLTEXT INDEX
ALTER TABLE `bots` ADD FULLTEXT(`name`, `desc`, `intro`);
SET GLOBAL innodb_ft_aux_table = 'discordbots/bots';

SET GLOBAL innodb_optimize_fulltext_only=ON;
