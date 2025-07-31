import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LogOut, Eraser } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import LoginForm from './components/LoginForm';
import GenerateCertificateForm from './components/GenerateCertificateForm';
import VerifyCertificateByFile from './components/VerifyCertificateByFile';
import VerifyByQr from './components/VerifyByQr';



function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));
  const [activeTab, setActiveTab] = useState('generate');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    setActiveTab('generate');
  };

  const handleClearForm = () => {
    if (activeTab === 'generate') {
      window.dispatchEvent(new CustomEvent('clearGenerateForm'));
    } else if (activeTab === 'verify') {
      window.dispatchEvent(new CustomEvent('clearVerifyForm'));
    }
  };

  const handleSubmitForm = () => {
    const form = document.querySelector('form');
    if (form) {
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
    }
  };

  const TabContent = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src='/img/logo-unismuh.jpg' alt='logo unismuh' className='h-14' />
            <h1 className="text-xl font-semibold text-gray-800">Manajemen Sertifikat</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center text-white hover:bg-red-800 transition-colors bg-red-700 p-2 rounded-lg text-sm"
          >
            <LogOut size={16} className="mr-2" />
            Keluar
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm">

          {/* Tab Navigation */}
          <div className="px-6 py-4 border-b">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'generate'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Buat Sertifikat
              </button>
              <button
                onClick={() => setActiveTab('verify')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeTab === 'verify'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Verifikasi Sertifikat
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'generate' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Buat Sertifikat Baru</h2>
                  <p className="text-gray-600 text-sm">Isi detail sertifikat untuk membuat sertifikat blockchain baru</p>
                </div>
                <GenerateCertificateForm />
              </div>
            )}

            {activeTab === 'verify' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Verifikasi Sertifikat</h2>
                  <p className="text-gray-600 text-sm">Unggah sertifikat PDF untuk memverifikasi keasliannya di blockchain</p>
                </div>
                <VerifyCertificateByFile />
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center">
              <button
                onClick={handleClearForm}
                className="px-4 py-2 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Eraser size={16} />
                Bersihkan
              </button>
              <div className="flex space-x-3">
                <button
                  onClick={handleSubmitForm}
                  className="px-6 py-2 bg-blue-800 text-white rounded-md hover:bg-blue-900 transition-colors flex items-center"
                >
                  {activeTab === 'generate' ? 'Buat' : 'Verifikasi'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
          loading: {
            duration: Infinity,
            iconTheme: {
              primary: '#3b82f6',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        {/* Route publik untuk verifikasi via hash (scan QR) */}
        <Route path="/verify/:hash" element={<VerifyByQr />} />

        {/* Route utama (login & admin) */}
        <Route
          path="*"
          element={
            !loggedIn ? (
              <LoginForm onLogin={() => setLoggedIn(true)} />
            ) : (
              <TabContent />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
