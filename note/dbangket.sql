-- 1. Tabel Admin
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255), -- Gunakan hash (bcrypt)
    role ENUM('super_admin', 'admin') DEFAULT 'admin'
);

-- 2. Hierarki Sekolah (Sekolah -> Angkatan -> Kejuruan -> Kelas)
CREATE TABLE sekolah (
    id INT PRIMARY KEY AUTO_INCREMENT,
     nama_sekolah VARCHAR(100)
);

CREATE TABLE angkatan (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    id_sekolah INT, 
    tahun_angkatan YEAR
);

CREATE TABLE kejuruan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_angkatan INT, 
    nama_kejuruan VARCHAR(100)
);

CREATE TABLE kelas (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    id_kejuruan INT, 
    nama_kelas VARCHAR(50)
);

-- 3. Tabel Pelajar (Pusat Kendali PIN)
CREATE TABLE pelajar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_kelas INT,
    nama_pelajar VARCHAR(100),
    nomor_pelajar VARCHAR(20) UNIQUE,
    pin_survey VARCHAR(10) UNIQUE, -- PIN unik
    status_isi ENUM('belum', 'proses', 'selesai') DEFAULT 'belum',
    last_login TIMESTAMP NULL,
    FOREIGN KEY (id_kelas) REFERENCES kelas(id)
);

-- 4. Tabel Pertanyaan
CREATE TABLE pertanyaan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isi_pertanyaan TEXT,
    tipe_soal ENUM('pilihan_ganda', 'essay') DEFAULT 'pilihan_ganda',
    bobot_persentase DECIMAL(5,2) -- Contoh: 10.00 untuk 10%
);

CREATE TABLE `pertanyaan_scope` (
  `id` int(11) NOT NULL,
  `id_pertanyaan` int(11) DEFAULT NULL,
  `id_sekolah` int(11) DEFAULT NULL,
  `id_kejuruan` int(11) DEFAULT NULL,
  `id_kelas` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- 5. Tabel Respon (Data Jawaban)
CREATE TABLE respon (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pelajar INT,
    id_pertanyaan INT,
    -- Nilai: 1 (Very Low) s/d 5 (Very High)
    skor_poin TINYINT CHECK (skor_poin BETWEEN 1 AND 5), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pelajar) REFERENCES pelajar(id),
    FOREIGN KEY (id_pertanyaan) REFERENCES pertanyaan(id),
    -- Mencegah 1 pelajar mengisi soal yang sama dua kali
    UNIQUE KEY unique_respon (id_pelajar, id_pertanyaan) 
);