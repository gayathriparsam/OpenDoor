import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Phone, LayoutDashboard, Send, Home, TrendingUp, FileText, Plus, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/header.css';

import CreateLeadModal from '../dashboard/CreateLeadModal';

const Header = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="app-header">
            <div className="header-left">
                <div className="app-logo">
                    <div className="logo-circle-container">
                        <div className="logo-circle">
                            <div className="logo-buildings">
                                <div className="b-1"></div>
                                <div className="b-2"></div>
                                <div className="b-3"></div>
                            </div>
                        </div>
                    </div>
                    <span className="logo-text">OpenDoor</span>
                </div>

                <nav className="header-nav">
                    {isAdmin && (
                        <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={18} />
                            <span>CRM Dashboard</span>
                        </NavLink>
                    )}
                    <NavLink to="/simulator" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Phone size={18} />
                        <span>Call Simulator</span>
                    </NavLink>
                    {isAdmin && (
                        <>
                            <NavLink to="/properties" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <Home size={18} />
                                <span>Properties</span>
                            </NavLink>
                            <NavLink to="/analytics" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <TrendingUp size={18} />
                                <span>Analytics</span>
                            </NavLink>
                            <NavLink to="/outbound" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <Send size={18} />
                                <span>Outbound</span>
                            </NavLink>
                            <NavLink to="/traces" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                                <FileText size={18} />
                                <span>Traces</span>
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>

            <div className="header-right">
                {isAdmin && (
                    <button className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setShowCreateModal(true)}>
                        <Plus size={16} />
                        <span>Create Lead</span>
                    </button>
                )}

                <div className="env-badge">
                    <span className="status-dot"></span>
                    v1.0.4 • STAGE
                </div>

                {showCreateModal && <CreateLeadModal onClose={() => setShowCreateModal(false)} />}

                {/* User Profile / Logout */}
                <div className="user-menu" style={{
                    marginTop: '10px',
                    paddingTop: '15px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%'
                }}>
                    <div className="flex" style={{ alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={16} color="white" />
                        </div>
                        <div className="flex-col" style={{ fontSize: '0.75rem', color: 'white' }}>
                            <span className="font-bold">{user?.name}</span>
                            <span style={{ opacity: 0.6 }}>{user?.role}</span>
                        </div>
                    </div>
                    <button className="btn btn-ghost btn-sm" onClick={handleLogout} title="Logout" style={{ color: 'rgba(255,255,255,0.6)', padding: '5px' }}>
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
