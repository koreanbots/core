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
UPDATE `bots` SET banner=NULL where banner='false'
