CREATE DATABASE  IF NOT EXISTS `goldorak_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `goldorak_db`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: goldorak_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `personnages`
--

DROP TABLE IF EXISTS `personnages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `personnages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_fr` varchar(100) NOT NULL,
  `nom_jp` varchar(100) DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `faction` varchar(50) DEFAULT NULL,
  `age` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `idx_personnages_nom` (`nom_fr`),
  KEY `idx_personnages_faction` (`faction`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personnages`
--

LOCK TABLES `personnages` WRITE;
/*!40000 ALTER TABLE `personnages` DISABLE KEYS */;
INSERT INTO `personnages` VALUES (1,'Actarus','Daisuke Umon','Pilote de Goldorak','Terre',20,'Prince de la planète Euphor, exilé sur Terre après la destruction de son monde. Sous l\'identité d\'Actarus, il pilote Goldorak pour protéger la Terre contre l\'empire de Véga. Jeune homme courageux, noble et déterminé, il possède des pouvoirs télépathiques limités et une force physique exceptionnelle.'),(2,'Vicky','Hikaru Makiba','Fiancée d\'Actarus','Terre',18,'Fille du professeur Procyon et fiancée d\'Actarus. Jeune femme douce, courageuse et déterminée qui apporte un soutien émotionnel crucial à Actarus. Malgré les dangers, elle reste toujours à ses côtés et participe activement à la résistance contre les forces de Véga.'),(3,'Méphisto','Koji Kabuto','Pilote du Machiner','Terre',25,'Pilote du robot Machiner Garland et scientifique brillant. Ami proche d\'Actarus, il apporte un soutien technique et stratégique essentiel dans les combats contre les Vegan. Calme, réfléchi et extrêmement intelligent, il est souvent le cerveau derrière les opérations.'),(4,'Duke Fleed','Prince Duke Fleed','Pilote du Sabre Noir','Terre',22,'Prince de la planète Fleed et frère cadet d\'Actarus. Pilote du robot Sabre Noir, il apparaît d\'abord comme un rival de Goldorak avant de devenir un allié précieux. Jeune homme fier, impulsif mais au cœur noble, en quête de reconnaissance.'),(5,'Prof. Procyon','Genzo Umon','Scientifique','Terre',60,'Scientifique de génie, père de Vicky. C\'est lui qui a découvert Goldorak caché sur Terre et l\'a restauré. Conseiller scientifique et stratégique de l\'équipe, il développe les technologies et les stratégies pour contrer les attaques Vegan.'),(6,'Minos','Taro','Ami/Mécanicien','Terre',30,'Mécanicien de talent et ami fidèle d\'Actarus. Il s\'occupe de l\'entretien du Spacer, de Goldorak et des autres équipements. Personnage chaleureux, dévoué et toujours prêt à aider, il apporte une touche d\'humour et d\'humanité au groupe.'),(7,'Roi Vega','King Vega','Antagoniste principal','Véga',97,'Souverain suprême de l\'empire de Véga, également appelé Grand Marshal. Chef tyrannique, impitoyable et obsédé par la conquête de l\'univers. Il dirige ses armées depuis la Planète Fleur avec une main de fer, sans compassion pour ses ennemis ni son propre peuple.'),(8,'Grand Marshal / Roi Véga','ベガ大王 (Vega Daiō)','Chef suprême de l\'empire de Véga','Véga',99,'Dirigeant suprême de l\'empire de Véga. Antagoniste principal de la série, il cherche à conquérir la Terre pour ses ressources. Commandant depuis son vaisseau-mère, il envoie une armée de robots et de monstres pour soumettre la planète bleue.'),(9,'Prince de Rigel','リゲル司令 (Rigeru Shirei)','Commandant militaire','Véga',99,'Commandant militaire de haut rang dans les forces de Véga. Stratège impitoyable et efficace, il mène personnellement de nombreuses attaques contre la Terre. Loyal envers le Roi Vega, il n\'hésite pas à sacrifier ses troupes pour la victoire.'),(10,'Hydargos','ヒダル司令 (Hidaru Shirei)','Commandant militaire','Véga',99,'Général des armées Vegan, commandant redoutable et sans pitié. Il dirige de nombreuses offensives contre Goldorak et fait preuve d\'une hargne particulière. Ambitieux et cruel, il cherche à prouver sa valeur pour monter en grade dans la hiérarchie Vegan.'),(11,'Rubina','ルビナ司令 (Rubina Shirei)','Commandant scientifique','Véga',98,'Commandant scientifique de Véga. Spécialiste en technologies avancées et en création de robots de combat. Froid, calculateur et méthodique, il conçoit des armes de plus en plus sophistiquées pour vaincre Goldorak, préférant la ruse à la force brute.'),(12,'Grand Ancêtre','大先輩 (Daisempai)','Esprit maléfique dirigeant','Véga',98,'Esprit maléfique ancestral qui dirige secrètement l\'empire de Véga. Source du pouvoir occulte et de la technologie avancée des Vegan. Entité mystérieuse qui influence les décisions du Roi Vega depuis l\'ombre, cherchant à répandre le chaos dans l\'univers.'),(21,'Grand Stratégor','大司令 (Dai-Shirei)','Commandant suprême des forces Vegan','Véga',NULL,'Commandant en chef basé sur la Planète Fleur'),(22,'Princesse Aphrodia','アフロディア姫 (Afurodia-hime)','Princesse et commandante Vegan','Véga',25,'Princesse de Vega qui finit par trahir son peuple'),(23,'Floga','フロガ (Furoga)','Commandant des forces de Floga','Floga',NULL,'Nouvel ennemi apparu à la fin de la série'),(32,'Général Dargol','ダルゴル将軍 (Darugoru Shōgun)','Général des armées Vegan','Véga',40,'Général important des forces de Vega');
/*!40000 ALTER TABLE `personnages` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-04 11:04:01
