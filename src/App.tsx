import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, TrendingUp, BarChart3, Bell, Search } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import './index.css';
import { Marketers, initialMarketers } from './pages/Marketers';
import { Reports } from './pages/Reports';

// Layout Component
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <TrendingUp size={28} />
          <span>AdsManager</span>
        </div>

        <nav className="flex-col" style={{ flex: 1 }}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <LayoutDashboard size={20} /> Tổng quan
          </Link>
          <Link to="/marketers" className={`nav-link ${location.pathname === '/marketers' ? 'active' : ''}`}>
            <Users size={20} /> Marketer
          </Link>
          <Link to="/reports" className={`nav-link ${location.pathname === '/reports' ? 'active' : ''}`}>
            <BarChart3 size={20} /> Báo cáo
          </Link>
        </nav>

        <div className="mt-auto">
          <Link to="/settings" className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}>
            <Settings size={20} /> Cài đặt
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header animate-fade-in">
          <h2>Tổng quan</h2>
          <div className="flex items-center gap-4">
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Tìm chiến dịch..."
                style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', outline: 'none' }}
              />
            </div>
            <button className="btn" style={{ position: 'relative', border: '1px solid var(--border)', borderRadius: '50%', padding: '0.5rem' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: 0, right: 0, width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%' }}></span>
            </button>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              AD
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

// Mock data for charts
const performanceData = [
  { name: 'Mon', spend: 450, messages: 240, costPerMsg: 1.87, reach: 45000, cpm: 10.0, ctr: 1.8, freq: 1.2, thruPlay: 2100 },
  { name: 'Tue', spend: 520, messages: 290, costPerMsg: 1.79, reach: 52000, cpm: 10.0, ctr: 2.1, freq: 1.3, thruPlay: 2400 },
  { name: 'Wed', spend: 610, messages: 380, costPerMsg: 1.60, reach: 68000, cpm: 8.97, ctr: 2.5, freq: 1.4, thruPlay: 3100 },
  { name: 'Thu', spend: 730, messages: 450, costPerMsg: 1.62, reach: 75000, cpm: 9.73, ctr: 2.3, freq: 1.5, thruPlay: 3500 },
  { name: 'Fri', spend: 810, messages: 520, costPerMsg: 1.55, reach: 88000, cpm: 9.20, ctr: 2.7, freq: 1.6, thruPlay: 4200 },
  { name: 'Sat', spend: 950, messages: 680, costPerMsg: 1.39, reach: 110000, cpm: 8.63, ctr: 3.2, freq: 1.8, thruPlay: 5100 },
  { name: 'Sun', spend: 1100, messages: 820, costPerMsg: 1.34, reach: 135000, cpm: 8.14, ctr: 3.5, freq: 1.9, thruPlay: 6300 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: 'var(--surface)', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)', minWidth: '200px' }}>
        <p style={{ fontWeight: '600', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>{label}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.875rem' }}>
          <div><span style={{ color: 'var(--text-muted)' }}>Chi tiêu:</span> ${data.spend}</div>
          <div><span style={{ color: 'var(--text-muted)' }}>Tin nhắn:</span> {data.messages}</div>
          <div><span style={{ color: 'var(--text-muted)' }}>Phí/Tin:</span> ${data.costPerMsg}</div>
          <div><span style={{ color: 'var(--text-muted)' }}>Tiếp cận:</span> {(data.reach / 1000).toFixed(1)}k</div>
          <div><span style={{ color: 'var(--text-muted)' }}>CPM:</span> ${data.cpm}</div>
          <div><span style={{ color: 'var(--text-muted)' }}>CTR:</span> {data.ctr}%</div>
          <div><span style={{ color: 'var(--text-muted)' }}>Tần suất:</span> {data.freq}</div>
          <div><span style={{ color: 'var(--text-muted)' }}>ThruPlay:</span> {data.thruPlay}</div>
        </div>
      </div>
    );
  }
  return null;
};

// Dashboard Content
const Dashboard = () => {
  const activeCampaigns = initialMarketers.flatMap(m => m.campaigns);

  const aggregatedStats = activeCampaigns.reduce((acc, c) => {
    acc.spend += c.spend;
    acc.messages += c.messages;
    acc.reach += c.reach;
    acc.thruPlay += c.thruPlay;
    return acc;
  }, { spend: 0, messages: 0, reach: 0, thruPlay: 0 });

  const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

  const costPerMsg = aggregatedStats.messages > 0 ? aggregatedStats.spend / aggregatedStats.messages : 0;
  const cpm = aggregatedStats.reach > 0 ? (aggregatedStats.spend / aggregatedStats.reach) * 1000 : 0;
  const avgCtr = activeCampaigns.reduce((acc, c) => acc + c.ctr, 0) / (activeCampaigns.length || 1);
  const avgFreq = activeCampaigns.reduce((acc, c) => acc + c.freq, 0) / (activeCampaigns.length || 1);

  return (
    <div className="animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ marginBottom: '2rem' }}>
        <div className="card stat-card">
          <div className="stat-label flex items-center gap-2"><TrendingUp size={16} /> Tổng Chi Tiêu</div>
          <div className="stat-value">{formatCurrency(aggregatedStats.spend)}</div>
          <div className="stat-change positive"><span>+14.5% sv tháng trước</span></div>
        </div>
        <div className="card stat-card">
          <div className="stat-label flex items-center gap-2"><Bell size={16} /> Số Tin Nhắn</div>
          <div className="stat-value">{formatNumber(aggregatedStats.messages)}</div>
          <div className="stat-change positive"><span>+22.1% sv tháng trước</span></div>
        </div>
        <div className="card stat-card">
          <div className="stat-label flex items-center gap-2"><BarChart3 size={16} /> Chi Phí / Tin Nhắn</div>
          <div className="stat-value">{formatCurrency(costPerMsg)}</div>
          <div className="stat-change positive"><span>-12.4% sv tháng trước</span></div>
        </div>
        <div className="card stat-card">
          <div className="stat-label flex items-center gap-2"><Users size={16} /> Tổng Tiếp Cận</div>
          <div className="stat-value">{formatNumber(aggregatedStats.reach)}</div>
          <div className="stat-change positive"><span>+8.2% sv tháng trước</span></div>
        </div>

        {/* New 4 Cards */}
        <div className="card stat-card">
          <div className="stat-label">CPM (Phí / 1k hiển thị)</div>
          <div className="stat-value">{formatCurrency(cpm)}</div>
          <div className="stat-change negative"><span>+4.1% sv tháng trước</span></div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Tỉ Lệ Click (CTR)</div>
          <div className="stat-value">{avgCtr.toFixed(2)}%</div>
          <div className="stat-change positive"><span>+0.5% sv tháng trước</span></div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Tần Suất</div>
          <div className="stat-value">{avgFreq.toFixed(2)}</div>
          <div className="stat-change negative"><span>+0.2 sv tháng trước</span></div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Lượt Xem Video (ThruPlay)</div>
          <div className="stat-value">{formatNumber(aggregatedStats.thruPlay)}</div>
          <div className="stat-change positive"><span>+18.4% sv tháng trước</span></div>
        </div>
      </div>

      <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="flex justify-between items-center" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem' }}>Hiệu Quả Marketer (7 Ngày Qua)</h3>
          <Link to="/marketers" className="btn btn-primary">Quản Lý Marketer</Link>
        </div>
        <div style={{ height: '350px', width: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={performanceData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dx={-10} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dx={10} />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Line yAxisId="left" type="monotone" dataKey="spend" name="Chi Tiêu ($)" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--surface)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="messages" name="Tin Nhắn" stroke="var(--secondary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--surface)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="thruPlay" name="ThruPlay" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: 'var(--surface)', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/marketers" element={<Marketers />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<div className="animate-fade-in"><h2>Cài đặt</h2><p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Cấu hình phần mềm.</p></div>} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
