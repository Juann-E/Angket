-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 09 Feb 2026 pada 17.07
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_angket`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('super_admin','admin') DEFAULT 'admin'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `role`) VALUES
(1, '123', '$2b$10$YXU4DFAJQfvqlYckVS3fmu4f3MXv32z3SiP9R0vOtNGGHpgvnPuXi', 'admin');

-- --------------------------------------------------------

--
-- Struktur dari tabel `angkatan`
--

CREATE TABLE `angkatan` (
  `id` int(11) NOT NULL,
  `id_sekolah` int(11) DEFAULT NULL,
  `tahun_angkatan` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `angkatan`
--

INSERT INTO `angkatan` (`id`, `id_sekolah`, `tahun_angkatan`) VALUES
(1, 1, '2024'),
(3, 2, '2025'),
(4, 2, '2020'),
(7, 2, '2027');

-- --------------------------------------------------------

--
-- Struktur dari tabel `hasil_survey`
--

CREATE TABLE `hasil_survey` (
  `id` int(11) NOT NULL,
  `id_pelajar` int(11) DEFAULT NULL,
  `total_skor` int(11) DEFAULT NULL,
  `level_sdness` enum('Low','Moderate','High') DEFAULT NULL,
  `diselesaikan_pada` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `kejuruan`
--

CREATE TABLE `kejuruan` (
  `id` int(11) NOT NULL,
  `id_angkatan` int(11) DEFAULT NULL,
  `nama_kejuruan` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kejuruan`
--

INSERT INTO `kejuruan` (`id`, `id_angkatan`, `nama_kejuruan`) VALUES
(1, 1, 'Teknik Alat Berat');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kelas`
--

CREATE TABLE `kelas` (
  `id` int(11) NOT NULL,
  `id_kejuruan` int(11) DEFAULT NULL,
  `nama_kelas` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kelas`
--

INSERT INTO `kelas` (`id`, `id_kejuruan`, `nama_kelas`) VALUES
(1, 1, 'XII RPL 1'),
(2, 1, 'X-RPL-1');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pelajar`
--

CREATE TABLE `pelajar` (
  `id` int(11) NOT NULL,
  `id_kelas` int(11) DEFAULT NULL,
  `nama_pelajar` varchar(100) DEFAULT NULL,
  `nomor_pelajar` varchar(20) DEFAULT NULL,
  `pin_survey` varchar(10) DEFAULT NULL,
  `status_isi` enum('belum','proses','selesai') DEFAULT 'belum',
  `last_login` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaan`
--

