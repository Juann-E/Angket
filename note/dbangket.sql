-- 1. Tabel Admin
CREATE TABLE admin (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    role ENUM('super_admin', 'admin') DEFAULT 'admin'
);

-- 2. Hierarki Sekolah
CREATE TABLE sekolah (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama_sekolah VARCHAR(100)
);

CREATE TABLE angkatan (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    id_sekolah INT, 
    tahun_angkatan YEAR,
    FOREIGN KEY (id_sekolah) REFERENCES sekolah(id) ON DELETE CASCADE
);

CREATE TABLE kejuruan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_angkatan INT, 
    nama_kejuruan VARCHAR(100),
    FOREIGN KEY (id_angkatan) REFERENCES angkatan(id) ON DELETE CASCADE
);

CREATE TABLE kelas (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    id_kejuruan INT, 
    nama_kelas VARCHAR(50),
    FOREIGN KEY (id_kejuruan) REFERENCES kejuruan(id) ON DELETE CASCADE
);

-- 3. Tabel Pelajar
CREATE TABLE pelajar (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_kelas INT,
    nama_pelajar VARCHAR(100),
    nomor_pelajar VARCHAR(20) UNIQUE,
    pin_survey VARCHAR(10) UNIQUE,
    status_isi ENUM('belum', 'proses', 'selesai') DEFAULT 'belum',
    last_login TIMESTAMP NULL,
    FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE SET NULL
);

-- 4. Tabel Pertanyaan (Ditambahkan Kategori sesuai SRSSDL)
CREATE TABLE pertanyaan (
    id INT PRIMARY KEY AUTO_INCREMENT,
    isi_pertanyaan TEXT,
    -- Kategori berdasarkan 5 area SRSSDL dalam dokumen Williamson [cite: 83-89]
    kategori ENUM(
        'Awareness', 
        'Learning strategies', 
        'Learning activities', 
        'Evaluation', 
        'Interpersonal skills'
    ) NOT NULL,
    tipe_soal ENUM('pilihan_ganda', 'essay') DEFAULT 'pilihan_ganda',
    bobot_persentase DECIMAL(5,2)
);

-- Tabel Scope Pertanyaan (Sudah termasuk id_angkatan)
CREATE TABLE pertanyaan_scope (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pertanyaan INT,
    id_sekolah INT,
    id_angkatan INT,
    id_kejuruan INT,
    id_kelas INT,
    FOREIGN KEY (id_pertanyaan) REFERENCES pertanyaan(id) ON DELETE CASCADE,
    FOREIGN KEY (id_sekolah) REFERENCES sekolah(id) ON DELETE SET NULL,
    FOREIGN KEY (id_angkatan) REFERENCES angkatan(id) ON DELETE SET NULL,
    FOREIGN KEY (id_kejuruan) REFERENCES kejuruan(id) ON DELETE SET NULL,
    FOREIGN KEY (id_kelas) REFERENCES kelas(id) ON DELETE SET NULL
);

-- 5. Tabel Respon (Data Jawaban)
CREATE TABLE respon (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pelajar INT,
    id_pertanyaan INT,
    skor_poin TINYINT CHECK (skor_poin BETWEEN 1 AND 5), 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pelajar) REFERENCES pelajar(id) ON DELETE CASCADE,
    FOREIGN KEY (id_pertanyaan) REFERENCES pertanyaan(id) ON DELETE CASCADE,
    UNIQUE KEY unique_respon (id_pelajar, id_pertanyaan) 
);

-- 6. Hasil Survey (Interpretasi skor berdasarkan dokumen Williamson )
CREATE TABLE hasil_survey (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_pelajar INT UNIQUE,
    total_skor INT,
    -- Level berdasarkan scoring range SRSSDL 
    level_sdness ENUM('Low', 'Moderate', 'High'),
    diselesaikan_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_pelajar) REFERENCES pelajar(id) ON DELETE CASCADE
);