-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.41 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 테이블 sample1.board 구조 내보내기
CREATE TABLE IF NOT EXISTS `board` (
  `BOARDNO` int NOT NULL AUTO_INCREMENT,
  `TITLE` varchar(100) DEFAULT NULL,
  `CONTENTS` varchar(200) DEFAULT NULL,
  `USERID` varchar(45) DEFAULT NULL,
  `CDATETIME` datetime DEFAULT NULL,
  `UDATETIME` datetime DEFAULT NULL,
  PRIMARY KEY (`BOARDNO`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.board:~2 rows (대략적) 내보내기
INSERT INTO `board` (`BOARDNO`, `TITLE`, `CONTENTS`, `USERID`, `CDATETIME`, `UDATETIME`) VALUES
	(1, '제목 11', '내용 11', 'user01', '2025-02-03 17:04:17', '2025-02-03 17:04:17'),
	(4, '제목 33', '내용 33', 'user01', '2025-02-03 17:06:18', '2025-02-03 17:06:18');

-- 테이블 sample1.comments 구조 내보내기
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `photo_id` int DEFAULT NULL,
  `post_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `content` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.comments:~39 rows (대략적) 내보내기
INSERT INTO `comments` (`id`, `photo_id`, `post_id`, `user_id`, `content`, `created_at`) VALUES
	(1, NULL, 54, 2, 'aa', '2025-05-09 16:17:33'),
	(2, NULL, 54, 2, 'ㅁㅁㅁㅁㅁ', '2025-05-09 16:17:50'),
	(3, NULL, 54, 2, 'dfs', '2025-05-09 16:49:09'),
	(4, NULL, 54, 2, 'aaaaa', '2025-05-09 16:55:47'),
	(5, NULL, 54, 2, 'fffff', '2025-05-09 16:55:58'),
	(6, NULL, 54, 2, 'ddd', '2025-05-09 16:56:00'),
	(7, NULL, 54, 2, 'sdfgsg', '2025-05-09 16:56:10'),
	(8, NULL, 54, 2, 'aaaa', '2025-05-09 17:04:24'),
	(9, NULL, 54, 2, 'aaaa', '2025-05-09 17:04:54'),
	(10, NULL, 54, 2, 'aaaaa', '2025-05-09 17:11:39'),
	(11, NULL, 54, 2, 'aaaa', '2025-05-09 17:12:36'),
	(12, NULL, 54, 2, 'aaa', '2025-05-09 17:12:49'),
	(13, NULL, 54, 2, 'aaaaaaaa', '2025-05-09 17:13:12'),
	(14, NULL, 54, 2, 'sfgdgdhdf', '2025-05-09 17:13:30'),
	(15, NULL, 54, 2, 'aaaaaa', '2025-05-09 17:17:42'),
	(16, NULL, 54, 2, 'ㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ', '2025-05-09 17:18:52'),
	(17, NULL, 54, 2, '222', '2025-05-09 17:31:09'),
	(18, NULL, 54, 2, 'aaa', '2025-05-09 17:37:34'),
	(19, NULL, 54, 2, 'aaa', '2025-05-09 17:37:48'),
	(20, NULL, 54, 2, 'aaa', '2025-05-09 17:39:39'),
	(21, NULL, 54, 2, 'ssssss', '2025-05-09 17:39:56'),
	(22, NULL, 54, 2, 'ㅁㅁㅁ', '2025-05-09 17:53:57'),
	(23, NULL, 54, 2, 'aaa', '2025-05-09 18:02:28'),
	(24, NULL, 54, 2, 'hhhhhh', '2025-05-09 18:06:41'),
	(25, NULL, 54, 2, 'ㄴㄴㄴ', '2025-05-09 18:11:15'),
	(26, NULL, 55, 2, 'jjjjjj', '2025-05-12 09:43:42'),
	(27, NULL, 55, 2, 'ㅓ', '2025-05-12 09:44:17'),
	(28, NULL, 59, 9, '2222', '2025-05-12 15:12:39'),
	(29, NULL, 59, 9, 'aaa', '2025-05-12 15:18:00'),
	(30, NULL, 59, 9, '222', '2025-05-12 15:51:50'),
	(31, NULL, 59, 9, 'ㅁㅁㅁ', '2025-05-12 15:53:05'),
	(32, NULL, 59, 9, '111', '2025-05-12 15:57:14'),
	(33, NULL, 59, 9, 'ㅡㅡㅡ', '2025-05-12 16:04:23'),
	(35, NULL, 58, 9, '222', '2025-05-12 16:17:41'),
	(37, NULL, 61, 9, 'aaaㅁㅁ', '2025-05-12 16:29:43'),
	(38, NULL, 61, 9, 'ㅎㅇ', '2025-05-12 16:30:41'),
	(39, NULL, 61, 9, '444', '2025-05-12 16:42:42'),
	(40, NULL, 61, 9, 'ㅅㄷㄴㅅ', '2025-05-12 16:43:53'),
	(41, NULL, 61, 9, 'ㅁㅁㅁ', '2025-05-12 16:51:37'),
	(42, NULL, 61, 9, 'AAA', '2025-05-12 16:52:03'),
	(43, NULL, 61, 9, '222', '2025-05-13 12:00:50');

-- 테이블 sample1.friends 구조 내보내기
CREATE TABLE IF NOT EXISTS `friends` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `friend_id` int NOT NULL,
  `status` enum('pending','accepted') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_friendship` (`user_id`,`friend_id`),
  KEY `friend_id` (`friend_id`),
  CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.friends:~2 rows (대략적) 내보내기
INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `status`, `created_at`) VALUES
	(15, 2, 9, 'pending', '2025-05-15 16:12:50'),
	(16, 9, 2, 'pending', '2025-05-15 16:12:50');

-- 테이블 sample1.friend_requests 구조 내보내기
CREATE TABLE IF NOT EXISTS `friend_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `from_user_id` int NOT NULL,
  `to_user_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.friend_requests:~2 rows (대략적) 내보내기
INSERT INTO `friend_requests` (`id`, `from_user_id`, `to_user_id`, `status`, `created_at`) VALUES
	(4, 2, 9, 'accepted', '2025-05-15 16:10:11'),
	(5, 9, 2, 'accepted', '2025-05-15 16:12:41');

-- 테이블 sample1.friend_reviews 구조 내보내기
CREATE TABLE IF NOT EXISTS `friend_reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reviewer_id` int NOT NULL,
  `reviewee_id` int NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `reviewer_id` (`reviewer_id`),
  KEY `reviewee_id` (`reviewee_id`),
  CONSTRAINT `friend_reviews_ibfk_1` FOREIGN KEY (`reviewer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `friend_reviews_ibfk_2` FOREIGN KEY (`reviewee_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.friend_reviews:~0 rows (대략적) 내보내기

-- 테이블 sample1.guestbook 구조 내보내기
CREATE TABLE IF NOT EXISTS `guestbook` (
  `id` int NOT NULL AUTO_INCREMENT,
  `homepage_id` int NOT NULL,
  `writer_id` int NOT NULL,
  `content` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `homepage_id` (`homepage_id`),
  KEY `writer_id` (`writer_id`),
  CONSTRAINT `guestbook_ibfk_1` FOREIGN KEY (`homepage_id`) REFERENCES `homepages` (`id`),
  CONSTRAINT `guestbook_ibfk_2` FOREIGN KEY (`writer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.guestbook:~0 rows (대략적) 내보내기

-- 테이블 sample1.homepages 구조 내보내기
CREATE TABLE IF NOT EXISTS `homepages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(100) DEFAULT NULL,
  `background_music` varchar(255) DEFAULT NULL,
  `skin_theme` varchar(100) DEFAULT NULL,
  `visit_count` int DEFAULT '0',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `homepages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.homepages:~0 rows (대략적) 내보내기

-- 테이블 sample1.home_info 구조 내보내기
CREATE TABLE IF NOT EXISTS `home_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `intro` text,
  `background_color` varchar(20) DEFAULT NULL,
  `profile_img` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.home_info:~0 rows (대략적) 내보내기

-- 테이블 sample1.home_settings 구조 내보내기
CREATE TABLE IF NOT EXISTS `home_settings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `background_color` varchar(20) DEFAULT '#ffffff',
  `text_color` varchar(20) DEFAULT '#000000',
  `background_image` varchar(255) DEFAULT 'default.jpg',
  `font_style` varchar(100) DEFAULT 'Hi Melody',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `home_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.home_settings:~3 rows (대략적) 내보내기
INSERT INTO `home_settings` (`id`, `user_id`, `background_color`, `text_color`, `background_image`, `font_style`, `created_at`, `updated_at`) VALUES
	(1, 4, '#ffffff', '#000000', 'pattern.jpg', 'Hi Melody', '2025-05-08 03:59:05', '2025-05-08 03:59:05'),
	(2, 2, '#000000', '#000000', '/images/pattern.png', 'Hi Melody', '2025-05-08 04:04:51', '2025-05-08 04:04:51'),
	(3, 8, '#000000', '#000000', '/images/pattern.png', 'Hi Melody', '2025-05-08 07:47:26', '2025-05-08 07:47:26');

-- 테이블 sample1.notifications 구조 내보내기
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `message` text,
  `is_read` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.notifications:~1 rows (대략적) 내보내기
INSERT INTO `notifications` (`id`, `sender_id`, `receiver_id`, `type`, `message`, `is_read`, `created_at`) VALUES
	(1, 9, 2, 'friend_accept', '일촌 요청이 수락되었습니다!', 0, '2025-05-15 07:12:50');

-- 테이블 sample1.photos 구조 내보내기
CREATE TABLE IF NOT EXISTS `photos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `caption` text,
  `album_name` varchar(100) DEFAULT NULL,
  `description` text,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `photos_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.photos:~61 rows (대략적) 내보내기
INSERT INTO `photos` (`id`, `user_id`, `image_url`, `caption`, `album_name`, `description`, `created_at`) VALUES
	(1, 9, 'uploads/photos/1747039929367_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:09'),
	(2, 9, 'uploads/photos/1747039931766_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:11'),
	(3, 9, 'uploads/photos/1747039931909_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:11'),
	(4, 9, 'uploads/photos/1747039932046_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:12'),
	(5, 9, 'uploads/photos/1747039932173_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:12'),
	(6, 9, 'uploads/photos/1747039932309_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:12'),
	(7, 9, 'uploads/photos/1747039948005_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:28'),
	(8, 9, 'uploads/photos/1747039952349_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:32'),
	(9, 9, 'uploads/photos/1747039952511_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:32'),
	(10, 9, 'uploads/photos/1747039953422_1.jfif', NULL, 'My Album', NULL, '2025-05-12 17:52:33'),
	(11, 9, 'uploads/photos/1747040039166_2.PNG', NULL, 'My Album', NULL, '2025-05-12 17:53:59'),
	(12, 9, 'uploads/photos/1747040079906_2.PNG', NULL, 'My Album', NULL, '2025-05-12 17:54:39'),
	(13, 9, 'uploads/photos/1747040082123_2.PNG', NULL, 'My Album', NULL, '2025-05-12 17:54:42'),
	(14, 9, 'uploads/photos/1747040086244_2.PNG', NULL, 'My Album', NULL, '2025-05-12 17:54:46'),
	(15, 9, 'uploads/photos/1747040113903_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:55:13'),
	(16, 9, 'uploads/photos/1747040115691_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:55:15'),
	(17, 9, 'uploads/photos/1747040115963_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:55:15'),
	(18, 9, 'uploads/photos/1747040116099_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:55:16'),
	(19, 9, 'uploads/photos/1747040116227_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:55:16'),
	(20, 9, 'uploads/photos/1747040116363_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:55:16'),
	(21, 9, 'uploads/photos/1747040196585_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:56:36'),
	(22, 9, 'uploads/photos/1747040196590_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:56:36'),
	(23, 9, 'uploads/photos/1747040196594_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:56:36'),
	(24, 9, 'uploads/photos/1747040196593_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:56:36'),
	(25, 9, 'uploads/photos/1747040196595_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:56:36'),
	(26, 9, 'uploads/photos/1747040196597_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:56:36'),
	(27, 9, 'uploads/photos/1747040263297_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:57:43'),
	(28, 9, 'uploads/photos/1747040263296_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:57:43'),
	(29, 9, 'uploads/photos/1747040263290_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:57:43'),
	(30, 9, 'uploads/photos/1747040263300_3ë².PNG', NULL, 'My Album', NULL, '2025-05-12 17:57:43'),
	(31, 9, 'uploads/photos/1747041174191_3.jpg', '1', '', NULL, '2025-05-12 18:12:54'),
	(32, 9, 'uploads/photos/1747041309321_3.jpg', '1', '', '1', '2025-05-12 18:15:09'),
	(33, 9, 'uploads/photos/1747041368877_3.jpg', '1', '', '1', '2025-05-12 18:16:08'),
	(34, 9, 'uploads/photos/1747041384456_1.jfif', '2', '', '2', '2025-05-12 18:16:24'),
	(35, 9, 'uploads/photos/1747041489764_1.PNG', '11', '', '11', '2025-05-12 18:18:09'),
	(36, 9, 'uploads/photos/1747041544819_1.PNG', '11', '', '11', '2025-05-12 18:19:04'),
	(37, 9, 'uploads/photos/1747103727379_1.PNG', '123', '', '123', '2025-05-13 11:35:27'),
	(38, 9, 'uploads/photos/1747103849237_1.PNG', '123', '', '123', '2025-05-13 11:37:29'),
	(39, 9, 'uploads/photos/1747103896830_1.PNG', '123', '', '123', '2025-05-13 11:38:16'),
	(40, 9, 'uploads/photos/1747104027906_1.PNG', '123', '', '123', '2025-05-13 11:40:27'),
	(41, 9, 'uploads/photos/1747104258022_1.PNG', '123', '', '123', '2025-05-13 11:44:18'),
	(42, 9, 'uploads/photos/1747104329899_1.PNG', '123', '', '123', '2025-05-13 11:45:29'),
	(43, 9, 'uploads/photos/1747104398886_1.PNG', '123', '', '123', '2025-05-13 11:46:38'),
	(44, 9, 'uploads/photos/1747104449124_1.PNG', '123', '', '123', '2025-05-13 11:47:29'),
	(45, 9, 'uploads/photos/1747104511660_1.PNG', '123', '', '123', '2025-05-13 11:48:31'),
	(46, 9, 'uploads/photos/1747104511664_1.PNG', '123', '', '123', '2025-05-13 11:48:31'),
	(47, 9, 'uploads/photos/1747104517197_1.PNG', '123', '', '123', '2025-05-13 11:48:37'),
	(48, 9, 'uploads/photos/1747104589319_1.jfif', '22', '', '22', '2025-05-13 11:49:49'),
	(49, 9, 'uploads/photos/1747104672699_1.jfif', '22', '', '22', '2025-05-13 11:51:12'),
	(50, 9, 'uploads/photos/1747104675827_1.jfif', '22', '', '22', '2025-05-13 11:51:15'),
	(51, 9, 'uploads/photos/1747104744435_1.jfif', '22', '', '22', '2025-05-13 11:52:24'),
	(52, 9, 'uploads/photos/1747104811576_1.jfif', '22', '', '22', '2025-05-13 11:53:31'),
	(53, 9, 'uploads/photos/1747104899253_1.PNG', '55', '', '55', '2025-05-13 11:54:59'),
	(54, 9, 'uploads/photos/1747105006141_1.PNG', '55', '', '55', '2025-05-13 11:56:46'),
	(55, 9, 'uploads/photos/1747105139025_1.PNG', '55', '', '55', '2025-05-13 11:58:59'),
	(56, 9, 'uploads/photos/1747105340588_2.PNG', '123', '', '123', '2025-05-13 12:02:20'),
	(57, 9, 'uploads/photos/1747105394450_2.PNG', '123', '', '123', '2025-05-13 12:03:14'),
	(58, 9, 'uploads/photos/1747105570443_2.PNG', '123', '', '123', '2025-05-13 12:06:10'),
	(59, 9, 'uploads/photos/1747105570447_1.PNG', '55', '', '55', '2025-05-13 12:06:10'),
	(60, 9, 'uploads/photos/1747105570450_1.PNG', '55', '', '55', '2025-05-13 12:06:10'),
	(61, 9, 'uploads/photos/1747105805494_3.PNG', '11', '', '11', '2025-05-13 12:10:05');

-- 테이블 sample1.posts 구조 내보내기
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `title` varchar(200) DEFAULT NULL,
  `content` text,
  `visibility` enum('public','friends','private') DEFAULT 'public',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.posts:~61 rows (대략적) 내보내기
INSERT INTO `posts` (`id`, `user_id`, `title`, `content`, `visibility`, `created_at`) VALUES
	(1, 2, 'aa', '<p>aa</p>', 'public', '2025-05-08 16:44:48'),
	(2, 2, 'aa', '<p>aa</p>', 'public', '2025-05-08 16:44:49'),
	(3, 2, 'aa', '<p>aa</p>', 'public', '2025-05-08 16:44:50'),
	(4, 2, 'test', '<p>test</p>', 'public', '2025-05-08 16:45:22'),
	(5, 8, 'ㅅㄷㄴㅅ', '<p>ㅅㄷㄴㅅ</p>', 'public', '2025-05-08 16:56:13'),
	(6, 2, '1234', '<p>1234</p>', 'public', '2025-05-08 16:58:18'),
	(7, 2, '11', '<p>11</p>', 'public', '2025-05-08 16:59:42'),
	(8, 2, '11', '<p>11</p>', 'public', '2025-05-08 17:00:21'),
	(9, 2, '1', '<p>1</p>', 'public', '2025-05-08 17:00:27'),
	(10, 2, '1', '<p>1</p>', 'public', '2025-05-08 17:00:44'),
	(11, 2, '1', '<p>1</p>', 'public', '2025-05-08 17:00:50'),
	(12, 2, '1', '<p>1</p>', 'public', '2025-05-08 17:00:50'),
	(13, 2, '1', '<p>1</p>', 'public', '2025-05-08 17:00:51'),
	(14, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 11:56:17'),
	(15, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 11:56:39'),
	(16, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 11:56:45'),
	(17, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 11:56:45'),
	(18, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 11:56:45'),
	(19, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 11:56:45'),
	(20, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 11:56:48'),
	(21, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 12:00:13'),
	(22, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 12:00:14'),
	(23, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 12:00:14'),
	(24, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 12:00:17'),
	(25, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 12:00:17'),
	(26, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 12:00:18'),
	(27, 2, 'aa', '<p>aa</p>', 'public', '2025-05-09 12:00:46'),
	(28, 2, 'aaaaaa', '<p>aaaa</p>', 'public', '2025-05-09 12:01:54'),
	(29, 2, 'aaaaaa', '<p>aaaa</p>', 'public', '2025-05-09 12:06:25'),
	(30, 2, 'aaaaaa', '<p>aaaa</p>', 'public', '2025-05-09 12:11:13'),
	(31, 2, 'aaaaaa111', '<p>aaaa</p>', 'public', '2025-05-09 12:11:19'),
	(32, 2, 'ㅁㅁ', 'ㅁㅁ', 'public', '2025-05-09 12:13:21'),
	(33, 2, '111', '11', 'public', '2025-05-09 12:16:32'),
	(34, 2, '222', '2222', 'public', '2025-05-09 12:18:50'),
	(35, 2, '222', '2222', 'public', '2025-05-09 12:30:44'),
	(36, 2, '222', '2222', 'public', '2025-05-09 12:33:49'),
	(37, 2, '222', '2222', 'public', '2025-05-09 12:33:52'),
	(38, 2, '222', '2222', 'public', '2025-05-09 12:35:50'),
	(39, 2, '222', '2222', 'public', '2025-05-09 12:36:55'),
	(40, 2, '1234', '1234', 'public', '2025-05-09 12:41:02'),
	(41, 2, '1234', '1234', 'public', '2025-05-09 12:41:53'),
	(42, 2, '1234', '1234', 'public', '2025-05-09 12:44:36'),
	(43, 2, 'ㅁㅁㅁ', 'ㅁㅁㅁ', 'public', '2025-05-09 12:45:16'),
	(44, 2, 'ㅁㅁㅁ', 'ㅁㅁㅁ', 'public', '2025-05-09 12:54:51'),
	(45, 2, 'qq', 'qq', 'public', '2025-05-09 12:59:22'),
	(46, 2, 'qq', 'qq', 'public', '2025-05-09 12:59:33'),
	(47, 2, 'ㅁ', 'ㅁㅁ', 'public', '2025-05-09 13:01:59'),
	(48, 2, 'ㅁ', 'ㅁㅁ', 'public', '2025-05-09 13:03:45'),
	(49, 2, 'ㅁ', 'ㅁㅁ', 'public', '2025-05-09 13:03:49'),
	(50, 2, '11', '11', 'public', '2025-05-09 13:04:06'),
	(51, 2, 'a', 'a', 'public', '2025-05-09 13:04:47'),
	(52, 2, 'a', 'a', 'public', '2025-05-09 13:07:43'),
	(53, 2, 'a', 'a', 'public', '2025-05-09 13:12:03'),
	(54, 2, 'ㅁㅁ', 'ㅁㅁ', 'public', '2025-05-09 15:10:11'),
	(55, 2, 'ds', 'dfsfsfsdf', 'public', '2025-05-09 18:14:29'),
	(58, 9, '11', '111', 'public', '2025-05-12 13:00:06'),
	(59, 9, '11', '111', 'public', '2025-05-12 13:01:25'),
	(61, 9, 'ㅅㄷㄴㅅ', 'ㅅㄷㄴㅅ', 'public', '2025-05-12 16:04:42'),
	(62, 9, '11', '11', 'public', '2025-05-13 12:01:00'),
	(63, 9, 'ㅈㅈ', 'ㅈㅈ', 'public', '2025-05-13 12:03:25'),
	(64, 9, 'ㅎㅇ', 'ㅎㅇ', 'public', '2025-05-15 16:46:50');

-- 테이블 sample1.student 구조 내보내기
CREATE TABLE IF NOT EXISTS `student` (
  `stu_no` char(8) NOT NULL,
  `stu_name` varchar(12) DEFAULT NULL,
  `stu_dept` varchar(20) DEFAULT NULL,
  `stu_grade` int DEFAULT NULL,
  `stu_class` char(1) DEFAULT NULL,
  `stu_gender` char(1) DEFAULT NULL,
  `stu_height` int DEFAULT NULL,
  `stu_weight` int DEFAULT NULL,
  PRIMARY KEY (`stu_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.student:~10 rows (대략적) 내보내기
INSERT INTO `student` (`stu_no`, `stu_name`, `stu_dept`, `stu_grade`, `stu_class`, `stu_gender`, `stu_height`, `stu_weight`) VALUES
	('20131001', '김종헌', '컴퓨터정보', 3, 'C', 'M', NULL, 72),
	('20131025', '옥성우', '컴퓨터정보', 3, 'A', 'F', 172, 63),
	('20132003', '박희철', '전기전자', 3, 'B', 'M', NULL, 63),
	('20141007', '진현무', '컴퓨터정보', 2, 'A', 'M', 174, 64),
	('20142021', '심수정', '전기전자', 2, 'A', 'F', 168, 45),
	('20143054', '유가인', '기계', 2, 'C', 'F', 154, 47),
	('20151062', '김인중', '컴퓨터정보', 1, 'B', 'M', 166, 67),
	('20152088', '조민우', '전기전자', 1, 'C', 'M', 188, 90),
	('20153075', '옥한빛', '기계', 1, 'C', 'M', 177, 80),
	('20153088', '이태연', '기계', 1, 'C', 'F', 162, 50);

-- 테이블 sample1.tbl_board 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_board` (
  `boardNo` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `contents` text NOT NULL,
  `userId` varchar(50) NOT NULL,
  `cnt` int DEFAULT '0',
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`boardNo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_board:~12 rows (대략적) 내보내기
INSERT INTO `tbl_board` (`boardNo`, `title`, `contents`, `userId`, `cnt`, `cdatetime`, `udatetime`) VALUES
	(1, '오늘의 기분은 어떨까요?111111', '오늘은 날씨도 맑uuu고 기분이 좋아요! 이런 날은 밖에 나가서 기분 전환을 해보는 것도 좋겠죠?', 'user001', 41, '2025-04-01 08:00:00', '2025-04-24 17:02:32'),
	(2, '어제 본 영화 너무 재밌었어요!', '어제 영화관에서 본 영화가 정말 재밌었어요. 다들 보셨나요? 추천합니다.', 'user002', 30, '2025-04-02 09:30:00', '2025-04-24 16:43:54'),
	(3, '우리는 왜 이렇게 바쁠까요?', '요즘 바쁜 일상 속에서 여유를 찾는 게 점점 더 어려워지는 것 같아요. 여러분은 어떻게 여유를 찾고 계신가요?', 'user003', 6, '2025-04-03 11:15:00', '2025-04-24 16:35:11'),
	(4, '하루를 마무리하며', '오늘 하루가 어떻게 지나갔는지 한번 되돌아보며, 내일은 더 좋은 하루가 되기를 바래봅니다.', 'user004', 15, '2025-04-04 13:45:00', '2025-04-04 13:45:00'),
	(5, '새로운 시작, 새로운 도전', '새로운 프로젝트를 시작했습니다! 이렇게 시작하는 게 설렙니다. 실패를 두려워하지 말자고 마음먹고 도전해보려 합니다.', 'user001', 10, '2025-04-05 14:00:00', '2025-04-24 16:30:21'),
	(6, '주말에는 무엇을 할까요?', '주말에는 모두 무엇을 할 예정인가요? 저는 집에서 휴식을 취하며 영화를 보고 싶어요. 다들 어떻게 보내세요?', 'user002', 12, '2025-04-06 10:10:00', '2025-04-06 10:10:00'),
	(7, '오늘의 책 한 권', '오늘 읽은 책이 정말 인상 깊었어요. 특히 그 부분이 마음에 와 닿았습니다. 여러분도 한 번 읽어보세요!', 'user003', 20, '2025-04-07 11:45:00', '2025-04-07 11:45:00'),
	(8, '추억 속 여행', '몇 년 전에 갔던 여행지가 떠오릅니다. 그때의 즐거운 순간들이 아직도 선명하게 기억에 남아요.', 'user004', 30, '2025-04-08 15:20:00', '2025-04-08 15:20:00'),
	(9, '디지털 시대의 장단점', '디지털 기술이 발달하면서 우리의 삶이 많이 변화했어요. 그러나 그만큼 불편함도 따르죠. 이 변화가 과연 좋은 것일까요?', 'user001', 18, '2025-04-09 09:30:00', '2025-04-09 09:30:00'),
	(10, '새로운 취미를 시작하다', '최근에 새로운 취미를 시작했어요. 정말 재밌고 시간이 빠르게 지나가네요. 여러분도 새로 시작한 취미가 있나요?', 'user002', 22, '2025-04-10 10:00:00', '2025-04-10 10:00:00'),
	(11, '인생의 작은 변화', '작은 변화가 인생을 크게 바꿀 수 있다는 말을 요즘 실감하고 있어요. 여러분도 그런 순간을 경험해보셨나요?', 'user003', 18, '2025-04-11 16:00:00', '2025-04-24 17:02:29'),
	(12, '어린 시절의 추억', '어린 시절의 추억이 떠오릅니다. 그때는 아무 걱정 없이 뛰어놀았던 기억들이 아직도 생생하네요.', 'user004', 22, '2025-04-12 12:10:00', '2025-04-24 16:56:42');

-- 테이블 sample1.tbl_feed 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_feed` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(100) DEFAULT NULL,
  `title` varchar(50) DEFAULT NULL,
  `content` text,
  `cdatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_feed:~12 rows (대략적) 내보내기
INSERT INTO `tbl_feed` (`id`, `userId`, `title`, `content`, `cdatetime`) VALUES
	(1, 'test1', NULL, '오늘 날씨가 정말 좋네요!', '2024-10-20 00:30:00'),
	(2, 'test2', NULL, '새로운 프로젝트를 시작했어요. 열심히 해야겠어요!', '2024-10-20 01:15:00'),
	(3, 'test3', NULL, '맛있는 커피 한 잔과 함께 여유로운 아침을 보내고 있어요.', '2024-10-20 02:00:00'),
	(4, 'test1', NULL, '주말엔 산책이 최고인 것 같아요!', '2024-10-20 04:45:00'),
	(5, 'test2', NULL, '친구들과 맛있는 저녁을 먹었어요. 정말 즐거운 시간이었어요.', '2024-10-19 09:30:00'),
	(6, 'test3', NULL, '책을 읽다 보면 시간 가는 줄 몰라요.', '2024-10-18 05:25:00'),
	(7, 'test1', NULL, '오늘은 운동을 열심히 했어요. 뿌듯하네요!', '2024-10-17 11:00:00'),
	(8, 'test1', NULL, '드디어 휴가! 이번엔 멀리 여행을 갈 거예요.', '2024-10-16 00:50:00'),
	(9, 'test2', NULL, '오랜만에 친구를 만났어요. 정말 반가웠어요!', '2024-10-15 08:00:00'),
	(10, 'test@test.com', '1', '1', '2025-05-02 03:10:14'),
	(11, 'test@test.com', '1', '1', '2025-05-02 03:10:31'),
	(12, 'test@test.com', '1', '1', '2025-05-02 03:38:13');

-- 테이블 sample1.tbl_feed_img 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_feed_img` (
  `imgNo` int NOT NULL AUTO_INCREMENT,
  `feedId` int NOT NULL,
  `imgName` varchar(255) NOT NULL,
  `imgPath` varchar(500) NOT NULL,
  PRIMARY KEY (`imgNo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_feed_img:~0 rows (대략적) 내보내기

-- 테이블 sample1.tbl_member 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_member` (
  `email` varchar(255) NOT NULL,
  `pwd` varchar(255) NOT NULL,
  `userName` varchar(100) NOT NULL,
  `addr` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `profileImg` varchar(255) DEFAULT NULL,
  `cdatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `udatetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `intro` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_member:~3 rows (대략적) 내보내기
INSERT INTO `tbl_member` (`email`, `pwd`, `userName`, `addr`, `phone`, `birth`, `profileImg`, `cdatetime`, `udatetime`, `intro`) VALUES
	('test@test.com', '$2b$12$rHpM42uTbjuVv1xHi0ZnyeuIbSo6lyvR4SG2WvW0q22UUCCEtrPX6', '홍길동', '인천', '1234', '2025-05-01', 'uploads/1746087315965-1.PNG', '2025-05-01 03:17:20', '2025-05-01 08:15:15', '안녕하세요! SNS를 통해 친구들과 소통하고 있습니다. 사진과 일상을 공유하는 것을 좋아해요.'),
	('test1@test.com', '$2b$12$92mfQ0G6Le8BjRLqWh6YkuLGzONHAxVkUix.S9R963rNuwatSSexO', '김철수', '부천', '12345', '2025-05-01', NULL, '2025-05-01 03:17:39', '2025-05-01 05:51:59', '안녕하세요! SNS를 통해 친구들과 소통하고 있습니다. 사진과 일상을 공유하는 것을 좋아해요.'),
	('test2@test.com', '123456', '김영희', '서울', '123456', '2025-05-01', NULL, '2025-05-01 03:17:53', '2025-05-01 03:28:28', '안녕하세요! SNS를 통해 친구들과 소통하고 있습니다. 사진과 일상을 공유하는 것을 좋아해요.');

-- 테이블 sample1.tbl_product 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_product` (
  `productId` int NOT NULL AUTO_INCREMENT,
  `productName` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,0) NOT NULL,
  `stock` int DEFAULT '0',
  `category` varchar(50) DEFAULT NULL,
  `isAvailable` varchar(1) DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`productId`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_product:~29 rows (대략적) 내보내기
INSERT INTO `tbl_product` (`productId`, `productName`, `description`, `price`, `stock`, `category`, `isAvailable`, `cdatetime`, `udatetime`) VALUES
	(1, '무선 이어폰', '고음질 블루투스 무선 이어폰', 79000, 120, '전자기기', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(2, '남성 반팔티', '여름용 면 반팔티셔츠', 19900, 50, '의류', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(3, '게이밍 마우스', 'RGB 조명이 있는 고성능 마우스', 45000, 80, '전자기기', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(4, '핸드크림', '보습력이 뛰어난 핸드크림', 8500, 200, '생활용품', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(5, '여성 청바지', '스트레치 데님 청바지', 35900, 35, '의류', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(6, '휴대폰 케이스', '아이폰 14 전용 실리콘 케이스', 12000, 75, '전자기기', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(7, 'LED 스탠드', '조도 조절 가능한 LED 책상용 스탠드', 33000, 60, '생활용품', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(8, '노트북 쿨링패드', '노트북 발열 방지를 위한 쿨링패드', 27000, 40, '전자기기', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(9, '스포츠 양말', '운동용 흡한속건 기능성 양말', 5900, 300, '의류', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(10, '텀블러 500ml', '보온보냉 가능한 스테인리스 텀블러', 21000, 90, '생활용품', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(11, 'USB-C 충전기', '65W 고속충전기', 39000, 100, '전자기기', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(12, '면 화장솜', '100매입 무형광 화장솜', 3000, 180, '생활용품', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(13, '여성 니트', '겨울용 따뜻한 브이넥 니트', 49900, 22, '의류', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(14, '샤워볼', '거품 잘 나는 목욕용 샤워볼', 2500, 150, '생활용품', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(15, '블루투스 스피커', '휴대용 미니 블루투스 스피커', 42000, 45, '전자기기', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(16, '에코백', '캔버스 소재 친환경 에코백', 17900, 110, '의류', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(17, '헤어드라이기', '1200W 강풍모드 드라이기', 32000, 55, '생활용품', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(18, '휴대용 선풍기', 'USB 충전식 미니 선풍기', 15000, 130, '전자기기', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(19, '기모 레깅스', '겨울용 따뜻한 기모 레깅스', 22900, 38, '의류', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(20, '수세미 세트', '3개입 친환경 수세미 세트', 4900, 210, '생활용품', 'Y', '2025-04-22 10:38:05', '2025-04-22 10:38:05'),
	(24, '핸드크림', '보습력이 뛰어난 핸드크림', 8500, 200, '생활용품', 'Y', '2025-04-22 15:47:05', '2025-04-22 15:47:05'),
	(25, 'test', 'test', 1, 1, 'test', 'Y', '2025-04-22 15:49:29', '2025-04-22 15:49:29'),
	(26, 'test1', 'test1', 1, 1, 'test1', 'Y', '2025-04-22 15:51:46', '2025-04-22 15:51:46'),
	(27, '1', '1', 1, 1, '1', 'Y', '2025-04-22 15:52:57', '2025-04-22 15:52:57'),
	(28, '1', '1', 1, 1, '1', 'Y', '2025-04-23 17:01:59', '2025-04-23 17:01:59'),
	(29, '1', '1', 1, 1, '1', 'Y', '2025-04-23 17:01:59', '2025-04-23 17:01:59'),
	(30, '2', '2', 2, 2, '2', 'Y', '2025-04-23 17:04:21', '2025-04-23 17:04:21'),
	(32, '3', '3', 3, 3, '3', 'Y', '2025-04-23 17:48:43', '2025-04-23 17:48:43'),
	(34, '4', '4', 4, 4, '4', 'Y', '2025-04-23 17:50:56', '2025-04-23 17:50:56');

-- 테이블 sample1.tbl_product_file 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_product_file` (
  `fileNo` int NOT NULL AUTO_INCREMENT,
  `productId` int DEFAULT NULL,
  `fileName` varchar(255) DEFAULT NULL,
  `filePath` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`fileNo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_product_file:~4 rows (대략적) 내보내기
INSERT INTO `tbl_product_file` (`fileNo`, `productId`, `fileName`, `filePath`) VALUES
	(1, 30, '3.jpg', 'uploads\\87ab89b5490075751d1d646ea5c18d58'),
	(2, 31, '3.jpg', 'uploads\\b83bf8dac0e5824fa059a12e0566d6e9'),
	(3, 32, '1.jfif', 'uploads\\2fdcb82a4b65e0b258dd74e4f8d2970c'),
	(4, 33, '1.jfif', 'uploads\\d6e0cd5df73c42ea9b2d9d7b4e8aacfa'),
	(5, 34, '4.PNG', 'uploads\\d731179c9c248efde16887a71f1e5c94');

-- 테이블 sample1.tbl_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_user` (
  `userId` varchar(50) NOT NULL,
  `pwd` varchar(100) NOT NULL,
  `userName` varchar(50) NOT NULL,
  `addr` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `cdatetime` datetime DEFAULT CURRENT_TIMESTAMP,
  `udatetime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'C',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.tbl_user:~13 rows (대략적) 내보내기
INSERT INTO `tbl_user` (`userId`, `pwd`, `userName`, `addr`, `phone`, `cdatetime`, `udatetime`, `status`) VALUES
	('1', '1', '1', '1', '1', '2025-04-23 15:36:37', '2025-04-23 15:36:37', 'C'),
	('2', '2', '2', '2', '2', '2025-04-23 15:44:55', '2025-04-23 15:44:55', 'C'),
	('3', '$2b$10$UBqlb1973CAP7o9WJxYd4OMccuWw8E6FwQdCEULSwB0dsV8v1k7JS', '3', '3', '3', '2025-04-23 15:45:21', '2025-04-23 17:56:13', 'A'),
	('user001', 'pwd1', '홍길동', '서울', '010-1111-2222', '2025-04-23 09:36:56', '2025-04-23 12:45:15', 'A'),
	('user002', 'pwd2', '김철수', '인천', '010-2233-4455', '2025-04-23 09:36:56', '2025-04-23 12:45:24', 'C'),
	('user003', 'pwd3', '이영희', '대전', '010-3344-5566', '2025-04-23 09:36:56', '2025-04-23 12:45:27', 'C'),
	('user004', 'pwd4', '박지민', '광주', '010-4455-6677', '2025-04-23 09:36:56', '2025-04-23 12:45:30', 'C'),
	('user005', 'pwd5', '최민수', '서울', '010-5566-7788', '2025-04-23 09:36:56', '2025-04-23 12:45:33', 'C'),
	('user006', 'pwd6', '정수진', '부산', '010-6677-8899', '2025-04-23 09:36:56', '2025-04-23 12:45:35', 'C'),
	('user007', 'pwd7', '김하늘', '인천', '010-7788-9900', '2025-04-23 09:36:56', '2025-04-23 12:45:36', 'C'),
	('user008', 'pwd8', '이상훈', '울산', '010-8899-1000', '2025-04-23 09:36:56', '2025-04-23 12:45:38', 'C'),
	('user009', 'pwd9', '박세영', '대구', '010-9900-1111', '2025-04-23 09:36:56', '2025-04-23 12:45:40', 'C'),
	('user010', 'pwd10', '정예린', '경기', '010-1001-1222', '2025-04-23 09:36:56', '2025-04-23 12:45:41', 'C');

-- 테이블 sample1.users 구조 내보내기
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nickname` varchar(50) DEFAULT NULL,
  `profile_img` varchar(255) DEFAULT NULL,
  `intro` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.users:~5 rows (대략적) 내보내기
INSERT INTO `users` (`id`, `username`, `password`, `email`, `nickname`, `profile_img`, `intro`, `created_at`) VALUES
	(1, 'test', '$2b$10$.sGjQmVgIGUN77xkibLybu.5E88Beyc9780ogOYTOdRxgABOaQ4rm', 'test@com', 'test', 'uploads\\1746608576117-1.PNG', 'test', '2025-05-07 18:02:56'),
	(2, '1234', '$2b$10$h9aZqdmcZbm89W5gGO662eq2WJnyAlLyKQPsX3qBfStHcVhwazT0K', '1234@com', '1234', 'uploads\\1746665526664-2.PNG', '1234', '2025-05-08 09:52:06'),
	(4, '1', '$2b$10$z7UXu8zgLUpYllhuHFbn4uXfC7F7MqYzyZLAyOlhabVNLU3a.JNJS', '1@com', '1', 'uploads\\1746665819936-1.PNG', '1234', '2025-05-08 09:56:59'),
	(8, 'test1', '$2b$10$gfZrTU6Ltn7Dh1AvMI9M.OuuiRydgx4v5RMUFcR7TquyraWPZ.LMC', 'test1@com', 'test', 'uploads\\1746690436246-3.jpg', 'qq', '2025-05-08 16:47:16'),
	(9, '22', '$2b$10$hWKj8GXNxA2JGjeGWOjnIu8t79n/Azf2lUjO8WCdQL4UUNfEZFTNG', '22@com', '22', 'uploads\\1746756284523-3.jpg', '', '2025-05-09 11:04:44'),
	(10, '55', '$2b$10$Uc6kHdR5Zappfz5TnjMvru7VxuNmw3glmx3OqJOZU7gd.wpFHNZ5m', '55@com', '55', 'uploads\\1747274923057-4.PNG', '', '2025-05-15 11:08:43');

-- 테이블 sample1.visit_logs 구조 내보내기
CREATE TABLE IF NOT EXISTS `visit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `homepage_id` varchar(50) DEFAULT NULL,
  `visitor_ip` varchar(45) DEFAULT NULL,
  `visit_date` date NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `visitor_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 sample1.visit_logs:~139 rows (대략적) 내보내기
INSERT INTO `visit_logs` (`id`, `homepage_id`, `visitor_ip`, `visit_date`, `created_at`, `visitor_id`) VALUES
	(50, '22', NULL, '2025-05-14', '2025-05-14 16:18:03', '9'),
	(51, '1', NULL, '2025-05-14', '2025-05-14 16:18:32', '4'),
	(52, 'test', NULL, '2025-05-14', '2025-05-14 16:55:02', '8'),
	(61, '22', NULL, '2025-05-14', '2025-05-14 17:04:52', '9'),
	(62, '22', NULL, '2025-05-14', '2025-05-14 17:04:52', '9'),
	(63, '22', NULL, '2025-05-14', '2025-05-14 17:04:58', '9'),
	(64, '22', NULL, '2025-05-14', '2025-05-14 17:04:58', '9'),
	(65, '22', NULL, '2025-05-14', '2025-05-14 17:05:54', '9'),
	(66, '22', NULL, '2025-05-14', '2025-05-14 17:05:54', '9'),
	(67, '22', NULL, '2025-05-14', '2025-05-14 17:06:09', '9'),
	(68, '22', NULL, '2025-05-14', '2025-05-14 17:06:09', '9'),
	(69, '1', NULL, '2025-05-14', '2025-05-14 17:06:28', '4'),
	(70, '1', NULL, '2025-05-14', '2025-05-14 17:06:28', '4'),
	(71, '1', NULL, '2025-05-14', '2025-05-14 17:08:34', '4'),
	(72, '1', NULL, '2025-05-14', '2025-05-14 17:08:34', '4'),
	(73, '1', NULL, '2025-05-14', '2025-05-14 17:08:38', '4'),
	(74, '1', NULL, '2025-05-14', '2025-05-14 17:08:38', '4'),
	(75, '1', NULL, '2025-05-14', '2025-05-14 17:12:55', '4'),
	(76, '1', NULL, '2025-05-14', '2025-05-14 17:12:55', '4'),
	(77, '1', NULL, '2025-05-14', '2025-05-14 17:13:00', '4'),
	(78, '1', NULL, '2025-05-14', '2025-05-14 17:13:00', '4'),
	(79, '1', NULL, '2025-05-14', '2025-05-14 17:13:03', '4'),
	(80, '1', NULL, '2025-05-14', '2025-05-14 17:13:03', '4'),
	(81, '1', NULL, '2025-05-14', '2025-05-14 17:13:06', '4'),
	(82, '1', NULL, '2025-05-14', '2025-05-14 17:13:06', '4'),
	(83, '1', NULL, '2025-05-14', '2025-05-14 17:13:11', '4'),
	(84, '1', NULL, '2025-05-14', '2025-05-14 17:13:11', '4'),
	(85, '1', NULL, '2025-05-14', '2025-05-14 17:18:40', '4'),
	(86, '1', NULL, '2025-05-14', '2025-05-14 17:18:40', '4'),
	(87, '1', NULL, '2025-05-14', '2025-05-14 17:18:44', '4'),
	(88, '1', NULL, '2025-05-14', '2025-05-14 17:18:44', '4'),
	(89, '1', NULL, '2025-05-14', '2025-05-14 17:30:05', '4'),
	(90, '1', NULL, '2025-05-14', '2025-05-14 17:30:11', '4'),
	(91, '1', NULL, '2025-05-14', '2025-05-14 17:30:11', '4'),
	(92, '1', NULL, '2025-05-14', '2025-05-14 17:30:15', '4'),
	(93, '1', NULL, '2025-05-14', '2025-05-14 17:30:15', '4'),
	(94, '1', NULL, '2025-05-14', '2025-05-14 17:31:43', '4'),
	(95, '1', NULL, '2025-05-14', '2025-05-14 17:31:43', '4'),
	(96, '1', NULL, '2025-05-14', '2025-05-14 17:32:05', '4'),
	(97, '1', NULL, '2025-05-14', '2025-05-14 17:32:05', '4'),
	(98, '1', NULL, '2025-05-14', '2025-05-14 17:32:08', '4'),
	(99, '1', NULL, '2025-05-14', '2025-05-14 17:32:08', '4'),
	(100, '1', NULL, '2025-05-14', '2025-05-14 17:34:29', '4'),
	(101, '1', NULL, '2025-05-14', '2025-05-14 17:34:33', '4'),
	(102, '1', NULL, '2025-05-14', '2025-05-14 17:34:49', '4'),
	(103, '1', NULL, '2025-05-14', '2025-05-14 17:35:35', '4'),
	(104, '1', NULL, '2025-05-14', '2025-05-14 17:35:40', '4'),
	(105, '1', NULL, '2025-05-14', '2025-05-14 17:35:46', '4'),
	(106, '22', NULL, '2025-05-14', '2025-05-14 17:35:55', '9'),
	(107, '22', NULL, '2025-05-14', '2025-05-14 17:36:01', '9'),
	(108, '22', NULL, '2025-05-14', '2025-05-14 17:36:09', '9'),
	(109, 'test', NULL, '2025-05-14', '2025-05-14 17:36:25', '8'),
	(110, '1234', NULL, '2025-05-14', '2025-05-14 17:38:13', '8'),
	(111, '1234', NULL, '2025-05-14', '2025-05-14 17:38:13', '8'),
	(112, '1234', NULL, '2025-05-14', '2025-05-14 17:38:31', '8'),
	(113, '1234', NULL, '2025-05-14', '2025-05-14 17:38:32', '8'),
	(114, '1234', NULL, '2025-05-14', '2025-05-14 17:38:57', '8'),
	(115, '1234', NULL, '2025-05-14', '2025-05-14 17:38:57', '8'),
	(116, '1234', NULL, '2025-05-14', '2025-05-14 17:40:08', '8'),
	(117, '1234', NULL, '2025-05-14', '2025-05-14 17:40:08', '8'),
	(118, '1234', NULL, '2025-05-14', '2025-05-14 17:42:04', '8'),
	(119, '1234', NULL, '2025-05-14', '2025-05-14 17:42:04', '8'),
	(120, '1234', NULL, '2025-05-14', '2025-05-14 17:42:50', '8'),
	(121, '1234', NULL, '2025-05-14', '2025-05-14 17:42:50', '8'),
	(122, '1234', NULL, '2025-05-14', '2025-05-14 17:43:08', '8'),
	(123, '1234', NULL, '2025-05-14', '2025-05-14 17:43:08', '8'),
	(124, '1234', NULL, '2025-05-14', '2025-05-14 17:43:31', '8'),
	(125, '1234', NULL, '2025-05-14', '2025-05-14 17:43:31', '8'),
	(126, '1234', NULL, '2025-05-14', '2025-05-14 17:45:13', '8'),
	(127, '1234', NULL, '2025-05-14', '2025-05-14 17:45:13', '8'),
	(128, '1234', NULL, '2025-05-14', '2025-05-14 17:49:21', '9'),
	(129, '1234', NULL, '2025-05-14', '2025-05-14 17:49:21', '9'),
	(130, '1234', NULL, '2025-05-14', '2025-05-14 17:50:45', '9'),
	(131, '1234', NULL, '2025-05-14', '2025-05-14 17:50:46', '9'),
	(132, '1234', NULL, '2025-05-14', '2025-05-14 17:51:08', '9'),
	(133, '1234', NULL, '2025-05-14', '2025-05-14 17:51:08', '9'),
	(134, '1234', NULL, '2025-05-14', '2025-05-14 17:54:34', '9'),
	(135, '1234', NULL, '2025-05-14', '2025-05-14 17:54:34', '9'),
	(136, '1234', NULL, '2025-05-14', '2025-05-14 17:59:49', '9'),
	(137, '1234', NULL, '2025-05-14', '2025-05-14 17:59:49', '9'),
	(138, '1234', NULL, '2025-05-14', '2025-05-14 18:00:20', '9'),
	(139, '1234', NULL, '2025-05-14', '2025-05-14 18:00:20', '9'),
	(140, '1234', NULL, '2025-05-14', '2025-05-14 18:00:42', '9'),
	(141, '1234', NULL, '2025-05-14', '2025-05-14 18:00:42', '9'),
	(142, '1234', NULL, '2025-05-14', '2025-05-14 18:02:15', '9'),
	(143, '1234', NULL, '2025-05-14', '2025-05-14 18:02:15', '9'),
	(144, '1234', NULL, '2025-05-14', '2025-05-14 18:04:22', '9'),
	(145, '1234', NULL, '2025-05-14', '2025-05-14 18:04:22', '9'),
	(146, '1234', NULL, '2025-05-14', '2025-05-14 18:05:08', '9'),
	(147, '1234', NULL, '2025-05-14', '2025-05-14 18:05:08', '9'),
	(148, '1234', NULL, '2025-05-14', '2025-05-14 18:09:36', '9'),
	(149, '1234', NULL, '2025-05-14', '2025-05-14 18:09:36', '9'),
	(150, '1234', NULL, '2025-05-14', '2025-05-14 18:09:40', '9'),
	(151, '1234', NULL, '2025-05-14', '2025-05-14 18:09:41', '9'),
	(152, '1234', NULL, '2025-05-14', '2025-05-14 18:10:25', '9'),
	(153, '1234', NULL, '2025-05-14', '2025-05-14 18:10:30', '9'),
	(154, '1234', NULL, '2025-05-14', '2025-05-14 18:10:30', '9'),
	(155, '1234', NULL, '2025-05-14', '2025-05-14 18:12:12', '9'),
	(156, '1234', NULL, '2025-05-14', '2025-05-14 18:12:12', '9'),
	(157, '1234', NULL, '2025-05-14', '2025-05-14 18:12:31', '9'),
	(158, '1234', NULL, '2025-05-14', '2025-05-14 18:12:35', '9'),
	(159, '1234', NULL, '2025-05-14', '2025-05-14 18:12:35', '9'),
	(160, '1234', NULL, '2025-05-14', '2025-05-14 18:13:32', '9'),
	(161, '1234', NULL, '2025-05-14', '2025-05-14 18:14:12', '9'),
	(162, '1234', NULL, '2025-05-14', '2025-05-14 18:14:12', '9'),
	(163, 'test', NULL, '2025-05-15', '2025-05-15 09:50:56', '8'),
	(164, 'test', NULL, '2025-05-15', '2025-05-15 09:51:14', '8'),
	(165, '22', NULL, '2025-05-15', '2025-05-15 09:51:31', '9'),
	(166, '22', NULL, '2025-05-15', '2025-05-15 09:59:36', '9'),
	(167, '22', NULL, '2025-05-15', '2025-05-15 09:59:46', '9'),
	(168, '22', NULL, '2025-05-15', '2025-05-15 10:00:03', '9'),
	(169, '22', NULL, '2025-05-15', '2025-05-15 10:00:34', '9'),
	(170, '22', NULL, '2025-05-15', '2025-05-15 10:00:38', '9'),
	(171, '22', NULL, '2025-05-15', '2025-05-15 10:06:26', '9'),
	(172, '1', NULL, '2025-05-15', '2025-05-15 10:06:40', '4'),
	(173, '1', NULL, '2025-05-15', '2025-05-15 10:08:29', '4'),
	(174, '1', NULL, '2025-05-15', '2025-05-15 10:09:30', '4'),
	(175, '1', NULL, '2025-05-15', '2025-05-15 10:14:43', '4'),
	(176, '1', NULL, '2025-05-15', '2025-05-15 10:15:22', '4'),
	(177, 'test', NULL, '2025-05-15', '2025-05-15 10:15:37', '8'),
	(178, 'test', NULL, '2025-05-15', '2025-05-15 10:16:54', '8'),
	(179, '2', NULL, '2025-05-15', '2025-05-15 10:18:02', '8'),
	(180, '2', NULL, '2025-05-15', '2025-05-15 10:18:02', '8'),
	(181, 'test', NULL, '2025-05-15', '2025-05-15 10:18:03', '8'),
	(182, '2', NULL, '2025-05-15', '2025-05-15 10:18:21', '9'),
	(183, '2', NULL, '2025-05-15', '2025-05-15 10:18:21', '9'),
	(184, '22', NULL, '2025-05-15', '2025-05-15 10:18:21', '9'),
	(185, '22', NULL, '2025-05-15', '2025-05-15 10:19:35', '9'),
	(186, '22', NULL, '2025-05-15', '2025-05-15 10:34:01', '9'),
	(187, '2', NULL, '2025-05-15', '2025-05-15 10:34:11', '4'),
	(188, '2', NULL, '2025-05-15', '2025-05-15 10:34:11', '4'),
	(189, '1', NULL, '2025-05-15', '2025-05-15 10:34:11', '4'),
	(190, '1', NULL, '2025-05-15', '2025-05-15 10:37:30', '4'),
	(191, '22', NULL, '2025-05-15', '2025-05-15 10:37:41', '9'),
	(192, '2', NULL, '2025-05-15', '2025-05-15 11:08:51', '10'),
	(193, '9', NULL, '2025-05-15', '2025-05-15 11:18:22', '2'),
	(194, '2', NULL, '2025-05-15', '2025-05-15 11:36:01', '2'),
	(195, '9', NULL, '2025-05-15', '2025-05-15 12:37:19', '9'),
	(196, '9', NULL, '2025-05-15', '2025-05-15 12:37:19', '9');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
