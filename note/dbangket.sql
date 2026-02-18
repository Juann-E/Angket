-- ==========================================================
-- SKEMA UNIVERSAL: SISTEM ANGKET KEMANDIRIAN BELAJAR (SRSSDL)
-- LOGIKA: 60 SOAL MASTER UNTUK SEMUA SEKOLAH
-- ==========================================================

-- 1. TABEL ADMIN
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('super_admin', 'admin') DEFAULT 'admin'
);

-- 2. HIERARKI DATA (Identitas Pelajar)
CREATE TABLE sekolah (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_sekolah VARCHAR(100) NOT NULL
);

CREATE TABLE kejuruan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_sekolah INT, 
    nama_kejuruan VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_sekolah) REFERENCES sekolah(id) ON DELETE CASCADE
);

CREATE TABLE kelas (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    id_kejuruan INT, 
    nama_kelas VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_kejuruan) REFERENCES kejuruan(id) ON DELETE CASCADE
);

-- 3. MANAJEMEN KODE AKSES
CREATE TABLE access_code (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    id_kelas INT,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE CASCADE,
    INDEX idx_code_used (code, is_used)
);

-- 4. TABEL PELAJAR
CREATE TABLE pelajar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_kelas INT,
    id_access_code INT UNIQUE,
    nama_pelajar VARCHAR(100) NOT NULL,
    nomor_absen VARCHAR(10) NOT NULL,
    status_isi ENUM('belum', 'proses', 'selesai') DEFAULT 'belum',
    last_login TIMESTAMP NULL,
    FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE CASCADE,
    FOREIGN KEY (id_access_code) REFERENCES access_code(id) ON DELETE SET NULL,
    UNIQUE KEY unique_siswa (nama_pelajar, nomor_absen, id_kelas)
);

-- 5. TABEL PERTANYAAN (Universal - 60 Butir)
-- Semua butir dinyatakan secara positif[cite: 95].
CREATE TABLE pertanyaan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isi_pertanyaan TEXT NOT NULL,
    -- 5 Area SRSSDL: Awareness, Strategies, Activities, Evaluation, Interpersonal .
    kategori ENUM(
        'Awareness', 
        'Learning strategies', 
        'Learning activities', 
        'Evaluation', 
        'Interpersonal skills'
    ) NOT NULL,
    tipe_soal ENUM('pilihan_ganda') DEFAULT 'pilihan_ganda',
    -- Skor 1-5[cite: 89, 95].
    bobot_persentase DECIMAL(5,2) DEFAULT 1.00
);

-- 6. TABEL RESPON (Jawaban Siswa)
CREATE TABLE respon (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pelajar INT,
    id_pertanyaan INT,
    -- Skala Likert: 1 (Never) s/d 5 (Always)[cite: 89, 95].
    skor_poin TINYINT CHECK (skor_poin BETWEEN 1 AND 5), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pelajar) REFERENCES pelajar(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pertanyaan) REFERENCES pertanyaan(id) ON DELETE CASCADE,
    UNIQUE KEY unique_respon (id_pelajar, id_pertanyaan) 
);

-- 7. HASIL SURVEY (Kalkulasi Skor Williamson)
-- Rentang Skor: Low (60-140), Moderate (141-220), High (221-300)[cite: 95, 101, 102].
CREATE TABLE hasil_survey (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pelajar INT UNIQUE,
    total_skor INT,
    level_sdness ENUM('Low', 'Moderate', 'High'),
    diselesaikan_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pelajar) REFERENCES pelajar(id) ON DELETE CASCADE
);