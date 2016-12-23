/*
==== SERVERS ====
 */

CREATE TABLE `servers` (
  `id`   VARCHAR(32)
         COLLATE utf8_unicode_ci NOT NULL,
  `name` VARCHAR(256)
         COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

/*
==== USERS ====
 */

CREATE TABLE `users` (
  `id`       VARCHAR(32)
             COLLATE utf8_unicode_ci NOT NULL,
  `serverId` VARCHAR(32)
             COLLATE utf8_unicode_ci NOT NULL,
  `type`     VARCHAR(45)
             CHARACTER SET utf8      NOT NULL DEFAULT 'NONE',
  `role`     VARCHAR(16)
             COLLATE utf8_unicode_ci NOT NULL DEFAULT 'USER',
  PRIMARY KEY (`id`, `serverId`),
  KEY `server_user_idx` (`serverId`),
  CONSTRAINT `server_user` FOREIGN KEY (`serverId`) REFERENCES `servers` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;


/*
==== RATES ====
 */

CREATE TABLE `rates` (
  `userId`    VARCHAR(32)
              COLLATE utf8_unicode_ci NOT NULL,
  `serverId`  VARCHAR(32)
              COLLATE utf8_unicode_ci NOT NULL,
  `type`      VARCHAR(10)
              COLLATE utf8_unicode_ci NOT NULL,
  `startTime` INT(2)                  NOT NULL,
  `rate`      DECIMAL(5, 2)           NOT NULL,
  PRIMARY KEY (`userId`, `serverId`, `type`, `startTime`),
  KEY `rate_server_idx` (`serverId`),
  CONSTRAINT `rate_server` FOREIGN KEY (`serverId`) REFERENCES `servers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `user_rates` FOREIGN KEY (`userId`) REFERENCES `users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;


/*
==== SETTINGS ====
 */

CREATE TABLE `settings` (
  `serverId` VARCHAR(32)
             COLLATE utf8_unicode_ci NOT NULL,
  `setting`  VARCHAR(45)
             COLLATE utf8_unicode_ci NOT NULL,
  `value`    VARCHAR(256)
             COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`serverId`, `setting`),
  UNIQUE KEY `server_setting_primary` (`serverId`, `setting`),
  KEY `serverId_idx` (`serverId`),
  CONSTRAINT `server_settings` FOREIGN KEY (`serverId`) REFERENCES `servers` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;


/*
==== TYPES ====
 */

CREATE TABLE `types` (
  `serverId` VARCHAR(32)
             COLLATE utf8_unicode_ci NOT NULL,
  `name`     VARCHAR(32)
             COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`serverId`, `name`),
  CONSTRAINT `server_types` FOREIGN KEY (`serverId`) REFERENCES `servers` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;

/*
==== ROLES ====
 */

CREATE TABLE `roles` (
  `serverId` VARCHAR(32)
             COLLATE utf8_unicode_ci NOT NULL,
  `name`     VARCHAR(32)
             COLLATE utf8_unicode_ci DEFAULT NULL,
  `type`     VARCHAR(32)
             COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`serverId`, `type`),
  CONSTRAINT `server_roles` FOREIGN KEY (`serverId`) REFERENCES `servers` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8
  COLLATE = utf8_unicode_ci;
