-- CreateTable
CREATE TABLE `bots` (
    `id` VARCHAR(50) NOT NULL,
    `date` INTEGER NOT NULL,
    `owners` MEDIUMTEXT NOT NULL,
    `lib` MEDIUMTEXT NOT NULL,
    `prefix` MEDIUMTEXT NOT NULL,
    `votes` INTEGER NOT NULL DEFAULT 0,
    `servers` INTEGER NULL,
    `shards` INTEGER NULL,
    `intro` MEDIUMTEXT NOT NULL,
    `desc` LONGTEXT NOT NULL,
    `web` MEDIUMTEXT NULL,
    `git` MEDIUMTEXT NULL,
    `url` MEDIUMTEXT NULL,
    `category` MEDIUMTEXT NOT NULL DEFAULT '[]',
    `status` TEXT NULL,
    `name` TEXT NULL,
    `avatar` TEXT NULL,
    `tag` TEXT NULL,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `trusted` BOOLEAN NOT NULL DEFAULT false,
    `discord` MEDIUMTEXT NULL,
    `token` TEXT NULL,
    `state` TEXT NOT NULL DEFAULT 'ok',
    `boosted` BOOLEAN NOT NULL DEFAULT false,
    `vanity` TEXT NULL,
    `bg` TEXT NULL,
    `banner` TEXT NULL,
    `partnered` BOOLEAN NOT NULL DEFAULT false,
    `webhook` TEXT NULL,
    `flags` BOOLEAN NOT NULL DEFAULT false,

    FULLTEXT INDEX `search`(`name`, `intro`, `desc`),
    FULLTEXT INDEX `name`(`name`, `desc`, `intro`),
    FULLTEXT INDEX `name_2`(`name`, `desc`, `intro`),
    FULLTEXT INDEX `name_3`(`name`, `desc`, `intro`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reports` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `issuer` TEXT NOT NULL,
    `type` TEXT NOT NULL,
    `reported` TEXT NOT NULL,
    `state` INTEGER NOT NULL DEFAULT 0,
    `category` TEXT NOT NULL,
    `desc` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servers` (
    `id` VARCHAR(191) NOT NULL,
    `name` TEXT NULL,
    `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `votes` INTEGER NOT NULL DEFAULT 0,
    `intro` MEDIUMTEXT NOT NULL,
    `desc` LONGTEXT NOT NULL,
    `owners` TEXT NOT NULL DEFAULT '[]',
    `category` MEDIUMTEXT NOT NULL DEFAULT '[]',
    `invite` TINYTEXT NULL,
    `token` TEXT NULL,
    `state` TEXT NOT NULL DEFAULT 'ok',
    `vanity` TEXT NULL,
    `bg` TEXT NULL,
    `banner` TEXT NULL,
    `flags` INTEGER NOT NULL DEFAULT 0,

    FULLTEXT INDEX `search`(`name`, `intro`, `desc`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submitted` (
    `id` VARCHAR(191) NOT NULL,
    `date` INTEGER NOT NULL,
    `owners` MEDIUMTEXT NOT NULL,
    `lib` MEDIUMTEXT NOT NULL,
    `prefix` MEDIUMTEXT NOT NULL,
    `intro` MEDIUMTEXT NOT NULL,
    `desc` LONGTEXT NOT NULL,
    `web` MEDIUMTEXT NULL,
    `git` MEDIUMTEXT NULL,
    `url` MEDIUMTEXT NULL,
    `category` MEDIUMTEXT NULL DEFAULT '[]',
    `discord` MEDIUMTEXT NULL,
    `state` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(19) NOT NULL,
    `email` VARCHAR(191) NULL,
    `perm` VARCHAR(191) NOT NULL DEFAULT 'user',
    `date` INTEGER NOT NULL,
    `bots` MEDIUMTEXT NOT NULL DEFAULT '[]',
    `token` MEDIUMTEXT NOT NULL,
    `discord` TEXT NOT NULL,
    `avatar` MEDIUMTEXT NULL,
    `username` MEDIUMTEXT NOT NULL,
    `tag` MEDIUMTEXT NOT NULL,
    `votes` LONGTEXT NOT NULL DEFAULT '{}',
    `github` TINYTEXT NULL,
    `flags` INTEGER NOT NULL DEFAULT 0,
    `starred` TEXT NOT NULL DEFAULT '[]',

    UNIQUE INDEX `users_id_key`(`id`),
    FULLTEXT INDEX `id_2`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
