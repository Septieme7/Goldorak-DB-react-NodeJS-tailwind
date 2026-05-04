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
-- Table structure for table `robots`
--

DROP TABLE IF EXISTS `robots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `robots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_fr` varchar(100) NOT NULL,
  `nom_jp` varchar(100) DEFAULT NULL,
  `pilote_id` int DEFAULT NULL,
  `description` text,
  `type_robot` varchar(50) DEFAULT NULL,
  `hauteur` decimal(5,2) DEFAULT NULL,
  `poids` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_robots_pilote` (`pilote_id`),
  KEY `idx_robots_nom` (`nom_fr`),
  CONSTRAINT `robots_ibfk_1` FOREIGN KEY (`pilote_id`) REFERENCES `personnages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `robots`
--

LOCK TABLES `robots` WRITE;
/*!40000 ALTER TABLE `robots` DISABLE KEYS */;
INSERT INTO `robots` VALUES (1,'Goldorak','Grendizer',1,'Robot le plus puissant de l\'univers, venu d\'Euphor','Robot transformable',45.00,550.00),(2,'Sabre Noir','Black Sar',4,'Robot rival de Goldorak, piloté par Duke Fleed','Robot de combat',40.00,500.00),(3,'Machiner','Machine Garland',3,'Robot de soutien rouge, agile et rapide','Robot de soutien',35.00,300.00),(4,'Dragon No.1','ドラゴン１号 (Doragon Ichigō)',8,'Robot dragon rouge, un des premiers envoyés sur Terre','Robot de combat',30.00,400.00),(5,'Gomoras','ゴモラス (Gomorasu)',8,'Robot reptile bipède, modèle standard de Véga','Robot de combat',30.00,400.00),(6,'Gomora S','ゴモラS (Gomora S)',8,'Version spatiale du Gomoras','Robot de combat',30.00,400.00),(7,'Garan','ガラン (Garan)',8,'Robot à l\'apparence d\'insecte géant','Robot de combat',30.00,400.00),(8,'Gedon','ゲドン (Gedon)',8,'Robot massif à la force colossale','Robot de combat',30.00,400.00),(9,'Gorba','ゴルバ (Goruba)',8,'Robot équipé de bras-pinces','Robot de combat',30.00,400.00),(10,'Bazela','バゼラ (Bazera)',8,'Robot équipé d\'une épée et d\'un bouclier','Robot de combat',30.00,400.00),(11,'Gomora H','ゴモラH (Gomora H)',9,'Version personnelle d\'Hydargos du Gomora','Robot de combat',30.00,400.00),(12,'Gadora H','ガドラH (Gadora H)',9,'Version personnelle d\'Hydargos du Gadora','Robot de combat',30.00,400.00),(13,'Guella H','ゲラH (Gera H)',9,'Version personnelle d\'Hydargos du Guella','Robot de combat',30.00,400.00),(14,'Gomora R','ゴモラR (Gomora R)',10,'Version personnelle de Rubina du Gomora','Robot de combat',30.00,400.00),(15,'Gadora R','ガドラR (Gadora R)',10,'Version personnelle de Rubina du Gadora','Robot de combat',30.00,400.00),(16,'Guella R','ゲラR (Gera R)',10,'Version personnelle de Rubina du Guella','Robot de combat',30.00,400.00),(17,'Gadora','ガドラ (Gadora)',8,'Robot à l\'apparence de chauve-souris géante','Robot de combat',30.00,400.00),(18,'Guella','ゲラ (Gera)',8,'Robot amphibie spécialisé','Robot de combat',30.00,400.00),(19,'King Gomora','キングゴモラ (Kingu Gomora)',8,'Version royale du Gomora','Robot de combat',30.00,400.00),(20,'King Gadora','キングガドラ (Kingu Gadora)',8,'Version royale du Gadora','Robot de combat',30.00,400.00),(21,'King Bazela','キングバゼラ (Kingu Bazera)',8,'Version royale du Bazela','Robot de combat',30.00,400.00),(22,'Gandal','ガンダル (Gandaru)',8,'Premier robot géant vegan envoyé sur Terre, tête de cheval','Robot Géant',38.00,420.00),(23,'Bongo','ボンゴ (Bongo)',8,'Robot massif avec un gros cerveau apparent et deux cornes','Robot Géant',42.00,480.00),(24,'Gremade','グレメード (Guremēdo)',8,'Robot agile avec une tête pointue et des armes sur les bras','Robot Géant',36.00,380.00),(25,'Gromadan','グロマダン (Guromadan)',8,'Robot imposant avec une crête et des épaules larges','Robot Géant',40.00,450.00),(26,'Gingulf','ギンガルフ (Gingarufu)',8,'Robot au design inspiré d\'un animal, avec une gueule menaçante','Robot Géant',39.00,430.00),(27,'Granzer','グランザー (Guranzā)',8,'Robot puissant avec un design de démon, des ailes et une lance','Robot Géant',45.00,500.00),(28,'Golgom','ゴルゴム (Gorugomu)',8,'Robot très résistant, ressemblant à un char d\'assaut','Robot Géant',41.00,470.00),(29,'Guromaki','グロマキ (Guromaki)',8,'Robot au corps couvert de pics, capable de les projeter','Robot Géant',37.00,410.00),(30,'Dogmar','ドグマー (Dogumā)',8,'Robot massif avec une tête qui évoque un casque de samouraï','Robot Géant',43.00,490.00),(31,'Gardoll','ガルドル (Garudoru)',8,'Robot à l\'apparence d\'insecte géant','Robot Géant',39.00,440.00),(32,'Zarion','ザリオン (Zarion)',23,'Principal robot de Floga, ennemi apparu à la fin de la série','Robot Géant',44.00,510.00),(33,'Grandoll','グランドル (Gurandoru)',8,'Variante plus puissante du Gardoll','Robot Géant',41.00,460.00),(34,'Grodan','グロダン (Gurodan)',8,'Robot spécialisé dans les attaques sismiques','Robot Géant',38.00,425.00),(35,'DoSmethod','UnDosTres',2,'Le meilleurs et ï C tout.... le soleil brille le matin dans la camargues que faire pour le regarder sans ce faire mal aux yeux , suggestion mettre des lunettee C le  mieux pour cela , faire et defaire des morceaux de code ma passion','Robot transformable',777.00,777.00);
/*!40000 ALTER TABLE `robots` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-04 11:04:00
