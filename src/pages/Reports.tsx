import { useState } from 'react';
import { BarChart3, Download, Filter, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { initialMarketers } from './Marketers';

export const Reports = () => {
    const [dateRange] = useState('30 Ngày Qua');

    // Aggregate data dynamically from Marketers mock data
    const activeCampaigns = initialMarketers.flatMap(m => m.campaigns.map(c => ({
        ...c,
        marketer: m.name
    })));

    const marketerPerformanceData = initialMarketers.map(m => {
        const spend = m.campaigns.reduce((acc, c) => acc + (c.spend || 0), 0);
        const revenue = m.campaigns.reduce((acc, c) => acc + (c.revenue || 0), 0);
        const reach = m.campaigns.reduce((acc, c) => acc + (c.reach || 0), 0);

        return {
            name: m.name.split(' ').slice(-2).join(' '), // Short name e.g "Van A"
            roas: spend > 0 ? Number((revenue / spend).toFixed(2)) : 0,
            cpm: reach > 0 ? Number(((spend / reach) * 1000).toFixed(2)) : 0
        };
    }).filter(m => m.roas > 0 || m.cpm > 0); // Only show marketers with data

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
                                <th>Chi Tiêu/Leads/Mess</th>
                                <th>Đơn/Doanh Thu</th>
                                <th>ROAS</th>
                                <th>Tỉ lệ ra Lead</th>
                                <th>Giá/Mess/Lead/Đơn</th>
                                <th>Tiếp Cận (CPM)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activeCampaigns.map((campaign) => (
                                <tr key={campaign.id}>
                                    <td>
                                        <div style={{ fontWeight: '500', color: 'var(--text-main)' }}>{campaign.name}</div>
                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{campaign.id}</div>
                                    </td>
                                    <td>{campaign.marketer}</td>
                                    <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{formatCurrency(campaign.spend || 0)}</td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem' }}><span style={{ color: 'var(--text-muted)' }}>M:</span> {formatNumber(campaign.messages || 0)}</div>
                                        <div style={{ fontSize: '0.875rem' }}><span style={{ color: 'var(--text-muted)' }}>L:</span> {formatNumber(campaign.leads || 0)}</div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{formatNumber(campaign.orders || 0)} đơn</div>
                                        <div style={{ fontSize: '0.875rem', color: '#10B981', fontWeight: '500' }}>{formatCurrency(campaign.revenue || 0)}</div>
                                    </td>
                                    <td>
                                        <span style={{ fontWeight: '600', color: (campaign.spend || 0) > 0 && ((campaign.revenue || 0) / (campaign.spend || 0)) > 2 ? '#10B981' : 'inherit' }}>
                                            {(campaign.spend || 0) > 0 ? ((campaign.revenue || 0) / (campaign.spend || 0)).toFixed(2) : '0.00'}x
                                        </span>
                                    </td>
                                    <td>
                                        <span className="badge" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                                            {(campaign.messages || 0) > 0 ? (((campaign.leads || 0) / (campaign.messages || 0)) * 100).toFixed(1) : '0.0'}%
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>M: <span style={{ color: 'var(--text-main)' }}>{formatCurrency(campaign.costPerMsg || 0)}</span></div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>L: <span style={{ color: 'var(--text-main)' }}>{(campaign.leads || 0) > 0 ? formatCurrency((campaign.spend || 0) / (campaign.leads || 0)) : '$0'}</span></div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>O: <span style={{ color: 'var(--text-main)' }}>{(campaign.orders || 0) > 0 ? formatCurrency((campaign.spend || 0) / (campaign.orders || 0)) : '$0'}</span></div>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: '0.875rem' }}>{formatNumber(campaign.reach || 0)} <span style={{ color: 'var(--text-muted)' }}>người</span></div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CPM: {formatCurrency(campaign.cpm || 0)}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
