import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faHome, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import './App.css';
// import '../src/scss/styles.scss';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  // const handleSearch = async (e) => {
  //   e.preventDefault();
  //   const inputNISN = e.target.nisn.value.trim();
    
  //   if (!inputNISN) {
  //     setError('NISN tidak boleh kosong');
  //     return;
  //   }

  //   if (!/^\d+$/.test(inputNISN)) {
  //     setError('NISN harus berupa angka');
  //     return;
  //   }

  //   navigate(`/result/${inputNISN}`);
  // };

  const handleSearch = async (e) => {
    e.preventDefault();
    const nisn = e.target.nisn.value;
  
    if (!nisn) {
      setError('NISN tidak boleh kosong');
      return;
    }
  
    try {
      // const response = await axios.get(`http://127.0.0.1:8000/api/siswa/?nisn=${nisn}`);
      const response = await axios.get(`http://localhost:8000/api/siswa/?nisn=${nisn}`);
      if (response.data) {
        navigate(`/result/${nisn}`);
      } else {
        setError('Siswa dengan NISN tersebut tidak ditemukan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data');
    }
  };

  return (
    <div className="bg-primary min-vh-100 d-flex align-items-center">
      <div className="container">
        <div className="text-center">
          <h1 className="display-1 fw-bold text-white mb-4">
            <span className="text-light">SKL</span>{' '}
            <span className="text-warning">Online</span>
          </h1>
          <div className="card p-4">
            <h2 className="h4 fw-bold mb-3">Cek Informasi Kelulusan</h2>
            <p className="text-muted mb-4">Silahkan masukkan NISN anda</p>
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  name="nisn"
                  className="form-control"
                  placeholder="NISN"
                  aria-label="NISN"
                  required
                />
                <button className="btn btn-warning" type="submit">
                  CARI
                </button>
              </div>
              {error && (
                <div className="mt-3 alert alert-danger">
                  {error}
                </div>
              )}
            </form>
          </div>
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
      <div className="bg-primary min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-white h4">Memuat data...</div>
      </div>
    );
  }

  if (error || !siswa) {
    return (
      <div className="bg-primary min-vh-100 d-flex align-items-center justify-content-center">
      <div className="bg-white p-4 rounded shadow-lg max-w-md text-center">
        <div className="text-danger mb-4 d-flex flex-column align-items-center">
          <FontAwesomeIcon icon={faExclamationCircle} className="text-danger mb-2" style={{ fontSize: '2.5rem' }} />
          <p className="h5">{error}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary px-4 py-2"
        >
          <FontAwesomeIcon icon={faHome} className="me-2" />
          Kembali ke Beranda
        </button>
      </div>
    </div>
    );
  }

  return (
    <div className="bg-primary min-vh-100 d-flex align-items-center py-4">
      <div className="container">
        <div className="card shadow-lg">
          <div className="card-header bg-warning">
            <h1 className="h2 fw-bold text-center text-white mb-0">INFORMASI KELULUSAN</h1>
          </div>
          
          <div className="card-body">
            <div className="row g-4">
              {/* Kolom Foto */}
              <div className="col-md-4 text-center">
                <div className="card h-100 border-warning">
                  <div className="card-body">
                    {siswa.foto && (
                      <img
                        src={`${siswa.foto}`}
                        alt="Foto Siswa"
                        className="img-fluid rounded-circle shadow-sm border border-warning"
                        style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <h2 className="h4 fw-bold mt-3 mb-0">{siswa.nama}</h2>
                    <p className="text-muted">NISN: {siswa.nisn}</p>
                  </div>
                </div>
              </div>

              {/* Kolom Informasi */}
              <div className="col-md-8">
                <div className="row g-4">
                  {/* Tanggal Lahir */}
                  <div className="col-12">
                    <div className="card h-100">
                      <div className="card-header bg-light">
                        <h3 className="h5 fw-bold mb-0">📅 Tanggal Lahir</h3>
                      </div>
                      <div className="card-body">
                        <p className="display-6 text-center text-primary mb-0">
                          {new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Kelulusan */}
                  <div className="col-12">
                    <div className={`card h-100 border-3 ${
                      siswa.status === 'LULUS' ? 'border-success' : 'border-danger'
                    }`}>
                      <div className="card-header bg-white">
                        <h3 className="h5 fw-bold mb-0">🎓 Status Kelulusan</h3>
                      </div>
                      <div className={`card-body text-center py-4 ${
                        siswa.status === 'LULUS' ? 'bg-success' : 'bg-danger'
                      }`}>
                        <div className="display-3 fw-bold text-white">
                          {siswa.status}
                          {siswa.status === 'LULUS' ? 
                            <span className="ms-2">🎉</span> : 
                            <span className="ms-2">😞</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="card-footer bg-light">
            <div className="d-flex flex-column flex-md-row justify-content-center gap-3">
              <button
                onClick={handlePrint}
                className="btn btn-warning btn-lg px-5 py-2"
              >
                <FontAwesomeIcon icon={faPrint} className="me-2" />
                Cetak SKL
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn btn-outline-primary btn-lg px-5 py-2"
              >
                <FontAwesomeIcon icon={faHome} className="me-2" />
                Kembali ke Beranda
              </button>
            </div>
          </div>
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