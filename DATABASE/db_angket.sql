-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 15 Feb 2026 pada 03.54
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
-- Struktur dari tabel `access_code`
--

CREATE TABLE `access_code` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `id_kelas` int(11) DEFAULT NULL,
  `is_used` tinyint(1) DEFAULT 0,
  `used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(1, '123', '$2b$10$ZQeg6sVgIRFzC2l7uXVKcu3bbkwwnEHHoO0eGMuN/k3nCiZJkHwVa', 'super_admin');

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
  `id_sekolah` int(11) DEFAULT NULL,
  `nama_kejuruan` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kejuruan`
--

INSERT INTO `kejuruan` (`id`, `id_sekolah`, `nama_kejuruan`) VALUES
(1, 1, 'Teknik Alat Berat'),
(3, 3, 'Teknik Komputer dan Jaringan');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kelas`
--

CREATE TABLE `kelas` (
  `id` int(11) NOT NULL,
  `id_kejuruan` int(11) DEFAULT NULL,
  `nama_kelas` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `kelas`
--

INSERT INTO `kelas` (`id`, `id_kejuruan`, `nama_kelas`) VALUES
(1, 1, 'XII RPL 1 (A)');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pelajar`
--

CREATE TABLE `pelajar` (
  `id` int(11) NOT NULL,
  `id_kelas` int(11) DEFAULT NULL,
  `nama_pelajar` varchar(100) NOT NULL,
  `nomor_absen` varchar(10) NOT NULL,
  `status_isi` enum('belum','proses','selesai') DEFAULT 'belum',
  `last_login` timestamp NULL DEFAULT NULL,
  `id_access_code` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaan`
--

CREATE TABLE `pertanyaan` (
  `id` int(11) NOT NULL,
  `isi_pertanyaan` text NOT NULL,
  `kategori` enum('Awareness','Learning strategies','Learning activities','Evaluation','Interpersonal skills') NOT NULL,
  `tipe_soal` enum('pilihan_ganda') DEFAULT 'pilihan_ganda',
  `bobot_persentase` decimal(5,2) DEFAULT 1.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `pertanyaan`
--

INSERT INTO `pertanyaan` (`id`, `isi_pertanyaan`, `kategori`, `tipe_soal`, `bobot_persentase`) VALUES
(1, 'I identify my own learning needs', 'Awareness', 'pilihan_ganda', 1.00);

-- --------------------------------------------------------

--
-- Struktur dari tabel `pertanyaan_scope`
--

CREATE TABLE `pertanyaan_scope` (
  `id` int(11) NOT NULL,
  `id_pertanyaan` int(11) DEFAULT NULL,
  `id_sekolah` int(11) DEFAULT NULL,
  `id_kejuruan` int(11) DEFAULT NULL,
  `id_kelas` int(11) DEFAULT NULL
) ;

--
-- Dumping data untuk tabel `pertanyaan_scope`
--

INSERT INTO `pertanyaan_scope` (`id`, `id_pertanyaan`, `id_sekolah`, `id_kejuruan`, `id_kelas`) VALUES
(1, 1, 1, 1, 1);

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
  `nama_sekolah` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `sekolah`
--

INSERT INTO `sekolah` (`id`, `nama_sekolah`) VALUES
(1, 'SMK Negeri 1 Jakarta'),
(3, 'SMK Negeri 2 Jakarta');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `access_code`
--
ALTER TABLE `access_code`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `id_kelas` (`id_kelas`),
  ADD KEY `idx_code_used` (`code`,`is_used`);

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

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
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_sekolah` (`id_sekolah`);

--
-- Indeks untuk tabel `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_kejuruan` (`id_kejuruan`);

--
-- Indeks untuk tabel `pelajar`
--
ALTER TABLE `pelajar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_siswa` (`nama_pelajar`,`nomor_absen`,`id_kelas`),
  ADD UNIQUE KEY `id_access_code` (`id_access_code`),
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
  ADD KEY `id_pertanyaan` (`id_pertanyaan`),
  ADD KEY `id_kejuruan` (`id_kejuruan`),
  ADD KEY `id_kelas` (`id_kelas`),
  ADD KEY `idx_scope_lookup` (`id_sekolah`,`id_kejuruan`,`id_kelas`);

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
-- AUTO_INCREMENT untuk tabel `access_code`
--
ALTER TABLE `access_code`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `hasil_survey`
--
ALTER TABLE `hasil_survey`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `kejuruan`
--
ALTER TABLE `kejuruan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `pelajar`
--
ALTER TABLE `pelajar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `pertanyaan`
--
ALTER TABLE `pertanyaan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `pertanyaan_scope`
--
ALTER TABLE `pertanyaan_scope`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `respon`
--
ALTER TABLE `respon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `sekolah`
--
ALTER TABLE `sekolah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `access_code`
--
ALTER TABLE `access_code`
  ADD CONSTRAINT `access_code_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `hasil_survey`
--
ALTER TABLE `hasil_survey`
  ADD CONSTRAINT `hasil_survey_ibfk_1` FOREIGN KEY (`id_pelajar`) REFERENCES `pelajar` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `kejuruan`
--
ALTER TABLE `kejuruan`
  ADD CONSTRAINT `kejuruan_ibfk_1` FOREIGN KEY (`id_sekolah`) REFERENCES `sekolah` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `kelas`
--
ALTER TABLE `kelas`
  ADD CONSTRAINT `kelas_ibfk_1` FOREIGN KEY (`id_kejuruan`) REFERENCES `kejuruan` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pelajar`
--
ALTER TABLE `pelajar`
  ADD CONSTRAINT `fk_pelajar_access_code` FOREIGN KEY (`id_access_code`) REFERENCES `access_code` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pelajar_ibfk_1` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pertanyaan_scope`
--
ALTER TABLE `pertanyaan_scope`
  ADD CONSTRAINT `pertanyaan_scope_ibfk_1` FOREIGN KEY (`id_pertanyaan`) REFERENCES `pertanyaan` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `pertanyaan_scope_ibfk_2` FOREIGN KEY (`id_sekolah`) REFERENCES `sekolah` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pertanyaan_scope_ibfk_3` FOREIGN KEY (`id_kejuruan`) REFERENCES `kejuruan` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `pertanyaan_scope_ibfk_4` FOREIGN KEY (`id_kelas`) REFERENCES `kelas` (`id`) ON DELETE SET NULL;

--
-- Ketidakleluasaan untuk tabel `respon`
--
ALTER TABLE `respon`
  ADD CONSTRAINT `respon_ibfk_1` FOREIGN KEY (`id_pelajar`) REFERENCES `pelajar` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `respon_ibfk_2` FOREIGN KEY (`id_pertanyaan`) REFERENCES `pertanyaan` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
