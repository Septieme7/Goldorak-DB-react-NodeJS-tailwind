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
-- Table structure for table `vaisseaux`
--

DROP TABLE IF EXISTS `vaisseaux`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vaisseaux` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_fr` varchar(100) NOT NULL,
  `nom_jp` varchar(100) DEFAULT NULL,
  `type_vaisseau` varchar(50) DEFAULT NULL,
  `pilote_id` int DEFAULT NULL,
  `description` text,
  `faction` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `pilote_id` (`pilote_id`),
  KEY `idx_vaisseaux_nom` (`nom_fr`),
  CONSTRAINT `vaisseaux_ibfk_1` FOREIGN KEY (`pilote_id`) REFERENCES `personnages` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vaisseaux`
--

LOCK TABLES `vaisseaux` WRITE;
/*!40000 ALTER TABLE `vaisseaux` DISABLE KEYS */;
INSERT INTO `vaisseaux` VALUES (1,'Spacer','Spacer','Vaisseau de combat',1,'Vaisseau personnel d\'Actarus, multiple transformations','Terre'),(2,'Grand Spacer','Great Spacer','Vaisseau-mère',NULL,'Base mobile et atelier de réparation','Terre'),(3,'Spazer Char','Tank Spacer','Char d\'assaut',1,'Transformation terrestre du Spacer','Terre'),(4,'Spazer Sous-Marin','Dolphin Spacer','Submersible',1,'Transformation maritime du Spacer','Terre'),(5,'Véga No.1','ベガ１号 (Vega Ichigō)','Vaisseau-mère',7,'Vaisseau principal du Grand Marshal/Roi Véga','Véga'),(6,'Véga No.2','ベガ２号 (Vega Nigō)','Vaisseau-mère',8,'Vaisseau de commandement du Prince de Rigel','Véga'),(7,'Véga No.3','ベガ３号 (Vega Sangō)','Vaisseau-mère',9,'Vaisseau de commandement d\'Hydargos','Véga'),(8,'Véga No.4','ベガ４号 (Vega Yongō)','Vaisseau-mère',10,'Vaisseau de commandement de Rubina','Véga'),(9,'Véga No.5','ベガ５号 (Vega Gogō)','Croiseur de combat',NULL,'Croiseur standard de l\'armée de Véga','Véga'),(10,'Véga No.6','ベガ６号 (Vega Rokugō)','Croiseur de combat',NULL,'Croiseur standard de l\'armée de Véga','Véga'),(11,'Véga No.7','ベガ７号 (Vega Nanagō)','Croiseur de combat',NULL,'Croiseur standard de l\'armée de Véga','Véga'),(12,'Véga No.0','ベガ０号 (Vega Zerogō)','Vaisseau expérimental',7,'Vaisseau expérimental ultime de Véga','Véga'),(13,'Véga No.37','ベガ37号 (Vega Sanjūnana-gō)','Vaisseau de reconnaissance',NULL,'Vaisseau spécialisé dans la reconnaissance','Véga'),(14,'Véga No.38','ベガ38号 (Vega Sanjūhachi-gō)','Vaisseau de recherche',NULL,'Vaisseau de recherche scientifique','Véga'),(16,'Vaisseau d\'Aphrodia','アフロディア機 (Afurodia-ki)','Vaisseau de Commandement',22,'Vaisseau personnel de la princesse Aphrodia en forme d\'oiseau de proie','Véga'),(17,'Robot du Roi Vega','ベガ大王ロボ (Vega Daiō Robo)','Robot Personnel',7,'Robot personnel du Roi Vega dans le film La Grande Attaque de Vega','Véga'),(18,'Soucoupe Végan Type A','ベガ円盤A型 (Vega Enban A-gata)','Chasseur Spatial',NULL,'Chasseur spatial de base des forces Vegan','Véga'),(19,'Soucoupe Végan Type B','ベガ円盤B型 (Vega Enban B-gata)','Bombardier',NULL,'Bombardier lourd des forces Vegan','Véga'),(20,'Vaisseau-Mère Végan','ベガ母艦 (Vega Bokan)','Cuirassé Spatial',21,'Cuirassé spatial de commandement des forces Vegan','Véga');
/*!40000 ALTER TABLE `vaisseaux` ENABLE KEYS */;
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
