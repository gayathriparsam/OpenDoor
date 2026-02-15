import React, { useState } from 'react';
import {
    Search,
    Plus,
    Grid,
    List,
    MapPin,
    Bed,
    Bath,
    Maximize,
    Filter,
    ChevronDown,
    Heart,
    MoreHorizontal,
    Bell,
    Calendar
} from 'lucide-react';
import '../styles/misc.css';

const MOCK_PROPERTIES = [
    {
        id: 1,
        title: "Sunset Ridge Villa",
        location: "Beverly Hills, CA",
        price: "$3,250,000",
        status: "For Sale",
        beds: 5,
        baths: 4,
        sqft: "4,200",
        type: "Residential",
        views: 1240,
        likes: 89,
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Metropolitan Tower Suite",
        location: "Manhattan, NY",
        price: "$8,500/mo",
        status: "For Rent",
        beds: 3,
        baths: 2,
        sqft: "2,100",
        type: "Residential",
        views: 980,
        likes: 56,
        image: "https://images.unsplash.com/photo-1545324418-f1d3c5b53574?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Oceanview Paradise",
        location: "Malibu, CA",
        price: "$5,900,000",
        status: "For Sale",
        beds: 6,
        baths: 5,
        sqft: "5,800",
        type: "Residential",
        views: 2100,
        likes: 134,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Skyline Penthouse",
        location: "Chicago, IL",
        price: "$12,000/mo",
        status: "Leased",
        beds: 4,
        baths: 3,
        sqft: "3,500",
        type: "Commercial",
        views: 760,
        likes: 42,
        image: "https://images.unsplash.com/photo-1560448204-61dc36dc98c8?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Downtown Business Center",
        location: "San Francisco, CA",
        price: "$18,500,000",
        status: "For Sale",
        beds: 0,
        baths: 8,
        sqft: "25,000",
        type: "Commercial",
        views: 3200,
        likes: 210,
        image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 6,
        title: "Maple Street Family Home",
        location: "Portland, OR",
        price: "$785,000",
        status: "For Sale",
        beds: 4,
        baths: 3,
        sqft: "2,800",
        type: "Residential",
        views: 650,
        likes: 38,
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 7,
        title: "Industrial Loft Conversion",
        location: "Brooklyn, NY",
        price: "$6,200/mo",
        status: "For Rent",
        beds: 2,
        baths: 2,
        sqft: "1,800",
        type: "Industrial",
        views: 890,
        likes: 67,
        image: "https://images.unsplash.com/photo-1536376074432-bf12177d4fdf?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 8,
        title: "Coastal Breeze Condo",
        location: "Miami, FL",
        price: "$1,450,000",
        status: "For Sale",
        beds: 3,
        baths: 2,
        sqft: "1,950",
        type: "Residential",
        views: 1560,
        likes: 98,
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 9,
        title: "Modern Minimalist House",
        location: "Austin, TX",
        price: "$1,250,000",
        status: "For Sale",
        beds: 4,
        baths: 3,
        sqft: "3,100",
        type: "Residential",
        views: 450,
        likes: 22,
        image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 10,
        title: "Luxury Hillside Retreat",
        location: "Aspen, CO",
        price: "$12,400,000",
        status: "For Sale",
        beds: 7,
        baths: 6,
        sqft: "8,500",
        type: "Residential",
        views: 4300,
        likes: 310,
        image: "https://images.unsplash.com/photo-1512914890251-2f96a9b0bbe2?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 11,
        title: "Urban Loft Apartment",
        location: "Seattle, WA",
        price: "$4,500/mo",
        status: "For Rent",
        beds: 2,
        baths: 1,
        sqft: "1,200",
        type: "Residential",
        views: 520,
        likes: 34,
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 12,
        title: "Tech Hub Office Space",
        location: "Palo Alto, CA",
        price: "$25,000/mo",
        status: "Leased",
        beds: 0,
        baths: 4,
        sqft: "12,000",
        type: "Commercial",
        views: 890,
        likes: 45,
        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop"
    }
];

const STATUS_COLORS = {
    'All': '#1e293b',
    'For Sale': '#2563eb',
    'For Rent': '#0284c7',
    'Leased': '#10b981'
};

