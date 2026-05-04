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
-- Table structure for table `monstres`
--

DROP TABLE IF EXISTS `monstres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monstres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_fr` varchar(100) NOT NULL,
  `nom_jp` varchar(100) DEFAULT NULL,
  `episode_id` int DEFAULT NULL,
  `description` text,
  `type_monstre` varchar(50) DEFAULT NULL,
  `taille` decimal(5,2) DEFAULT NULL,
  `puissance` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `episode_id` (`episode_id`),
  KEY `idx_monstres_nom` (`nom_fr`),
  CONSTRAINT `monstres_ibfk_1` FOREIGN KEY (`episode_id`) REFERENCES `episodes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monstres`
--

LOCK TABLES `monstres` WRITE;
/*!40000 ALTER TABLE `monstres` DISABLE KEYS */;
INSERT INTO `monstres` VALUES (5,'Gomoras','ゴモラス (Gomorasu)',NULL,'Premier monstre mécanique envoyé sur Terre','Robot Géant',40.00,'Haute'),(6,'Dragon No.1','ドラゴン１号 (Doragon Ichigō)',NULL,'Robot dragon apparaissant tôt dans la série','Robot Géant',35.00,'Moyenne'),(7,'Gedon','ゲドン (Gedon)',NULL,'Robot massif particulièrement puissant','Monstre',50.00,'Très Haute'),(8,'Gorba','ゴルバ (Goruba)',NULL,'Robot équipé de pinces destructrices','Monstre',45.00,'Haute'),(9,'Gomora S','ゴモラS (Gomora S)',NULL,'Version spatiale du Gomoras (Robot de Véga)','Robot',40.00,'Moyenne'),(10,'Garan','ガラン (Garan)',NULL,'Robot à l\'apparence d\'insecte géant (Robot de Véga)','Robot',36.00,'Moyenne'),(11,'Bazela','バゼラ (Bazera)',NULL,'Robot équipé d\'une épée et d\'un bouclier (Robot de Véga)','Robot',48.00,'Haute'),(12,'Gadora','ガドラ (Gadora)',NULL,'Robot à l\'apparence de chauve-souris géante (Robot de Véga)','Robot',38.00,'Moyenne'),(13,'Guella','ゲラ (Gera)',NULL,'Robot amphibie spécialisé (Robot de Véga)','Robot',42.00,'Moyenne'),(14,'King Gomora','キングゴモラ (Kingu Gomora)',NULL,'Version royale du Gomora (Robot de Véga)','Robot',40.00,'Ultime'),(15,'King Gadora','キングガドラ (Kingu Gadora)',NULL,'Version royale du Gadora (Robot de Véga)','Robot',38.00,'Ultime'),(16,'King Bazela','キングバゼラ (Kingu Bazera)',NULL,'Version royale du Bazela (Robot de Véga)','Robot',48.00,'Ultime'),(17,'Gomora H','ゴモラH (Gomora H)',NULL,'Version personnelle d\'Hydargos du Gomora (Robot de Véga)','Robot',40.00,'Moyenne'),(18,'Gadora H','ガドラH (Gadora H)',NULL,'Version personnelle d\'Hydargos du Gadora (Robot de Véga)','Robot',38.00,'Moyenne'),(19,'Guella H','ゲラH (Gera H)',NULL,'Version personnelle d\'Hydargos du Guella (Robot de Véga)','Robot',42.00,'Moyenne'),(20,'Gomora R','ゴモラR (Gomora R)',NULL,'Version personnelle de Rubina du Gomora (Robot de Véga)','Robot',40.00,'Moyenne'),(21,'Gadora R','ガドラR (Gadora R)',NULL,'Version personnelle de Rubina du Gadora (Robot de Véga)','Robot',38.00,'Moyenne'),(22,'Guella R','ゲラR (Gera R)',NULL,'Version personnelle de Rubina du Guella (Robot de Véga)','Robot',42.00,'Moyenne'),(24,'Véga No.1','ベガ１号 (Vega Ichigō)',NULL,'Vaisseau-mère de Véga - Vaisseau principal du Grand Marshal/Roi Véga','Vaisseau',120.00,'Très Haute'),(25,'Véga No.2','ベガ２号 (Vega Nigō)',NULL,'Vaisseau-mère de Véga - Vaisseau de commandement du Prince de Rigel','Vaisseau',120.00,'Très Haute'),(26,'Véga No.3','ベガ３号 (Vega Sangō)',NULL,'Vaisseau-mère de Véga - Vaisseau de commandement d\'Hydargos','Vaisseau',120.00,'Très Haute'),(27,'Véga No.4','ベガ４号 (Vega Yongō)',NULL,'Vaisseau-mère de Véga - Vaisseau de commandement de Rubina','Vaisseau',120.00,'Très Haute'),(28,'Véga No.5','ベガ５号 (Vega Gogō)',NULL,'Croiseur de combat de Véga - Croiseur standard de l\'armée de Véga','Vaisseau',80.00,'Haute'),(29,'Véga No.6','ベガ６号 (Vega Rokugō)',NULL,'Croiseur de combat de Véga - Croiseur standard de l\'armée de Véga','Vaisseau',80.00,'Haute'),(30,'Véga No.7','ベガ７号 (Vega Nanagō)',NULL,'Croiseur de combat de Véga - Croiseur standard de l\'armée de Véga','Vaisseau',80.00,'Haute'),(31,'Véga No.0','ベガ０号 (Vega Zerogō)',NULL,'Vaisseau expérimental de Véga - Vaisseau expérimental ultime de Véga','Vaisseau',150.00,'Ultime'),(32,'Véga No.37','ベガ37号 (Vega Sanjūnana-gō)',NULL,'Vaisseau de reconnaissance de Véga - Vaisseau spécialisé dans la reconnaissance','Vaisseau',60.00,'Très Haute'),(33,'Véga No.38','ベガ38号 (Vega Sanjūhachi-gō)',NULL,'Vaisseau de recherche de Véga - Vaisseau de recherche scientifique','Vaisseau',60.00,'Très Haute'),(34,'Bamboula','バンブーラ (Banbūra)',NULL,'Singe géant cybernétique, extrêmement agile et fort','Créature Cybernétique',35.00,'Haute'),(35,'Grozam','グロザム (Gurozamu)',NULL,'Monstre volant ressemblant à une raie manta, cracheur de feu','Monstre Volant',32.00,'Moyenne'),(36,'Gromazan','グロマザン (Guromazan)',NULL,'Créature volante semblable à un ptérodactyle mécanique','Monstre Volant',30.00,'Moyenne'),(37,'Zaramel','ザラメル (Zarameru)',NULL,'Monstre marin géant envoyé pour attaquer depuis les océans','Monstre Marin',50.00,'Très Haute'),(38,'Draken','ドラケン (Doraken)',NULL,'Dragon mécanique très redoutable','Dragon Mécanique',45.00,'Haute'),(39,'Bouboule','スフェロイド (Suferoido)',NULL,'Robot sphérique géant et roulant, extrêmement résistant','Machine de Siège',25.00,'Moyenne'),(40,'Robot-Crabe','キングクラブ (Kingu Kurabu)',NULL,'Énorme machine de siège en forme de crabe','Machine de Siège',30.00,'Haute'),(41,'Robot-Scorpion','スコーピオン (Sukōpion)',NULL,'Machine de siège avec un dard et une queue puissante','Machine de Siège',28.00,'Haute'),(42,'Robot-Serpent','スネーク (Sunēku)',NULL,'Machine longue et segmentée comme un serpent','Machine de Siège',60.00,'Moyenne');
/*!40000 ALTER TABLE `monstres` ENABLE KEYS */;
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
