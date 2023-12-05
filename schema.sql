CREATE TABLE `users` (
  `id` integer PRIMARY KEY AUTO_INCREMENT ,
  `name` varchar(255) NOT NULL,
  `age` varchar(255) NOT NULL,
  `email` varchar(255) UNIQUE,
  `password` varchar(255) NOT NULL
);

CREATE TABLE `products` (
  `id` integer PRIMARY KEY AUTO_INCREMENT ,
  `pName` varchar(255) NOT NULL,
  `pDescription` varchar(255),
  `price` decimal(10,2) NOt NULL,
  `createdby` integer NOT NULL
);

ALTER TABLE `products` ADD FOREIGN KEY (`createdby`) REFERENCES `users` (`id`);
