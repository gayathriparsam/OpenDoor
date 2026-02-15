import React, { useState } from 'react';
import { useLeads } from '../context/LeadContext';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Building,
    Users,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Calendar,
    Bell
} from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import '../styles/misc.css';

const performanceData = [
    { name: 'Jan', revenue: 4000, expenses: 2400, profit: 1600 },
    { name: 'Feb', revenue: 3000, expenses: 1398, profit: 1602 },
    { name: 'Mar', revenue: 2000, expenses: 2800, profit: -800 },
    { name: 'Apr', revenue: 2780, expenses: 1908, profit: 872 },
    { name: 'May', revenue: 1890, expenses: 1800, profit: 90 },
    { name: 'Jun', revenue: 2390, expenses: 2000, profit: 390 },
    { name: 'Jul', revenue: 3490, expenses: 3000, profit: 490 },
];

const salesVolumeData = [
    { name: 'Jan', Listed: 45, Sold: 32 },
    { name: 'Feb', Listed: 52, Sold: 38 },
    { name: 'Mar', Listed: 48, Sold: 40 },
    { name: 'Apr', Listed: 61, Sold: 45 },
    { name: 'May', Listed: 55, Sold: 42 },
    { name: 'Jun', Listed: 67, Sold: 50 },
    { name: 'Jul', Listed: 72, Sold: 58 },
    { name: 'Aug', Listed: 68, Sold: 54 },
    { name: 'Sep', Listed: 60, Sold: 48 },
    { name: 'Oct', Listed: 65, Sold: 52 },
    { name: 'Nov', Listed: 70, Sold: 56 },
    { name: 'Dec', Listed: 75, Sold: 62 },
];

const salesByType = [
    { name: 'Residential', value: 400 },
    { name: 'Commercial', value: 300 },
    { name: 'Industrial', value: 200 },
    { name: 'Land', value: 100 },
];

const COLORS = ['#1565d8', '#ff9800', '#4caf50', '#9c27b0'];

