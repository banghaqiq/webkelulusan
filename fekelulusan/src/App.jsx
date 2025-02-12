import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faHome, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import './App.css';

function HomePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    const inputNISN = e.target.nisn.value.trim();
    
    if (!inputNISN) {
      setError('NISN tidak boleh kosong');
      return;
    }

    if (!/^\d+$/.test(inputNISN)) {
      setError('NISN harus berupa angka');
      return;
    }

    navigate(`/result/${inputNISN}`);
  };

  return (
    <div className="bg-blue-500 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-8">
          <span className="text-blue-200">SKL</span>{' '}
          <span className="text-yellow-400">Online</span>
        </h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">Cek Informasi Kelulusan</h2>
          <p className="text-gray-600 mb-6">Silahkan masukkan NISN anda</p>
          
          <form onSubmit={handleSearch}>
            <div className="flex flex-col gap-2">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <input
                  type="text"
                  name="nisn"
                  placeholder="Contoh: 1234567890"
                  className="flex-grow p-2 outline-none"
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '');
                    setError('');
                  }}
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 hover:bg-green-600 transition-colors"
                >
                  CARI
                </button>
              </div>
              {error && (
                <div className="text-red-500 text-sm flex items-center gap-1">
                  <FontAwesomeIcon icon={faExclamationCircle} />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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
        
        if (response.data.length === 0) {
          setError(`Siswa dengan NISN ${nisn} tidak ditemukan`);
          return;
        }

        const siswaData = response.data[0];
        
        // Validasi kesesuaian NISN
        if (siswaData.nisn !== nisn) {
          setError('NISN tidak sesuai dengan data siswa');
          return;
        }

        setSiswa(siswaData);
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
    return (
      <div className="bg-blue-500 min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Memuat data...</div>
      </div>
    );
  }

  if (error || !siswa) {
    return (
      <div className="bg-blue-500 min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <div className="text-red-500 mb-4 flex flex-col items-center">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-4xl mb-2" />
            <p className="text-lg">{error}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Kembali ke Beranda
          </button>
        </div>
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
                src={`${siswa.foto}`}
                style={{ width: '85px', height: '113px' }}
                alt="Foto Siswa"
                className="w-48 h-48 rounded-full object-cover mb-4 border-4 border-blue-200"
              />
            )}
            <h2 className="text-2xl font-bold text-center mb-2">{siswa.nama}</h2>
            <p className="text-gray-600">NISN: {siswa.nisn}</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Tanggal Lahir</h3>
              <p className="text-gray-700">
                {new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">Status Kelulusan</h3>
              <div className={`p-2 rounded-lg ${
                siswa.status === 'LULUS' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
                }`}>
                <span className="font-bold">{siswa.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={handlePrint}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-all"
          >
            <FontAwesomeIcon icon={faPrint} className="mr-2" />
            Cetak SKL
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-all"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result/:nisn" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;