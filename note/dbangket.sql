-- ==========================================================
-- SKEMA BARU: SISTEM ANGKET KEMANDIRIAN BELAJAR (SRSSDL)
-- PENYESUAIAN: TANPA ANGKAN & PENDAFTARAN MANDIRI SISWA
-- ==========================================================

-- 1. TABEL ADMIN
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('super_admin', 'admin') DEFAULT 'admin'
);

-- 2. HIERARKI DATA (Input oleh Admin)
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

-- 3. TABEL PELAJAR (Siswa Daftar Mandiri)
CREATE TABLE pelajar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_kelas INT,
    id_access_code INT UNIQUE, -- Kolom baru untuk relasi ke access_code
    nama_pelajar VARCHAR(100) NOT NULL,
    nomor_absen VARCHAR(10) NOT NULL,
    status_isi ENUM('belum', 'proses', 'selesai') DEFAULT 'belum',
    last_login TIMESTAMP NULL,
    FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE CASCADE,
    -- Relasi ke tabel access_code
    FOREIGN KEY (id_access_code) REFERENCES access_code(id) ON DELETE SET NULL,
    -- Mencegah pendaftaran ganda dalam satu kelas
    UNIQUE KEY unique_siswa (nama_pelajar, nomor_absen, id_kelas)
);

-- 3.1 TABEL ACCESS CODE
CREATE TABLE access_code (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(20) NOT NULL UNIQUE,
    id_kelas INT,
    is_used BOOLEAN DEFAULT FALSE,
    used_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE CASCADE,
    -- Index untuk mempercepat pengecekan kode saat pendaftaran
    INDEX idx_code_used (code, is_used)
);


-- 4. TABEL PERTANYAAN (Standar Riset Williamson - SRSSDL)
CREATE TABLE pertanyaan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isi_pertanyaan TEXT NOT NULL,
    -- 5 Area Utama SRSSDL [cite: 83-89]
    kategori ENUM(
        'Awareness', 
        'Learning strategies', 
        'Learning activities', 
        'Evaluation', 
        'Interpersonal skills'
    ) NOT NULL,
    tipe_soal ENUM('pilihan_ganda') DEFAULT 'pilihan_ganda',
    -- Default 1.00 agar total skor murni 60-300 [cite: 96, 279-281]
    bobot_persentase DECIMAL(5,2) DEFAULT 1.00
);

-- TABEL CAKUPAN PERTANYAAN (Scope)
CREATE TABLE pertanyaan_scope (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pertanyaan INT,
    id_sekolah INT NULL,
    id_kejuruan INT NULL,
    id_kelas INT NULL,
    
    -- Foreign Keys
    FOREIGN KEY (id_pertanyaan) REFERENCES pertanyaan(id) ON DELETE CASCADE,
    FOREIGN KEY (id_sekolah) REFERENCES sekolah(id) ON DELETE SET NULL,
    FOREIGN KEY (id_kejuruan) REFERENCES kejuruan(id) ON DELETE SET NULL,
    FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE SET NULL,

    -- Logika Hirarki (chk_scope_hierarchy)
    -- Memastikan salah satu dari sekolah, kejuruan, atau kelas harus diisi sesuai levelnya
    CONSTRAINT chk_scope_hierarchy CHECK (
        (id_kelas IS NOT NULL)
        OR (id_kelas IS NULL AND id_kejuruan IS NOT NULL)
        OR (id_kelas IS NULL AND id_kejuruan IS NULL AND id_sekolah IS NOT NULL)
    ),

    -- Indeks untuk mempercepat pencarian (idx_scope_lookup)
    INDEX idx_scope_lookup (id_sekolah, id_kejuruan, id_kelas)
);

-- 5. TABEL RESPON (Jawaban Siswa)
CREATE TABLE respon (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pelajar INT,
    id_pertanyaan INT,
    -- Skor 1 (Never) s/d 5 (Always) [cite: 90]
    skor_poin TINYINT CHECK (skor_poin BETWEEN 1 AND 5), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pelajar) REFERENCES pelajar(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pertanyaan) REFERENCES pertanyaan(id) ON DELETE CASCADE,
    UNIQUE KEY unique_respon (id_pelajar, id_pertanyaan) 
);

-- 6. HASIL SURVEY (Analisis Otomatis)
CREATE TABLE hasil_survey (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pelajar INT UNIQUE,
    total_skor INT,
    -- Interpretasi Tingkat Kemandirian [cite: 101-102]
    -- Low (60-140), Moderate (141-220), High (221-300)
    level_sdness ENUM('Low', 'Moderate', 'High'),
    diselesaikan_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pelajar) REFERENCES pelajar(id) ON DELETE CASCADE
);