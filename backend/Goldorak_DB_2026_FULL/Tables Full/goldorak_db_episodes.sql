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
-- Table structure for table `episodes`
--

DROP TABLE IF EXISTS `episodes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `episodes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `numero_jp` int DEFAULT NULL,
  `numero_fr` int DEFAULT NULL,
  `titre_fr` varchar(200) NOT NULL,
  `titre_jp` varchar(200) DEFAULT NULL,
  `diffuse_jp` date DEFAULT NULL,
  `diffuse_fr` date DEFAULT NULL,
  `resume` text,
  PRIMARY KEY (`id`),
  KEY `idx_episodes_numero` (`numero_fr`,`numero_jp`)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `episodes`
--

LOCK TABLES `episodes` WRITE;
/*!40000 ALTER TABLE `episodes` DISABLE KEYS */;
INSERT INTO `episodes` VALUES (9,1,1,'Le justicier de l\'espace','発進! グレンダイザー','1975-10-05','1978-07-03',NULL),(10,2,2,'Le monstre des mers','恐怖の海の怪獣','1975-10-12','1978-07-04',NULL),(11,16,15,'Le monstre vampire','怪獣ウインダーあらわる','1976-01-25','1978-08-01',NULL),(12,74,72,'Adieu Goldorak','永遠に輝けグレンダイザー','1977-02-27','1979-01-01',NULL),(13,1,1,'Le justicier de l\'espace','発進! グレンダイザー','1975-10-05',NULL,NULL),(14,2,2,'Le monstre des mers','恐怖の海の怪獣','1975-10-12',NULL,NULL),(15,3,3,'L\'antre du monstre','怪獣島の決闘','1975-10-19',NULL,NULL),(16,4,4,'Le vaisseau fantôme','ゆうれい船の恐怖','1975-10-26',NULL,NULL),(17,5,5,'Le monstre des neiges','白銀の怪獣現わる','1975-11-02',NULL,NULL),(18,6,6,'Le piège','怪獣の罠を破れ','1975-11-09',NULL,NULL),(19,7,7,'Le monstre des marais','よみがえる湖の怪獣','1975-11-16',NULL,NULL),(20,8,8,'L\'arme secrète','必殺! スペーサー攻擊','1975-11-23',NULL,NULL),(21,9,9,'Le monstre des sables','灼熱の砂漠の怪獣','1975-11-30',NULL,NULL),(22,10,10,'Le monstre des volcans','地底怪獣の挑戦','1975-12-07',NULL,NULL),(23,11,11,'Double Hache','北極の大怪獣を倒せ','1975-12-14',NULL,NULL),(24,12,12,'Le monstre des glaces','南極の大決闘','1975-12-21',NULL,NULL),(25,13,13,'Le sous-marin de l\'enfer','海底基地を叩け','1975-12-28',NULL,NULL),(26,14,14,'L\'île de la mort','怪獣島の決闘','1976-01-04',NULL,NULL),(27,15,NULL,'Épisode non diffusé en France','さらばハンター機','1976-01-11',NULL,NULL),(28,16,15,'Le monstre vampire','怪獣ウインダーあらわる','1976-01-18',NULL,NULL),(29,17,16,'Le réveil du volcan','大爆発! 富士山','1976-01-25',NULL,NULL),(30,18,17,'Le monstre des marécages','怪獣ゴースを倒せ!','1976-02-01',NULL,NULL),(31,19,18,'Le monstre des neiges','白い悪魔の恐怖','1976-02-08',NULL,NULL),(32,20,19,'Le monstre des glaces','北海の大激闘','1976-02-15',NULL,NULL),(33,21,20,'Le monstre des forêts','緑の怪獣の恐怖','1976-02-22',NULL,NULL),(34,22,21,'Le monstre des cavernes','地底怪獣大作戦','1976-02-29',NULL,NULL),(35,23,22,'Le monstre des abîmes','南海の大怪獣','1976-03-07',NULL,NULL),(36,24,23,'Le monstre de feu','炎の怪獣を倒せ!','1976-03-14',NULL,NULL),(37,25,24,'Le monstre solaire','太陽怪獣の挑戦','1976-03-21',NULL,NULL),(38,26,25,'Le monstre lunaire','月怪獣現わる!','1976-03-28',NULL,NULL),(39,27,26,'L\'étoile de la mort','宇宙よりの挑戦','1976-04-04',NULL,NULL),(40,28,27,'Le monstre magnétique','磁力怪獣の罠','1976-04-11',NULL,NULL),(41,29,28,'Le monstre des ténèbres','暗黒怪獣の恐怖','1976-04-18',NULL,NULL),(42,30,29,'Le monstre météore','流れ星怪獣の恐怖','1976-04-25',NULL,NULL),(43,31,30,'Le monstre miroir','鏡怪獣の魔力','1976-05-02',NULL,NULL),(44,32,31,'Le monstre des profondeurs','深海怪獣を倒せ!','1976-05-09',NULL,NULL),(45,33,32,'Le monstre aérien','大空の大決闘','1976-05-16',NULL,NULL),(46,34,33,'Le monstre des récifs','珊瑚怪獣の恐怖','1976-05-23',NULL,NULL),(47,35,34,'Le monstre des tempêtes','嵐を呼ぶ怪獣','1976-05-30',NULL,NULL),(48,36,35,'Le monstre des brumes','霧の怪獣現わる!','1976-06-06',NULL,NULL),(49,37,36,'Le monstre des ruines','古代怪獣の復活','1976-06-13',NULL,NULL),(50,38,37,'Le monstre des épaves','悪魔の円盤の恐怖','1976-06-20',NULL,NULL),(51,39,38,'Le monstre des sources','熱泉怪獣を倒せ!','1976-06-27',NULL,NULL),(52,40,39,'Le monstre des aurores boréales','オーロラ怪獣の恐怖','1976-07-04',NULL,NULL),(53,41,40,'Le monstre des comètes','大彗星怪獣を倒せ!','1976-07-11',NULL,NULL),(54,42,41,'Le monstre des cyclones','大竜巻怪獣の恐怖','1976-07-18',NULL,NULL),(55,43,42,'Le monstre des éclipses','魔の円盤獣の恐怖','1976-07-25',NULL,NULL),(56,44,43,'Le monstre des météorites','隕石怪獣を倒せ!','1976-08-01',NULL,NULL),(57,45,44,'Le monstre des glaciers','大氷山怪獣の恐怖','1976-08-08',NULL,NULL),(58,46,45,'Le monstre des éruptions','火山怪獣大暴れ','1976-08-15',NULL,NULL),(59,47,46,'Le monstre des nuages','暗黒大円盤の恐怖','1976-08-22',NULL,NULL),(60,48,47,'Le monstre des vagues','大津波怪獣を倒せ!','1976-08-29',NULL,NULL),(61,49,48,'Le monstre des profondeurs','地底大怪獣の挑戦','1976-09-05',NULL,NULL),(62,50,49,'Le monstre des tempêtes de sable','砂嵐怪獣の恐怖','1976-09-12',NULL,NULL),(63,51,50,'Le monstre des aurores boréales','オーロラ怪獣を倒せ!','1976-09-19',NULL,NULL),(64,52,51,'Le monstre des comètes','大彗星怪獣の最期','1976-09-26',NULL,NULL),(65,53,52,'Le monstre des éclairs','放電怪獣大暴れ','1976-10-03',NULL,NULL),(66,54,53,'Le monstre des neiges éternelles','大雪山の決闘','1976-10-10',NULL,NULL),(67,55,54,'Le monstre des brumes mortelles','毒ガス怪獣を倒せ!','1976-10-17',NULL,NULL),(68,56,55,'Le monstre des laves','溶岩怪獣の恐怖','1976-10-24',NULL,NULL),(69,57,56,'Le monstre des tourbillons','大渦巻怪獣現わる!','1976-10-31',NULL,NULL),(70,58,57,'Le monstre des glaces flottantes','流水怪獣を倒せ!','1976-11-07',NULL,NULL),(71,59,58,'Le monstre des échos','反響怪獣の恐怖','1976-11-14',NULL,NULL),(72,60,59,'Le monstre des marées','大潮怪獣大暴れ','1976-11-21',NULL,NULL),(73,61,60,'Le monstre des mirages','しばり怪獣を倒せ!','1976-11-28',NULL,NULL),(74,62,61,'Le monstre des ténèbres','暗黒大怪獣の挑戦','1976-12-05',NULL,NULL),(75,63,62,'Le monstre des éclipses totales','皆既日食怪獣の恐怖','1976-12-12',NULL,NULL),(76,64,63,'Le monstre des aurores australes','南極光怪獣を倒せ!','1976-12-19',NULL,NULL),(77,65,64,'Le monstre des météores','流星怪獣大暴れ','1976-12-26',NULL,NULL),(78,66,65,'Le monstre des comètes','すい星怪獣の最期','1977-01-02',NULL,NULL),(79,67,66,'Le monstre des éruptions solaires','太陽怪獣を倒せ!','1977-01-09',NULL,NULL),(80,68,67,'Le monstre des galaxies','銀河怪獣の恐怖','1977-01-16',NULL,NULL),(81,69,68,'Le monstre des quasars','宇宙怪獣大暴れ','1977-01-23',NULL,NULL),(82,70,69,'Le monstre des pulsars','中性子怪獣を倒せ!','1977-01-30',NULL,NULL),(83,71,70,'Le monstre des trous noirs','ブラックホール怪獣の恐怖','1977-02-06',NULL,NULL),(84,72,71,'Le monstre des supernovas','超新星怪獣大暴れ','1977-02-13',NULL,NULL),(85,73,NULL,'Épisode non doublé en France','よみがえる怪獣軍団','1977-02-20',NULL,NULL);
/*!40000 ALTER TABLE `episodes` ENABLE KEYS */;
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
