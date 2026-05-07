ALTER TABLE `mascot_rewards` MODIFY COLUMN `discountPercent` int NOT NULL DEFAULT 20;--> statement-breakpoint
ALTER TABLE `mascot_rewards` ADD `fullName` varchar(200);--> statement-breakpoint
ALTER TABLE `mascot_rewards` ADD `phone` varchar(30);--> statement-breakpoint
ALTER TABLE `mascot_rewards` ADD `email` varchar(320);