import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Page components
import Landing from './pages/participant/Landing'
import RegistrasiSiswa from './pages/participant/RegistrasiSiswa'
import IsiSurvey from './pages/participant/IsiSurvey'
import SurveySelesai from './pages/participant/SurveySelesai'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Sekolah from './pages/admin/Sekolah'
import Kejuruan from './pages/admin/Kejuruan'
import Kelas from './pages/admin/Kelas'
import BankSoal from './pages/admin/BankSoal'
import DataSiswa from './pages/admin/DataSiswa'
import LaporanHasil from './pages/admin/LaporanHasil'
import Pengaturan from './pages/admin/Pengaturan'

// Layout components
import AdminLayout from './components/layouts/AdminLayout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/survey/registrasi" element={<RegistrasiSiswa />} />
          <Route path="/survey/mulai" element={<IsiSurvey />} />
          <Route path="/survey/soal" element={<IsiSurvey />} />
          <Route path="/survey/selesai" element={<SurveySelesai />} />

          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Login />} />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="master-data/sekolah" element={<Sekolah />} />
            <Route path="master-data/kejuruan" element={<Kejuruan />} />
            <Route path="master-data/kelas" element={<Kelas />} />
            <Route path="data-siswa" element={<DataSiswa />} />
            <Route path="laporan" element={<LaporanHasil />} />
            <Route path="bank-soal" element={<BankSoal />} />
            <Route path="pengaturan" element={<Pengaturan />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
