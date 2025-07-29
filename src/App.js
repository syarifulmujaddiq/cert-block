import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import GenerateCertificateForm from './components/GenerateCertificateForm';
import VerifyCertificateByFile from './components/VerifyCertificateByFile';
import VerifyByHash from './components/VerifyByHash'; // Buat/Import komponen ini

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [menu, setMenu] = useState('generate');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setMenu('generate');
  };

  return (
    <Router>
      <Routes>
        {/* Route publik untuk verifikasi via hash (scan QR) */}
        <Route path="/verify/:hash" element={<VerifyByHash />} />

        {/* Route utama (login & admin) */}
        <Route
          path="*"
          element={
            !loggedIn ? (
              <LoginForm onLogin={() => setLoggedIn(true)} />
            ) : (
              <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <h1>Sistem Sertifikat Blockchain</h1>
                <button onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
                <nav style={{ marginBottom: 24 }}>
                  <button onClick={() => setMenu('generate')}>Generate Sertifikat</button>
                  <button onClick={() => setMenu('verify')}>Verifikasi Sertifikat</button>
                </nav>
                {menu === 'generate' && <GenerateCertificateForm />}
                {menu === 'verify' && <VerifyCertificateByFile />}
              </div>
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
