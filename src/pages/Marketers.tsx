import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, X, ChevronDown, ChevronRight, Edit, Loader2 } from 'lucide-react';
import { getMarketers, addMarketer, updateMarketer, deleteMarketer } from '../services/marketerService';

export interface Campaign {
    id: string;
    name: string;
    spend: number;
    messages: number;
    costPerMsg: number;
    reach: number;
    cpm: number;
    ctr: number;
    freq: number;
    thruPlay: number;
    leads: number;
    orders: number;
    revenue: number;
}

export interface Marketer {
    id: string | number;
    name: string;
    email: string;
    status: string;
    campaigns: Campaign[];
}

// Mock data for initial UI with nested campaigns
export const initialMarketers: Marketer[] = [
    {
        id: 1, name: 'Nguyen Van A', email: 'nva@example.com', status: 'Active',
        campaigns: [
            { id: 'C-001', name: 'Spring Sale 2026', spend: 4500, messages: 1200, costPerMsg: 3.75, reach: 450000, cpm: 10.0, ctr: 2.1, freq: 1.2, thruPlay: 12500, leads: 300, orders: 150, revenue: 15000 }
        ]
    },
    {
        id: 2, name: 'Tran Thi B', email: 'ttb@example.com', status: 'Active',
        campaigns: [
            { id: 'C-002', name: 'Retargeting Cart', spend: 3200, messages: 950, costPerMsg: 3.36, reach: 120000, cpm: 26.6, ctr: 3.5, freq: 2.1, thruPlay: 8400, leads: 250, orders: 100, revenue: 12000 },
            { id: 'C-003', name: 'Brand Awareness Q1', spend: 8500, messages: 450, costPerMsg: 18.88, reach: 850000, cpm: 10.0, ctr: 1.1, freq: 1.1, thruPlay: 45000, leads: 50, orders: 10, revenue: 2000 }
        ]
    },
    {
        id: 3, name: 'Hoang To E', email: 'hte@example.com', status: 'Active',
        campaigns: [
            { id: 'C-004', name: 'Lookalike High LTV', spend: 4100, messages: 680, costPerMsg: 6.02, reach: 145000, cpm: 28.2, ctr: 2.8, freq: 1.4, thruPlay: 15200, leads: 180, orders: 90, revenue: 18500 }
        ]
    },
    {
        id: 4, name: 'Le Van C', email: 'lvc@example.com', status: 'Inactive',
        campaigns: [
            { id: 'C-005', name: 'App Install Asia', spend: 1200, messages: 110, costPerMsg: 10.90, reach: 35000, cpm: 34.2, ctr: 0.9, freq: 1.0, thruPlay: 2100, leads: 20, orders: 5, revenue: 800 }
        ]
    },
    {
        id: 5, name: 'Pham Minh D', email: 'pmd@example.com', status: 'Active',
        campaigns: [
            { id: 'C-006', name: 'Black Friday Teaser', spend: 9500, messages: 2100, costPerMsg: 4.52, reach: 520000, cpm: 18.2, ctr: 4.1, freq: 2.5, thruPlay: 88000, leads: 600, orders: 350, revenue: 38000 },
            { id: 'C-007', name: 'Flash Sale Local', spend: 1500, messages: 450, costPerMsg: 3.33, reach: 85000, cpm: 17.6, ctr: 3.8, freq: 1.8, thruPlay: 4500, leads: 120, orders: 80, revenue: 4500 }
        ]
    },
];

