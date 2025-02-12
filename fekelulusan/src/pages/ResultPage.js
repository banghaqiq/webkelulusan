import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faHome } from '@fortawesome/free-solid-svg-icons';

function ResultPage() {
  const { nisn } = useParams();
  const [siswa, setSiswa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/siswa/?nisn=${nisn}`);
        if (response.data.length > 0) {
          setSiswa(response.data[0]);
        } else {
          setError('Data siswa tidak ditemukan');
        }
      } catch (err) {
        setError('Terjadi kesalahan saat mengambil data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nisn]);

  const handlePrint = () => {
    window.open(`http://localhost:8000/api/siswa/${siswa.id}/generate_skl/`, '_blank');
  };

  if (loading) {
    return <div className="text-center py-8">Memuat data...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <FontAwesomeIcon icon={faHome} /> Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6">Informasi Kelulusan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center">
            {siswa.foto && (
              <img
                src={`http://localhost:8000${siswa.foto}`}
                alt="Foto Siswa"
                className="w-48 h-48 rounded-full object-cover mb-4"
              />
            )}
            <h2 className="text-2xl font-bold">{siswa.nama}</h2>
            <p className="text-gray-600">NISN: {siswa.nisn}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Alamat</h3>
              <p className="text-gray-700">{siswa.alamat}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Status Kelulusan</h3>
              <p
                className={`text-lg font-bold ${
                  siswa.status === 'LULUS' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {siswa.status}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            <FontAwesomeIcon icon={faPrint} /> Cetak SKL
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faHome} /> Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultPage;