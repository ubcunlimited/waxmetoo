CREATE TABLE `giveaway_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`confirmToken` varchar(64) NOT NULL,
	`confirmed` boolean NOT NULL DEFAULT false,
	`confirmedAt` timestamp,
	`ipAddress` varchar(45),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `giveaway_entries_id` PRIMARY KEY(`id`),
	CONSTRAINT `giveaway_entries_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `giveaway_winners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`drawMonth` varchar(7) NOT NULL,
	`entryId` int NOT NULL,
	`firstName` varchar(100) NOT NULL,
	`lastName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`drawnAt` timestamp NOT NULL DEFAULT (now()),
	`notified` boolean NOT NULL DEFAULT false,
	CONSTRAINT `giveaway_winners_id` PRIMARY KEY(`id`),
	CONSTRAINT `giveaway_winners_drawMonth_unique` UNIQUE(`drawMonth`)
);
