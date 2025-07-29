import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function VerifyByHash() {
  const { hash } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(`http://localhost:5000/api/certificate/verify/${hash}`);
        setResult(res.data);
      } catch {
        setError('Hash tidak ditemukan atau server error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [hash]);

  if (loading) return <div>Mengecek sertifikat...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ maxWidth: 500, margin: '50px auto', border: '1px solid #ddd', padding: 32, borderRadius: 8 }}>
      <h2>Status Sertifikat</h2>
      {result.valid ? (
        <div style={{ color: 'green' }}>
          <b>VALID ✅</b>
          <div>Nama: {result.Nama}</div>
          <div>NIM: {result.NIM}</div>
          <div>Jurusan: {result.Jurusan}</div>
          <div>
            <a href={result.ipfsUrl} target="_blank" rel="noopener noreferrer">Lihat Sertifikat di IPFS</a>
          </div>
        </div>
      ) : (
        <div style={{ color: 'red' }}>
          <b>TIDAK VALID ❌</b>
          <div>Sertifikat tidak ditemukan atau tidak valid.</div>
        </div>
      )}
    </div>
  );
}

export default VerifyByHash;
