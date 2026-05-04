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
-- Table structure for table `armes`
--

DROP TABLE IF EXISTS `armes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `armes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_fr` varchar(100) NOT NULL,
  `nom_jp` varchar(100) DEFAULT NULL,
  `robot_id` int DEFAULT NULL,
  `puissance` varchar(50) DEFAULT NULL,
  `frequence_utilisation` enum('Très Fréquente','Fréquente','Occasionnelle','Assez Rare','Rare','Très Rare') DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  KEY `idx_armes_robot` (`robot_id`),
  CONSTRAINT `armes_ibfk_1` FOREIGN KEY (`robot_id`) REFERENCES `robots` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `armes`
--

LOCK TABLES `armes` WRITE;
/*!40000 ALTER TABLE `armes` DISABLE KEYS */;
INSERT INTO `armes` VALUES (1,'Double Hache','スペースサンダー (Supēsu Sandā)',1,'Très Haute','Très Fréquente','Lames d\'énergie projetées depuis les épaules'),(2,'Missiles Ventraux','ベントラルミサイル (Bentoraru Misairu)',1,'Haute','Fréquente','Salves de missiles tirés depuis le torse'),(3,'Lance-Flamme','ファイヤーブラスター (Faiyā Burasutā)',1,'Moyenne','Occasionnelle','Projection de flammes depuis la bouche'),(4,'Rafale de Feu','ブレストバーン (Buresuto Bān)',1,'Haute','Occasionnelle','Rayon d\'énergie thermique depuis le poitrail'),(5,'Fulguer Poing','ロケットパンチ (Roketto Panchi)',1,'Moyenne','Assez Rare','Poings propulsés sur l\'ennemi'),(6,'Rayon Cosmo','パワーレイ (Pawā Rei)',1,'Ultime','Très Rare','Rayon d\'énergie concentrée depuis le front'),(7,'Coup de Pied Sismique','ドリルプレッシャーキック (Doriru Puresshā Kikku)',1,'Très Haute','Rare','Onde de choc sismique via les pieds-forets'),(10,'Épée Laser','レーザーソード',1,'Très Haute','Très Rare','Une épée émettant un rayon laser tranchant'),(13,'Fouet Énergétique','エネルギー鞭 (Enerugī Muchi)',22,'Haute','Fréquente','Fouet composé d\'énergie pure'),(14,'Lance Démoniaque','デーモンランス (Dēmon Ransu)',27,'Très Haute','Très Fréquente','Lance énergétique utilisée comme arme principale'),(15,'Missiles Ailés','ウィングミサイル (Wingu Misairu)',27,'Moyenne','Occasionnelle','Missiles tirés depuis les ailes'),(16,'Épée Laser Verte','緑のレーザーソード (Midori no Rēzā Sōdo)',32,'Très Haute','Fréquente','Épée laser de couleur verte, arme caractéristique de Floga');
/*!40000 ALTER TABLE `armes` ENABLE KEYS */;
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
