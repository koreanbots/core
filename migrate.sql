-- KOREANBOTSv2 마이그레이션 SQL쿼리문입니다.
use discordbots

-- ALTER bots TABLE
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

-- ALTER users TABLE
UPDATE `users` SET perm=0;
ALTER TABLE `users` CHANGE `perm` `perm` INT(5) NOT NULL DEFAULT '0';
ALTER TABLE `users` ADD `email` TEXT NULL AFTER `id`;

-- ALTER submitted TABLE
ALTER TABLE `submitted` CHANGE `servers` `servers` INT(11) NULL DEFAULT NULL, CHANGE `web` `web` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `git` `git` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `url` `url` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `category` `category` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '\'[]\'', CHANGE `status` `status` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '\'???\'', CHANGE `name` `name` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `avatar` `avatar` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL, CHANGE `verified` `verified` TINYINT(1) NULL DEFAULT '0', CHANGE `trusted` `trusted` TINYINT(1) NULL DEFAULT '0', CHANGE `discord` `discord` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;
ALTER TABLE `submitted` CHANGE `status` `status` MEDIUMTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL;

-- CREATE submits TABLE

CREATE TABLE `submits` (
  `id` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` int(11) NOT NULL,
  `owners` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `lib` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `votes` int(11) NOT NULL DEFAULT 0,
  `servers` int(11) DEFAULT NULL,
  `intro` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `desc` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `web` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `git` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT '\'[]\'',
  `status` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tag` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `verified` tinyint(1) DEFAULT 0,
  `trusted` tinyint(1) DEFAULT 0,
  `discord` mediumtext COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` int(1) NOT NULL DEFAULT 0,
  `reason` tinytext COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- FULLTEXT INDEX
ALTER TABLE `bots` ADD FULLTEXT(`name`, `desc`, `intro`);
SET GLOBAL innodb_ft_aux_table = 'discordbots/bots';

SET GLOBAL innodb_optimize_fulltext_only=ON;
