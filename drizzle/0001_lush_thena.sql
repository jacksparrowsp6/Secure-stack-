CREATE TABLE `articles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(180) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` varchar(320) NOT NULL,
	`contentHtml` text NOT NULL,
	`category` varchar(100) NOT NULL DEFAULT 'VPN Troubleshooting',
	`status` enum('draft','published') NOT NULL DEFAULT 'published',
	`authorName` varchar(120) NOT NULL DEFAULT 'SecureStack Editorial',
	`publishedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `articles_id` PRIMARY KEY(`id`),
	CONSTRAINT `articles_slug_unique` UNIQUE(`slug`)
);