const Properties = () => {
    const [filter, setFilter] = useState('All');
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredProperties = MOCK_PROPERTIES.filter(p => {
        if (filter !== 'All' && p.status !== filter) return false;
        if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div className="outbound-container" style={{ background: '#f4f7f9', padding: '24px' }}>
            {/* Top Bar - Consistent with Analytics */}
            <div className="flex-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: '#1e293b' }}>Properties</h1>
                    <p className="text-sm text-secondary">Manage and browse all your property listings.</p>
                </div>
                <div className="flex gap-3">
                    <div className="search-box mb-0" style={{ width: '300px' }}>
                        <Search className="search-icon" size={16} />
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search properties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
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

            {/* Sub-header with Filter Chips and Controls */}
            <div className="flex-between mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex gap-6">
                    {['All', 'For Sale', 'For Rent', 'Leased'].map(f => (
                        <button
                            key={f}
                            className={`px-12 py-5 rounded-2xl text-lg font-bold transition-all duration-200 ${filter === f ? 'shadow-xl scale-105' : 'hover:bg-gray-50'}`}
                            style={{
                                backgroundColor: filter === f ? STATUS_COLORS[f] : 'white',
                                color: filter === f ? 'white' : 'var(--color-text-secondary)',
                                border: filter === f ? 'none' : '1px solid #e2e8f0',
                                minWidth: '180px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <button
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-secondary'}`}
                            style={{ color: viewMode === 'grid' ? 'var(--color-primary)' : 'inherit' }}
                            onClick={() => setViewMode('grid')}
                        >
                            <Grid size={18} />
                        </button>
                        <button
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-secondary'}`}
                            style={{ color: viewMode === 'list' ? 'var(--color-primary)' : 'inherit' }}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button
                        className="btn btn-primary btn-sm flex items-center gap-2 border-none"
                        style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                        <Plus size={16} /> Add Property
                    </button>
                </div>
            </div>

            {/* Stats Summary */}
            <div className="flex gap-6 mb-6 text-sm">
                <span className="font-bold text-gray-700">{filteredProperties.length} <span className="font-normal text-secondary">properties found</span></span>
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS['For Sale'] }}></div> <span className="font-bold text-gray-700">{MOCK_PROPERTIES.filter(p => p.status === 'For Sale').length}</span> <span className="text-secondary">For Sale</span></span>
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS['For Rent'] }}></div> <span className="font-bold text-gray-700">{MOCK_PROPERTIES.filter(p => p.status === 'For Rent').length}</span> <span className="text-secondary">For Rent</span></span>
                <span className="flex items-center gap-1"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: STATUS_COLORS['Leased'] }}></div> <span className="font-bold text-gray-700">{MOCK_PROPERTIES.filter(p => p.status === 'Leased').length}</span> <span className="text-secondary">Leased</span></span>
            </div>

            {/* Property Grid/List */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                {filteredProperties.map(property => (
                    <div key={property.id} className={`group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative ${viewMode === 'list' ? 'flex flex-row' : 'flex flex-col'}`}>
                        {/* Image Section */}
                        <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-[300px] h-[220px]' : 'h-48'}`}>
                            <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop';
                                }}
                            />
                            <div className="absolute top-3 left-3">
                                <span className={`px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm`}
                                    style={{
                                        backgroundColor: STATUS_COLORS[property.status] || 'var(--color-primary)'
                                    }}>
                                    {property.status}
                                </span>
                            </div>
                            <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-all">
                                <Heart size={16} fill={property.id % 3 === 0 ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Content Section */}
                        <div className={`p-4 flex flex-col justify-between ${viewMode === 'list' ? 'flex-1' : ''}`}>
                            <div>
                                <div className="flex-between mb-1">
                                    <h3 className="text-lg font-bold truncate pr-4" style={{ color: '#1e293b' }}>{property.price}</h3>
                                    <button className="text-secondary hover:text-gray-700">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>

                                <h4 className="text-sm font-bold text-gray-800 mb-1">{property.title}</h4>

                                <div className="flex items-center gap-1 text-xs text-secondary mb-3">
                                    <MapPin size={12} className="text-orange-500" /> {property.location}
                                </div>
                            </div>

                            <div className="flex-between border-t border-gray-50 pt-3 mt-auto">
                                <div className="flex gap-3 text-[11px] text-secondary">
                                    <span className="flex items-center gap-1"><Bed size={13} className="text-orange-400" /> {property.beds || '0'} Bed</span>
                                    <span className="flex items-center gap-1"><Bath size={13} className="text-orange-400" /> {property.baths} Bath</span>
                                    <span className="flex items-center gap-1"><Maximize size={13} className="text-orange-400" /> {property.sqft}</span>
                                </div>
                                <span className="bg-gray-100 text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded text-gray-500">{property.type}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Properties;
