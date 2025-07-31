import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle, Loader2, ExternalLink, Hash } from "lucide-react";

function VerifyByQr() {
  const { hash } = useParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch verification result from backend
    async function fetchStatus() {
      setLoading(true);
      setResult(null);
      setError("");
      try {
        const res = await axios.get(
          `http://localhost:5000/api/certificate/verify/${hash}`
        );
        setResult(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Gagal memverifikasi sertifikat"
        );
      } finally {
        setLoading(false);
      }
    }

    if (hash) fetchStatus();
  }, [hash]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow rounded-lg max-w-md w-full p-8 border">
        <div className="flex flex-col items-center">
          <img
            src="/img/logo-unismuh.jpg"
            alt="Logo"
            className="h-16 mb-3"
            style={{ objectFit: "contain" }}
          />
          <h1 className="text-xl font-bold mb-4 text-center">
            Verifikasi Sertifikat Blockchain
          </h1>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center gap-2 my-10">
              <Loader2 className="animate-spin text-blue-500" size={32} />
              <span className="text-gray-500">Memeriksa status sertifikat...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="flex flex-col items-center gap-2 my-10">
              <XCircle className="text-red-500" size={36} />
              <div className="text-red-600 text-center">{error}</div>
            </div>
          )}

          {/* Result State */}
          {result && !loading && (
            <div className="w-full">
              {result.valid ? (
                <div className="flex flex-col items-center mb-4">
                  <CheckCircle className="text-green-600" size={40} />
                  <h2 className="text-lg font-semibold mt-2 text-green-700">
                    SERTIFIKAT VALID
                  </h2>
                  <p className="text-gray-600 mt-1 text-center">
                    Sertifikat ini terdaftar di blockchain dan terverifikasi.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center mb-4">
                  <XCircle className="text-red-500" size={40} />
                  <h2 className="text-lg font-semibold mt-2 text-red-700">
                    SERTIFIKAT TIDAK VALID
                  </h2>
                  <p className="text-gray-600 mt-1 text-center">
                    Sertifikat ini tidak ditemukan atau tidak terdaftar di blockchain.
                  </p>
                </div>
              )}

              <div className="mt-4 mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <Hash size={18} className="text-gray-500" />
                  <span className="font-mono text-xs break-all">{hash}</span>
                </div>
                {result.valid && (
                  <>
                    <div className="mt-2">
                      <span className="font-medium">Nama:</span> {result.Nama}
                    </div>
                    <div>
                      <span className="font-medium">NIM:</span> {result.NIM}
                    </div>
                    <div>
                      <span className="font-medium">Jurusan:</span> {result.Jurusan}
                    </div>
                    <div>
                      <span className="font-medium">Issuer:</span> {result.issuer}
                    </div>
                    <div className="mt-2 flex items-center gap-1">
                      <ExternalLink size={15} className="text-blue-500" />
                      <a
                        href={result.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline break-all"
                      >
                        Lihat File di IPFS
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyByQr;
