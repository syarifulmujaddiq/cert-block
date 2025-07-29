import React, { useState } from 'react';
import axios from 'axios';

function GenerateCertificateForm() {
  const [form, setForm] = useState({ nama: '', nim: '', jurusan: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const token = localStorage.getItem('token'); // ambil token dari localStorage
      const res = await axios.post(
        'http://localhost:5000/api/certificate/generate',
        form,
        {
          headers: { Authorization: `Bearer ${token}` }
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
    <div style={{maxWidth: 500, margin: "0 auto"}}>
      <h2>Generate Sertifikat</h2>
      <form onSubmit={handleSubmit}>
        <input name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} required /><br />
        <input name="nim" placeholder="NIM" value={form.nim} onChange={handleChange} required /><br />
        <input name="jurusan" placeholder="Jurusan" value={form.jurusan} onChange={handleChange} required /><br />
        <button type="submit" disabled={loading}>{loading ? "Memproses..." : "Generate"}</button>
      </form>
      {error && <div style={{color: 'red', marginTop: 8}}>{error}</div>}
      {result && (
        <div style={{marginTop: 16}}>
          <div><b>Berhasil!</b></div>
          <div>Hash: {result.hash}</div>
          <div>
            <a href={result.ipfsUrl} target="_blank" rel="noopener noreferrer">Lihat di IPFS</a>
          </div>
          <div>
            <a href={`http://localhost:5000${result.downloadUrl}`} target="_blank" rel="noopener noreferrer">Download Sertifikat (PDF)</a>
          </div>
        </div>
      )}
    </div>
  );
}

export default GenerateCertificateForm;
