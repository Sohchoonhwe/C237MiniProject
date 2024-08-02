-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2024 at 03:32 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotelw`
--

-- --------------------------------------------------------

--
-- Table structure for table `booking`
--

CREATE TABLE `booking` (
  `BookingID` int(255) NOT NULL,
  `UserName` varchar(256) NOT NULL,
  `UserEmail` varchar(256) NOT NULL,
  `RoomTypeID` int(255) NOT NULL,
  `RoomTypeName` varchar(256) NOT NULL,
  `RoomNumber` int(255) NOT NULL,
  `CheckInDate` date NOT NULL,
  `CheckOutDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking`
--

INSERT INTO `booking` (`BookingID`, `UserName`, `UserEmail`, `RoomTypeID`, `RoomTypeName`, `RoomNumber`, `CheckInDate`, `CheckOutDate`) VALUES
(15, 'Test', 'test@test.com', 11, 'VIP ', 1, '2024-07-12', '2024-07-18'),
(16, 'Soh', 'test@test.com', 2, 'Double ', 2, '2024-07-31', '2024-08-27'),
(17, 'Test2', 'test2@test.com', 2, 'Double ', 3, '2024-07-22', '2024-07-29'),
(18, 'test3', 'test3@test.com', 1, 'Single', 4, '2024-07-25', '2024-07-29'),
(19, 'test5', 'test5@test.com', 1, 'Single', 5, '2024-08-01', '2024-08-07'),
(20, 'Test', 'test@test.com', 1, 'Single', 6, '2024-07-01', '2024-07-17');

-- --------------------------------------------------------

--
-- Table structure for table `rooms`
--

CREATE TABLE `rooms` (
  `RoomID` int(20) NOT NULL,
  `RoomTypeName` varchar(200) NOT NULL,
  `RoomQuantity` int(255) NOT NULL,
  `PricePerNight` double(10,2) NOT NULL,
  `Description` varchar(999) NOT NULL,
  `Image` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rooms`
--

INSERT INTO `rooms` (`RoomID`, `RoomTypeName`, `RoomQuantity`, `PricePerNight`, `Description`, `Image`) VALUES
(1, 'Single', 70, 100.00, 'A cozy room perfect for solo travelers. Equipped with all basic amenities.', 'https://webbox.imgix.net/images/owvecfmxulwbfvxm/c56a0c0d-8454-431a-9b3e-f420c72e82e3.jpg?auto=format,compress&fit=crop&crop=entropy&w=1024&h=400&dpr=2&q=20'),
(2, 'Double ', 69, 150.00, 'A spacious room ideal for couples or friends. Comes with two beds and modern facilities.', 'https://static1.eskypartners.com/travelguide/twin-room-double-room-jaka-roznica.jpg'),
(3, 'Queen', 13, 550.00, 'Luxurious room with a queen-sized bed, perfect for a comfortable and elegant stay.', 'https://cdn.marriottnetwork.com/uploads/sites/17/2018/03/The-Chatwal-Luxury-Collection-Hotel-New-York-Superior-Queen-Room.jpg'),
(8, 'Suite', 2, 1000.00, 'The ultimate in luxury, with a king-sized bed and top-notch facilities for an unforgettable stay', 'https://www.lottehotel.com/content/dam/lotte-hotel/lotte/yangon/accommodation/hotel/suite/royalsuite/180712-49-2000-acc-yangon-hotel.jpg.thumb.1920.1920.jpg'),
(11, 'VIP ', 2, 1000.00, 'Indulge in unparalleled luxury and sophistication with our exclusive VIP Suite at HotelW. Designed for the discerning traveler, this suite offers the ultimate retreat, combining comfort, elegance, and state-of-the-art amenities to ensure an unforgettable stay!', 'http://www.greatwallhotelbeijing.com/wp-content/uploads/sites/5/2018/06/Elite-VIP-Suite-Photo-1-1.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `staff`
--

CREATE TABLE `staff` (
  `StaffID` int(255) NOT NULL,
  `StaffName` varchar(30) NOT NULL,
  `StaffPosition` varchar(256) NOT NULL,
  `StaffPhoneNumber` int(11) NOT NULL,
  `StaffDepartment` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff`
--

INSERT INTO `staff` (`StaffID`, `StaffName`, `StaffPosition`, `StaffPhoneNumber`, `StaffDepartment`) VALUES
(6, 'Soh Choon Hwe', 'Manager', 92305342, 'Housekeeping'),
(7, 'Test', 'Employee', 88888888, 'Housekeeping'),
(8, 'Test4', 'Head of Kitchen', 88888888, 'Kitchen'),
(9, 'Test3', 'Employee', 88888888, 'Reception'),
(10, 'Test09', 'Employee', 88888888, 'Maintenance');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `booking`
--
ALTER TABLE `booking`
  ADD PRIMARY KEY (`BookingID`) USING BTREE,
  ADD KEY `booking_ibfk_1` (`RoomTypeID`);

--
-- Indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`RoomID`);

--
-- Indexes for table `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`StaffID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `booking`
--
ALTER TABLE `booking`
  MODIFY `BookingID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `RoomID` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `staff`
--
ALTER TABLE `staff`
  MODIFY `StaffID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `booking`
--
ALTER TABLE `booking`
  ADD CONSTRAINT `booking_ibfk_1` FOREIGN KEY (`RoomTypeID`) REFERENCES `rooms` (`RoomID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
