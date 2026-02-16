import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Page components
import Landing from './pages/participant/Landing'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Sekolah from './pages/admin/Sekolah'
import Kejuruan from './pages/admin/Kejuruan'
import Kelas from './pages/admin/Kelas'
import BankSoal from './pages/admin/BankSoal'

// Layout components
import AdminLayout from './components/layouts/AdminLayout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="master-data/sekolah" element={<Sekolah />} />
            <Route path="master-data/kejuruan" element={<Kejuruan />} />
            <Route path="master-data/kelas" element={<Kelas />} />
            <Route path="bank-soal" element={<BankSoal />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App