CREATE TABLE `mascot_finds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`pageId` varchar(64) NOT NULL,
	`foundAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mascot_finds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mascot_rewards` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`discountCode` varchar(32) NOT NULL,
	`discountPercent` int NOT NULL DEFAULT 15,
	`claimedAt` timestamp NOT NULL DEFAULT (now()),
	`usedAt` timestamp,
	CONSTRAINT `mascot_rewards_id` PRIMARY KEY(`id`),
	CONSTRAINT `mascot_rewards_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `mascot_rewards_discountCode_unique` UNIQUE(`discountCode`)
);