CREATE TABLE `pertanyaan` (
  `id` int(11) NOT NULL,
  `isi_pertanyaan` text DEFAULT NULL,
  `kategori` enum('Awareness','Learning strategies','Learning activities','Evaluation','Interpersonal skills') NOT NULL,
  `tipe_soal` enum('pilihan_ganda') DEFAULT 'pilihan_ganda',
  `bobot_persentase` decimal(5,2) DEFAULT 1.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pertanyaan`
--

INSERT INTO `pertanyaan` (`id`, `isi_pertanyaan`, `kategori`, `tipe_soal`, `bobot_persentase`) VALUES
(1, 'I am able to select the best method for my own learning', 'Awareness', 'pilihan_ganda', 10.00),
(2, 'Bagaimana tingkat kenyamanan?', 'Awareness', 'pilihan_ganda', 10.00),
(5, 'I identify my own learning needs', 'Awareness', 'pilihan_ganda', 1.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaan_scope`
--

CREATE TABLE `pertanyaan_scope` (
  `id` int(11) NOT NULL,
  `id_pertanyaan` int(11) DEFAULT NULL,
  `id_sekolah` int(11) DEFAULT NULL,
  `id_angkatan` int(11) DEFAULT NULL,
  `id_kejuruan` int(11) DEFAULT NULL,
  `id_kelas` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pertanyaan_scope`
--

INSERT INTO `pertanyaan_scope` (`id`, `id_pertanyaan`, `id_sekolah`, `id_angkatan`, `id_kejuruan`, `id_kelas`) VALUES
(1, 1, 1, NULL, 1, 1),
(2, 2, 1, NULL, 1, 1),
(5, 5, 1, 1, 1, 1);

-- --------------------------------------------------------

--
-- Struktur dari tabel `respon`
--

CREATE TABLE `respon` (
  `id` int(11) NOT NULL,
  `id_pelajar` int(11) DEFAULT NULL,
  `id_pertanyaan` int(11) DEFAULT NULL,
  `skor_poin` tinyint(4) DEFAULT NULL CHECK (`skor_poin` between 1 and 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `sekolah`
--

CREATE TABLE `sekolah` (
  `id` int(11) NOT NULL,
  `nama_sekolah` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sekolah`
--

INSERT INTO `sekolah` (`id`, `nama_sekolah`) VALUES
(1, 'SMK 1');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `angkatan`
--
ALTER TABLE `angkatan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `hasil_survey`
--
ALTER TABLE `hasil_survey`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_pelajar` (`id_pelajar`);

--
-- Indeks untuk tabel `kejuruan`
--
ALTER TABLE `kejuruan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pelajar`
--
ALTER TABLE `pelajar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomor_pelajar` (`nomor_pelajar`),
  ADD UNIQUE KEY `pin_survey` (`pin_survey`),
  ADD KEY `id_kelas` (`id_kelas`);

--
-- Indeks untuk tabel `pertanyaan`
--
ALTER TABLE `pertanyaan`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `pertanyaan_scope`
--
ALTER TABLE `pertanyaan_scope`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_scope_pertanyaan` (`id_pertanyaan`),
  ADD KEY `fk_scope_sekolah` (`id_sekolah`),
  ADD KEY `fk_scope_angkatan` (`id_angkatan`),
  ADD KEY `fk_scope_kejuruan` (`id_kejuruan`),
  ADD KEY `fk_scope_kelas` (`id_kelas`);

--
-- Indeks untuk tabel `respon`
--
ALTER TABLE `respon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_respon` (`id_pelajar`,`id_pertanyaan`),
  ADD KEY `id_pertanyaan` (`id_pertanyaan`);

--
-- Indeks untuk tabel `sekolah`
--
ALTER TABLE `sekolah`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `angkatan`
--
ALTER TABLE `angkatan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `hasil_survey`
--
ALTER TABLE `hasil_survey`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `kejuruan`
--
ALTER TABLE `kejuruan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `pelajar`
--
ALTER TABLE `pelajar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pertanyaan`
--
ALTER TABLE `pertanyaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `pertanyaan_scope`
--
ALTER TABLE `pertanyaan_scope`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `respon`
--
ALTER TABLE `respon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `sekolah`
--
ALTER TABLE `sekolah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `hasil_survey`
--
ALTER TABLE `hasil_survey`
  ADD CONSTRAINT `hasil_survey_ibfk_1` FOREIGN KEY (`id_pelajar`) REFERENCES `pelajar` (`id`);

--
-- Ketidakleluasaan untuk tabel `pelajar`
--
ALTER TABLE `pelajar`
  ADD CONSTRAINT `pelajar_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`);

--
-- Ketidakleluasaan untuk tabel `pertanyaan_scope`
--
ALTER TABLE `pertanyaan_scope`
  ADD CONSTRAINT `fk_pertanyaan_scope_angkatan` FOREIGN KEY (`id_angkatan`) REFERENCES `angkatan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_scope_angkatan` FOREIGN KEY (`id_angkatan`) REFERENCES `angkatan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_scope_kejuruan` FOREIGN KEY (`id_kejuruan`) REFERENCES `kejuruan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_scope_kelas` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_scope_pertanyaan` FOREIGN KEY (`id_pertanyaan`) REFERENCES `pertanyaan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_scope_sekolah` FOREIGN KEY (`id_sekolah`) REFERENCES `sekolah` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `respon`
--
ALTER TABLE `respon`
  ADD CONSTRAINT `respon_ibfk_1` FOREIGN KEY (`id_pelajar`) REFERENCES `pelajar` (`id`),
  ADD CONSTRAINT `respon_ibfk_2` FOREIGN KEY (`id_pertanyaan`) REFERENCES `pertanyaan` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
