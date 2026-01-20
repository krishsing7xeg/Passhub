import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import QRScanner from '../../components/security/QRScanner';
import ScanLog from '../../components/security/ScanLog';
import StatsCard from '../../components/security/StatsCard';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/security/dashboard').then(res => {
      setStats(res.data.todayStats);
      setLogs(res.data.recentScans);
    });
  }, []);

  const handleScan = async (qrCode) => {
    try {
      await api.post('/security/scan-pass', { qrCode });
      alert('Scan successful!');
    } catch (err) {
      alert('Error: ' + err.response?.data?.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Security Dashboard</h1>
      <QRScanner onScan={handleScan} />
      {stats && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <StatsCard title="Total Scans Today" value={stats.totalScans} />
          <StatsCard title="Valid Scans" value={stats.validScans} />
        </div>
      )}
      <ScanLog logs={logs} />
    </div>
  );
};

export default Dashboard;