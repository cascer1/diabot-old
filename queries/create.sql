CREATE TABLE IF NOT EXISTS `users` (
  `id`   VARCHAR(32)
         COLLATE utf8_unicode_ci NOT NULL,
  `type` VARCHAR(45)
         COLLATE utf8_unicode_ci DEFAULT 'No',
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `rates` (
  `userId`    VARCHAR(32)
              COLLATE utf8_unicode_ci NOT NULL,
  `type`      VARCHAR(10)
              COLLATE utf8_unicode_ci NOT NULL,
  `startTime` INT(2)                  NOT NULL,
  `rate`      DECIMAL(5, 2)           NOT NULL,
  PRIMARY KEY (`userId`, `type`, `startTime`),
  CONSTRAINT `user_rates` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `servers` (
  `id`      VARCHAR(32)
            COLLATE utf8_unicode_ci NOT NULL,
  `name`    VARCHAR(256)
            COLLATE utf8_unicode_ci DEFAULT NULL,
  `ownerId` VARCHAR(32)
            COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `server_owner_idx` (`ownerId`),
  CONSTRAINT `server_owner` FOREIGN KEY (`ownerId`) REFERENCES `users` (`id`)
    ON UPDATE CASCADE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

CREATE TABLE IF NOT EXISTS `settings` (
  `serverId` VARCHAR(32)
             COLLATE utf8_unicode_ci NOT NULL,
  `setting`  VARCHAR(45)
             COLLATE utf8_unicode_ci NOT NULL,
  `value`    VARCHAR(256)
             COLLATE utf8_unicode_ci DEFAULT NULL,
  UNIQUE KEY `server_setting_primary` (`serverId`, `setting`),
  KEY `serverId_idx` (`serverId`),
  CONSTRAINT `server_settings` FOREIGN KEY (`serverId`) REFERENCES `servers` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;