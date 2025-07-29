import React, { useState } from 'react';
import axios from 'axios';

function VerifyCertificateByFile() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setFile(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token'); // tambahkan ini
      const res = await axios.post(
        'http://localhost:5000/api/certificate/verify-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}` // tambahkan ini
          }
        }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <h2>Verifikasi Sertifikat (Upload PDF)</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleChange} required /><br />
        <button type="submit" disabled={loading || !file}>{loading ? "Memproses..." : "Verifikasi"}</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 16 }}>
          <div><b>Hasil:</b> {result.valid ? "VALID ✅" : "TIDAK VALID ❌"}</div>
          {result.valid && (
            <>
              <div>Hash: {result.hash}</div>
              <div>
                <a href={`https://ipfs.io/ipfs/${result.ipfsCid}`} target="_blank" rel="noopener noreferrer">
                  Lihat di IPFS
                </a>
              </div>
              <div>Issuer: {result.issuer}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default VerifyCertificateByFile;
