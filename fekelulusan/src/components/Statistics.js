import { Doughnut } from 'react-chartjs-2';

export default function Statistics({ data }) {
  const chartData = {
    labels: ['Lulus', 'Tidak Lulus'],
    datasets: [{
      data: [data.lulus, data.tidak_lulus],
      backgroundColor: ['#4CAF50', '#F44336']
    }]
  };

  return (
    <div className="p-4 shadow mb-4">
      <h3 className="mb-3">Statistik Kelulusan</h3>
      <Doughnut data={chartData} />
    </div>
  );
}