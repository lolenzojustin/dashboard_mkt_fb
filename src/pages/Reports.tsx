import { useState } from 'react';
import { BarChart3, Download, Filter, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

// Mock detailed report data
const campaignData = [
    { id: 'C-001', name: 'Spring Sale 2026', marketer: 'Nguyen Van A', spend: 4500, messages: 1200, costPerMsg: 3.75, reach: 450000, cpm: 10.0, ctr: 2.1, freq: 1.2, thruPlay: 12500 },
    { id: 'C-002', name: 'Retargeting Cart', marketer: 'Tran Thi B', spend: 3200, messages: 950, costPerMsg: 3.36, reach: 120000, cpm: 26.6, ctr: 3.5, freq: 2.1, thruPlay: 8400 },
    { id: 'C-003', name: 'Brand Awareness Q1', marketer: 'Tran Thi B', spend: 8500, messages: 450, costPerMsg: 18.88, reach: 850000, cpm: 10.0, ctr: 1.1, freq: 1.1, thruPlay: 45000 },
    { id: 'C-004', name: 'Lookalike High LTV', marketer: 'Hoang To E', spend: 4100, messages: 680, costPerMsg: 6.02, reach: 145000, cpm: 28.2, ctr: 2.8, freq: 1.4, thruPlay: 15200 },
    { id: 'C-005', name: 'App Install Asia', marketer: 'Le Van C', spend: 1200, messages: 110, costPerMsg: 10.90, reach: 35000, cpm: 34.2, ctr: 0.9, freq: 1.0, thruPlay: 2100 },
    { id: 'C-006', name: 'Black Friday Teaser', marketer: 'Pham Minh D', spend: 9500, messages: 2100, costPerMsg: 4.52, reach: 520000, cpm: 18.2, ctr: 4.1, freq: 2.5, thruPlay: 88000 },
    { id: 'C-007', name: 'Flash Sale Local', marketer: 'Pham Minh D', spend: 1500, messages: 450, costPerMsg: 3.33, reach: 85000, cpm: 17.6, ctr: 3.8, freq: 1.8, thruPlay: 4500 }
];

const marketerPerformanceData = [
    { name: 'N. Van A', roas: 3.0, cpm: 10.0 },
    { name: 'T. Thi B', roas: 4.5, cpm: 15.2 },
    { name: 'H. To E', roas: 2.1, cpm: 28.2 },
    { name: 'L. Van C', roas: 0.8, cpm: 34.2 },
    { name: 'P. Minh D', roas: 3.8, cpm: 18.1 },
];

export const Reports = () => {
    const [dateRange] = useState('30 Ngày Qua');

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    };

    const formatNumber = (value: number) => {
        return new Intl.NumberFormat('en-US').format(value);
    };

    return (
        <div className="animate-fade-in">
            <div className="header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h2>Báo Cáo Chi Tiết</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Phân tích chuyên sâu về hiệu quả chiến dịch và chỉ số Ads.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button className="btn" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                        <Calendar size={18} />
                        {dateRange === 'Last 30 Days' ? '30 Ngày Qua' : dateRange}
                    </button>
                    <button className="btn btn-primary">
                        <Download size={18} />
                        Xuất Báo Cáo
                    </button>
                </div>
            </div>

            {/* Top Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BarChart3 size={20} className="text-primary" style={{ color: 'var(--primary)' }} />
                        So Sánh ROAS
                    </h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marketerPerformanceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                                    cursor={{ fill: 'var(--background)' }}
                                />
                                <Bar dataKey="roas" name="ROAS (Lần)" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BarChart3 size={20} className="text-secondary" style={{ color: 'var(--secondary)' }} />
                        Chi Phí / Tin Nhắn
                    </h3>
                    <div style={{ height: '300px', width: '100%' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={marketerPerformanceData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' }}
                                    cursor={{ fill: 'var(--background)' }}
                                />
                                <Bar dataKey="cpm" name="Phí/Tin ($)" fill="var(--secondary)" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Campaign Data Table */}
            <div className="card">
                <div className="flex justify-between items-center" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1.125rem' }}>Chi Tiết Chiến Dịch</h3>
                    <button className="btn" style={{ border: '1px solid var(--border)', fontSize: '0.875rem', padding: '0.4rem 0.75rem' }}>
                        <Filter size={16} />
                        Lọc data
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Chiến dịch</th>
                                <th>Marketer</th>
                                <th>Tổng Chi Tiêu</th>
                                <th>Tin Nhắn</th>
                                <th>Phí/Tin</th>
                                <th>Tiếp Cận</th>
                                <th>CPM</th>
                                <th>CTR</th>
                                <th>Tần suất</th>
                                <th>ThruPlay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {campaignData.map((campaign) => (
                                <tr key={campaign.id}>
                                    <td>
                                        <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{campaign.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{campaign.id}</div>
                                    </td>
                                    <td>{campaign.marketer}</td>
                                    <td style={{ fontWeight: '500' }}>{formatCurrency(campaign.spend)}</td>
                                    <td>{formatNumber(campaign.messages)}</td>
                                    <td>{formatCurrency(campaign.costPerMsg)}</td>
                                    <td>{formatNumber(campaign.reach)}</td>
                                    <td>{formatCurrency(campaign.cpm)}</td>
                                    <td>{campaign.ctr.toFixed(2)}%</td>
                                    <td>{campaign.freq.toFixed(2)}</td>
                                    <td>{formatNumber(campaign.thruPlay)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
