CREATE TABLE `social_connections` (
	`id` integer PRIMARY KEY NOT NULL,
	`user_id` integer,
	`provider` text NOT NULL,
	`provider_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`username` text,
	`password` text,
	`email` text NOT NULL,
	`birthday` integer,
	`country` text,
	`about_me` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);

CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
CREATE TABLE `watch_list` (
	`media_id` integer NOT NULL,
	`media_slug` text NOT NULL,
	`user_id` integer,
	`status` integer NOT NULL,
	`score` integer,
	`progress` integer NOT NULL,
	`started_date` text,
	`finished_date` text,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`media_id`, `user_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