export const Marketers = () => {
    const [marketers, setMarketers] = useState<Marketer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newForm, setNewForm] = useState({ name: '', email: '' });
    const [editForm, setEditForm] = useState<{ id: string | number, name: string, email: string } | null>(null);
    const [expandedRows, setExpandedRows] = useState<Record<string | number, boolean>>({});

    const fetchMarketers = async () => {
        setIsLoading(true);
        try {
            const data = await getMarketers();
            setMarketers(data);
        } catch (error) {
            console.error("Error fetching marketers:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMarketers();
    }, []);

    const toggleRow = (id: string | number) => {
        setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const filteredMarketers = marketers.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newForm.name || !newForm.email) return;

        try {
            const newMarketer = await addMarketer({
                name: newForm.name,
                email: newForm.email,
                status: 'Hoạt động',
                campaigns: []
            });
            setMarketers([...marketers, newMarketer]);
            setIsAddModalOpen(false);
            setNewForm({ name: '', email: '' });
        } catch (error) {
            alert('Lỗi khi thêm marketer: ' + (error as Error).message);
        }
    };

    const handleEditClick = (marketer: Marketer) => {
        setEditForm({ id: marketer.id, name: marketer.name, email: marketer.email });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editForm || !editForm.name || !editForm.email) return;

        try {
            await updateMarketer(editForm.id, {
                name: editForm.name,
                email: editForm.email
            });
            setMarketers(marketers.map(m => m.id === editForm.id ? { ...m, name: editForm.name, email: editForm.email } : m));
            setIsEditModalOpen(false);
            setEditForm(null);
        } catch (error) {
            alert('Lỗi khi cập nhật marketer: ' + (error as Error).message);
        }
    };

    const handleDelete = async (id: string | number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa marketer này không?")) return;

        try {
            await deleteMarketer(id);
            setMarketers(marketers.filter(m => m.id !== id));
        } catch (error) {
            alert('Lỗi khi xóa marketer: ' + (error as Error).message);
        }
    };

    const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

    const calculateAggregated = (campaigns: Campaign[]) => {
        if (!campaigns || campaigns.length === 0) return { spend: 0, messages: 0, costPerMsg: 0, reach: 0, cpm: 0, ctr: 0, freq: 0, thruPlay: 0, leads: 0, orders: 0, revenue: 0 };
        const spend = campaigns.reduce((acc, c) => acc + (c.spend || 0), 0);
        const messages = campaigns.reduce((acc, c) => acc + (c.messages || 0), 0);
        const reach = campaigns.reduce((acc, c) => acc + (c.reach || 0), 0);
        const thruPlay = campaigns.reduce((acc, c) => acc + (c.thruPlay || 0), 0);
        const leads = campaigns.reduce((acc, c) => acc + (c.leads || 0), 0);
        const orders = campaigns.reduce((acc, c) => acc + (c.orders || 0), 0);
        const revenue = campaigns.reduce((acc, c) => acc + (c.revenue || 0), 0);
        return {
            spend, messages, reach, thruPlay, leads, orders, revenue,
            costPerMsg: messages > 0 ? spend / messages : 0,
            cpm: reach > 0 ? (spend / reach) * 1000 : 0
        };
    };

    return (
        <div className="animate-fade-in">
            <div className="header" style={{ marginBottom: '1.5rem' }}>
                <div>
                    <h2>Quản Lý Marketer</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Quản lý đội ngũ chạy quảng cáo, theo dõi hiệu quả và phân bổ ngân sách.
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
                    <Plus size={18} />
                    Thêm Marketer
                </button>
            </div>

            <div className="card">
                {/* Toolbar */}
                <div className="flex justify-between items-center" style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.5rem 1rem 0.5rem 2.5rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border)',
                                outline: 'none'
                            }}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button className="btn" style={{ border: '1px solid var(--border)' }}>Xuất CSV</button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: '40px' }}></th>
                                <th>Marketer</th>
                                <th>Tổng Chi Tiêu</th>
                                <th>Chi Tiêu/Leads/Mess</th>
                                <th>Đơn/Doanh Thu</th>
                                <th>ROAS</th>
                                <th>Tỉ lệ ra Lead</th>
                                <th>Giá/Mess/Lead/Đơn</th>
                                <th>Tiếp cận (CPM)</th>
                                <th style={{ textAlign: 'right' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        <Loader2 className="animate-spin inline-block mr-2" size={20} style={{ verticalAlign: 'middle' }} /> Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filteredMarketers.map((marketer) => {
                                const agg = calculateAggregated(marketer.campaigns);
                                const isExpanded = expandedRows[marketer.id];

                                return (
                                    <React.Fragment key={marketer.id}>
                                        <tr style={{ cursor: 'pointer', backgroundColor: isExpanded ? 'rgba(79, 70, 229, 0.03)' : 'inherit' }} onClick={() => toggleRow(marketer.id)}>
                                            <td style={{ padding: '1rem 0.5rem', color: 'var(--text-muted)' }}>
                                                {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-4">
                                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#E0E7FF', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', fontSize: '1.1rem' }}>
                                                        {marketer.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: '500', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                            {marketer.name}
                                                            <span className={`badge ${marketer.status === 'Active' || marketer.status === 'Hoạt động' ? 'badge-green' : 'badge-gray'}`} style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
                                                                {marketer.status === 'Active' || marketer.status === 'Hoạt động' ? 'Active' : 'Inactive'}
                                                            </span>
                                                        </div>
                                                        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{marketer.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ fontWeight: '600', color: 'var(--primary)' }}>{formatCurrency(agg.spend)}</td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem' }}><span style={{ color: 'var(--text-muted)' }}>M:</span> {formatNumber(agg.messages)}</div>
                                                <div style={{ fontSize: '0.875rem' }}><span style={{ color: 'var(--text-muted)' }}>L:</span> {formatNumber(agg.leads)}</div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>{formatNumber(agg.orders)} đơn</div>
                                                <div style={{ fontSize: '0.875rem', color: '#10B981', fontWeight: '500' }}>{formatCurrency(agg.revenue)}</div>
                                            </td>
                                            <td>
                                                <span style={{ fontWeight: '600', color: agg.spend > 0 && (agg.revenue / agg.spend) > 2 ? '#10B981' : 'inherit' }}>
                                                    {agg.spend > 0 ? (agg.revenue / agg.spend).toFixed(2) : '0.00'}x
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge" style={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)' }}>
                                                    {agg.messages > 0 ? ((agg.leads / agg.messages) * 100).toFixed(1) : '0.0'}%
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>M: <span style={{ color: 'var(--text-main)' }}>{formatCurrency(agg.costPerMsg)}</span></div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>L: <span style={{ color: 'var(--text-main)' }}>{agg.leads > 0 ? formatCurrency(agg.spend / agg.leads) : '$0'}</span></div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>O: <span style={{ color: 'var(--text-main)' }}>{agg.orders > 0 ? formatCurrency(agg.spend / agg.orders) : '$0'}</span></div>
                                            </td>
                                            <td>
                                                <div style={{ fontSize: '0.875rem' }}>{formatNumber(agg.reach)} <span style={{ color: 'var(--text-muted)' }}>người</span></div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CPM: {formatCurrency(agg.cpm)}</div>
                                            </td>
                                            <td style={{ textAlign: 'right' }}>
                                                <div className="flex justify-end gap-2">
                                                    <button className="btn" style={{ padding: '0.5rem', color: 'var(--text-muted)' }} title="Sửa" onClick={(e) => { e.stopPropagation(); handleEditClick(marketer); }}>
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="btn" style={{ padding: '0.5rem', color: '#EF4444' }} title="Xóa" onClick={(e) => { e.stopPropagation(); handleDelete(marketer.id); }}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Nested Campaigns Row */}
                                        {isExpanded && (
                                            <tr style={{ backgroundColor: '#F8FAFC' }}>
                                                <td colSpan={9} style={{ padding: 0 }}>
                                                    <div style={{ padding: '1.5rem 1.5rem 1.5rem 4rem', borderBottom: '1px solid var(--border)' }}>
                                                        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
                                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Chiến dịch đang chạy ({marketer.campaigns.length})</h4>
                                                            <button className="btn btn-primary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.875rem' }}><Plus size={14} /> Thêm Chiến Dịch</button>
                                                        </div>

                                                        {marketer.campaigns.length > 0 ? (
                                                            <div className="table-container" style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
                                                                <table style={{ marginBottom: 0 }}>
                                                                    <thead style={{ backgroundColor: '#F1F5F9' }}>
                                                                        <tr>
                                                                            <th style={{ fontSize: '0.75rem', padding: '0.75rem 1rem' }}>Tên Chiến Dịch</th>
                                                                            <th style={{ fontSize: '0.75rem', padding: '0.75rem 1rem' }}>Chi Tiêu</th>
                                                                            <th style={{ fontSize: '0.75rem', padding: '0.75rem 1rem' }}>Mess / Leads</th>
                                                                            <th style={{ fontSize: '0.75rem', padding: '0.75rem 1rem' }}>Đơn / Doanh Thu</th>
                                                                            <th style={{ fontSize: '0.75rem', padding: '0.75rem 1rem' }}>ROAS</th>
                                                                            <th style={{ fontSize: '0.75rem', padding: '0.75rem 1rem' }}>Phí/Tin/Lead/Đơn</th>
                                                                            <th style={{ fontSize: '0.75rem', padding: '0.75rem 1rem' }}>Tiếp Cận (CPM)</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {marketer.campaigns.map(c => (
                                                                            <tr key={c.id}>
                                                                                <td style={{ padding: '0.75rem 1rem' }}>
                                                                                    <div style={{ fontWeight: '500', color: 'var(--text-main)', fontSize: '0.875rem' }}>{c.name}</div>
                                                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{c.id}</div>
                                                                                </td>
                                                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500', color: 'var(--primary)' }}>{formatCurrency(c.spend || 0)}</td>
                                                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                                                                                    <div>M: {formatNumber(c.messages || 0)}</div>
                                                                                    <div style={{ color: 'var(--text-muted)' }}>L: {formatNumber(c.leads || 0)} <span style={{ fontSize: '0.7rem' }}>({c.messages > 0 ? ((c.leads || 0) / c.messages * 100).toFixed(0) : 0}%)</span></div>
                                                                                </td>
                                                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem' }}>
                                                                                    <div>{formatNumber(c.orders || 0)} đơn</div>
                                                                                    <div style={{ color: '#10B981', fontWeight: '500' }}>{formatCurrency(c.revenue || 0)}</div>
                                                                                </td>
                                                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                                                                    {c.spend > 0 ? ((c.revenue || 0) / c.spend).toFixed(2) : '0.00'}x
                                                                                </td>
                                                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                                                    <div>M: {formatCurrency(c.costPerMsg || 0)}</div>
                                                                                    <div>L: {c.leads > 0 ? formatCurrency((c.spend || 0) / c.leads) : '$0'}</div>
                                                                                    <div>O: {c.orders > 0 ? formatCurrency((c.spend || 0) / c.orders) : '$0'}</div>
                                                                                </td>
                                                                                <td style={{ padding: '0.75rem 1rem', fontSize: '0.75rem' }}>
                                                                                    <div>{formatNumber(c.reach || 0)}</div>
                                                                                    <div style={{ color: 'var(--text-muted)' }}>CPM: {formatCurrency(c.cpm || 0)}</div>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        ) : (
                                                            <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border)' }}>
                                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Chưa có chiến dịch nào.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })}
                            {filteredMarketers.length === 0 && (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                        Không tìm thấy marketer nào phù hợp "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Marketer Modal */}
            {isAddModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.25rem' }}>Thêm Marketer Mới</h3>
                            <button
                                className="btn"
                                style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
                                onClick={() => setIsAddModalOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Họ và Tên</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                        value={newForm.name}
                                        onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Địa Chỉ Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Ví dụ: nva@example.com"
                                        value={newForm.email}
                                        onChange={(e) => setNewForm({ ...newForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ border: '1px solid var(--border)' }}
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Lưu Marketer
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Marketer Modal */}
            {isEditModalOpen && editForm && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3 style={{ fontSize: '1.25rem' }}>Cập Nhật Marketer</h3>
                            <button
                                className="btn"
                                style={{ padding: '0.5rem', color: 'var(--text-muted)' }}
                                onClick={() => setIsEditModalOpen(false)}
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label className="form-label">Họ và Tên</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Ví dụ: Nguyễn Văn A"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Địa Chỉ Email</label>
                                    <input
                                        type="email"
                                        className="form-input"
                                        placeholder="Ví dụ: nva@example.com"
                                        value={editForm.email}
                                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn"
                                    style={{ border: '1px solid var(--border)' }}
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Cập Nhật
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