const Analytics = () => {
    const { leads } = useLeads();
    const [timeframe, setTimeframe] = useState('1Y');

    const totalLeads = leads?.length || 0;
    const qualifiedLeads = leads?.filter(l => l.stage === 'Qualified').length || 0;
    const conversionRate = totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : 0;

    return (
        <div className="outbound-container" style={{ background: '#f4f7f9', padding: '24px' }}>
            {/* Top Bar */}
            <div className="flex-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: '#1e293b' }}>Analytics</h1>
                    <p className="text-sm text-secondary">Deep insights into your real estate performance.</p>
                </div>
                <div className="flex gap-3">
                    <div className="search-box mb-0" style={{ width: '300px' }}>
                        <Search className="search-icon" size={16} />
                        <input type="text" className="search-input" placeholder="Search properties..." />
                    </div>
                    <button className="btn btn-outline btn-sm bg-white flex items-center gap-2">
                        <Calendar size={16} /> Feb 2026
                    </button>
                    <button className="btn btn-ghost btn-sm relative">
                        <Bell size={20} />
                        <span className="absolute top-0 right-0 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
                    </button>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ff9800', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>JD</div>
                </div>
            </div>

            <div className="flex-between mb-4">
                <h2 className="text-xl font-bold">Performance Analytics</h2>
                <div className="flex bg-white p-1 rounded-lg border border-gray-100 shadow-sm">
                    {['7D', '1M', '3M', '6M', '1Y', 'All'].map(t => (
                        <button
                            key={t}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeframe === t ? 'bg-orange-500 text-white shadow-sm' : 'text-secondary hover:bg-gray-50'}`}
                            onClick={() => setTimeframe(t)}
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* Top Cards Row - 2x2 Grid precisely matching reference layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Total Revenue */}
                <div className="metric-card p-8" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="text-sm font-bold text-secondary uppercase tracking-wider block mb-2">TOTAL REVENUE</span>
                        <div className="text-4xl font-extrabold mb-3" style={{ color: '#1e293b' }}>$14.83M</div>
                        <div className="text-sm font-bold flex items-center gap-1 text-green-600">
                            <TrendingUp size={16} /> +14.2% <span className="text-secondary ml-1 font-normal text-xs italic">vs last year</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ background: '#fff7ed', color: '#ea580c' }}>
                        <DollarSign size={32} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Properties Sold */}
                <div className="metric-card p-8" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="text-sm font-bold text-secondary uppercase tracking-wider block mb-2">PROPERTIES SOLD</span>
                        <div className="text-4xl font-extrabold mb-3" style={{ color: '#1e293b' }}>464</div>
                        <div className="text-sm font-bold flex items-center gap-1 text-green-600">
                            <TrendingUp size={16} /> +22.5% <span className="text-secondary ml-1 font-normal text-xs italic">vs last year</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ background: '#fff7ed', color: '#ea580c' }}>
                        <Building size={32} strokeWidth={2.5} />
                    </div>
                </div>

                {/* New Clients */}
                <div className="metric-card p-8" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="text-sm font-bold text-secondary uppercase tracking-wider block mb-2">NEW CLIENTS</span>
                        <div className="text-4xl font-extrabold mb-3" style={{ color: '#1e293b' }}>{totalLeads}</div>
                        <div className="text-sm font-bold flex items-center gap-1 text-green-600">
                            <TrendingUp size={16} /> +8.1% <span className="text-secondary ml-1 font-normal text-xs italic">vs last year</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ background: '#fff7ed', color: '#ea580c' }}>
                        <Users size={32} strokeWidth={2.5} />
                    </div>
                </div>

                {/* Avg Days On Market */}
                <div className="metric-card p-8" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <span className="text-sm font-bold text-secondary uppercase tracking-wider block mb-2">AVG. DAYS ON MARKET</span>
                        <div className="text-4xl font-extrabold mb-3" style={{ color: '#1e293b' }}>24</div>
                        <div className="text-sm font-bold flex items-center gap-1 text-red-600">
                            <TrendingDown size={16} /> -12% <span className="text-secondary ml-1 font-normal text-xs italic">vs last year</span>
                        </div>
                    </div>
                    <div className="p-4 rounded-2xl" style={{ background: '#fff7ed', color: '#ea580c' }}>
                        <Clock size={32} strokeWidth={2.5} />
                    </div>
                </div>
            </div>

            {/* Vertical Stack of Charts */}
            <div className="flex flex-col gap-8 mb-8">
                {/* 1. Revenue, Expenses & Profit */}
                <div className="crm-card bg-white p-6" style={{ height: '450px', borderRadius: '16px', border: '1px solid #edf2f7' }}>
                    <div className="flex-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold">Revenue, Expenses & Profit</h3>
                            <p className="text-xs text-secondary">Annual financial breakdown (in $K)</p>
                        </div>
                        <div className="flex gap-4 text-xs font-bold">
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Revenue</span>
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-600"></div> Expenses</span>
                            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Profit</span>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '320px' }}>
                        <ResponsiveContainer>
                            <AreaChart data={performanceData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff9800" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#ff9800" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                <Area type="monotone" dataKey="expenses" stroke="#1565d8" fill="none" strokeWidth={2} />
                                <Area type="monotone" dataKey="profit" stroke="#22c55e" fill="none" strokeWidth={2} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 2. Sales Volume */}
                <div className="crm-card bg-white p-6" style={{ height: '450px', borderRadius: '16px', border: '1px solid #edf2f7' }}>
                    <div className="mb-6">
                        <h3 className="text-lg font-bold">Sales Volume</h3>
                        <p className="text-xs text-secondary">Properties sold vs listed per month</p>
                    </div>
                    <div style={{ width: '100%', height: '320px' }}>
                        <ResponsiveContainer>
                            <BarChart data={salesVolumeData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f8fafc' }} />
                                <Legend iconType="circle" verticalAlign="bottom" height={36} />
                                <Bar dataKey="Listed" fill="#1e293b" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="Sold" fill="#ff9800" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* 3. Sales by Type - Using Horizontal Bar Chart for better visibility */}
                <div className="crm-card bg-white p-6" style={{ height: '400px', borderRadius: '16px', border: '1px solid #edf2f7' }}>
                    <div className="mb-6">
                        <h3 className="text-lg font-bold">Sales by Type</h3>
                        <p className="text-xs text-secondary">Distribution of sales by category</p>
                    </div>
                    <div style={{ width: '100%', height: '280px' }}>
                        <ResponsiveContainer>
                            <BarChart
                                layout="vertical"
                                data={salesByType}
                                margin={{ left: 20, right: 30, top: 0, bottom: 0 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
                                    width={100}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                                    {salesByType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
