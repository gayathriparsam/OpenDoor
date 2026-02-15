import React, { useState } from 'react';
import { X, Save, User, DollarSign, MapPin, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useLeads } from '../../context/LeadContext';
import '../../styles/create-lead-modal.css';

const CreateLeadModal = ({ onClose }) => {
    const { addLead } = useLeads();

    // Initial Form State
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', phone: '', contactMethod: 'Call', source: 'Website',
        intent: 'Buyer', status: 'Active',
        minBudget: '', maxBudget: '', preApproval: 'No', lender: '', isCashBuyer: false,
        primaryLocation: '', neighborhoods: '', schoolDistrict: '',
        propertyType: 'House', minBeds: '', minBaths: '', mustHaves: '', dealBreakers: '',
        timeline: '1-3 months', livingSituation: 'Renting',
        familySize: '', notes: '', tags: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Construct the Lead Object for Context
        const newLead = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            intent: formData.intent,
            stage: 'New', // Default
            score: 10, // Initial Score
            budget: {
                min: parseInt(formData.minBudget) || 0,
                max: parseInt(formData.maxBudget) || 0
            },
            location: formData.primaryLocation,
            timeline: formData.timeline,
            checklist: {
                intent: !!formData.intent,
                budget: !!formData.minBudget,
                location: !!formData.primaryLocation,
                timeline: !!formData.timeline,
                email: !!formData.email,
                preApproval: formData.preApproval === 'Yes'
            },
            details: {
                ...formData
            },
            reasoning: 'Manually created via dashboard.'
        };

        addLead(newLead);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">

                {/* Header */}
                <div className="modal-header">
                    <div className="modal-title-Group">
                        <div className="modal-icon">
                            <User size={20} />
                        </div>
                        <div className="modal-title">
                            <h2>Create New Lead</h2>
                            <p>Enter lead details manually</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="close-btn">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="modal-content">

                    {/* 1. Contact Info */}
                    <div className="form-section">
                        <div className="section-header">
                            <User size={14} /> Contact Information
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name</label>
                                <input required name="firstName" className="form-input" placeholder="Jane" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input required name="lastName" className="form-input" placeholder="Doe" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" className="form-input" placeholder="jane@example.com" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input name="phone" className="form-input" placeholder="+1 (555) 000-0000" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Contact Method</label>
                                <select name="contactMethod" className="form-select" onChange={handleChange}>
                                    <option>Call</option>
                                    <option>Text</option>
                                    <option>Email</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Source</label>
                                <select name="source" className="form-select" onChange={handleChange}>
                                    <option>Website</option>
                                    <option>Referral</option>
                                    <option>Call</option>
                                    <option>Open House</option>
                                    <option>Zillow / Aggregator</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider" />

                    {/* 2. Lead Type & Status */}
                    <div className="form-section">
                        <div className="section-header">
                            <CheckCircle2 size={14} /> Lead Type
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Intent</label>
                                <div className="toggle-group">
                                    {['Buyer', 'Seller', 'Both', 'Investor'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            className={`toggle-btn ${formData.intent === type ? 'active' : ''}`}
                                            onClick={() => setFormData(prev => ({ ...prev, intent: type }))}
                                        >
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Lead Status</label>
                                <select name="status" className="form-select" onChange={handleChange}>
                                    <option>Active</option>
                                    <option>Just Looking</option>
                                    <option>Pre-qualified</option>
                                    <option>Nurture</option>
                                    <option>Cold</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="divider" />

                    {/* 3. Budget & Financing */}
                    <div className="form-section">
                        <div className="section-header">
                            <DollarSign size={14} /> Budget & Financing
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Min Budget ($)</label>
                                <input type="number" name="minBudget" className="form-input" placeholder="400000" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Max Budget ($)</label>
                                <input type="number" name="maxBudget" className="form-input" placeholder="600000" onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Pre-Approval Status</label>
                                <select name="preApproval" className="form-select" onChange={handleChange}>
                                    <option>No</option>
                                    <option>Yes</option>
                                    <option>Needs Loan</option>
                                    <option>Cash Buyer</option>
                                </select>
                            </div>
                            {formData.preApproval === 'Yes' && (
                                <div className="form-group">
                                    <label>Lender Name</label>
                                    <input name="lender" className="form-input" placeholder="Chase / Wells Fargo" onChange={handleChange} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="divider" />

                    {/* 4. Location & Property */}
                    <div className="form-section">
                        <div className="section-header">
                            <MapPin size={14} /> Property Preferences
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Primary Location</label>
                                <input name="primaryLocation" className="form-input" placeholder="Downtown, Suburbs..." onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Property Type</label>
                                <select name="propertyType" className="form-select" onChange={handleChange}>
                                    <option>House</option>
                                    <option>Condo</option>
                                    <option>Townhouse</option>
                                    <option>Multi-Family</option>
                                    <option>Land</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Must-Have Features</label>
                                <input name="mustHaves" className="form-input" placeholder="Pool, Garage, Yard..." onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Dealbreakers</label>
                                <input name="dealBreakers" className="form-input" placeholder="Busy street, HOA..." onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="divider" />

                    {/* 5. Additional Info */}
                    <div className="form-section">
                        <div className="section-header">
                            <FileText size={14} /> Additional Details
                        </div>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Move Timeline</label>
                                <select name="timeline" className="form-select" onChange={handleChange}>
                                    <option>ASAP</option>
                                    <option>1-3 months</option>
                                    <option>3-6 months</option>
                                    <option>Browsing / 6+ months</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Tags (comma separated)</label>
                                <input name="tags" className="form-input" placeholder="VIP, Urgent, Relocation..." onChange={handleChange} />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginTop: '16px' }}>
                            <label>Notes</label>
                            <textarea name="notes" className="form-textarea" placeholder="Any extra details..." onChange={handleChange} />
                        </div>
                    </div>

                </form>

                {/* Footer Actions */}
                <div className="modal-footer">
                    <button type="button" onClick={onClose} className="btn-cancel">
                        Cancel
                    </button>
                    <button onClick={handleSubmit} className="btn-save">
                        <Save size={16} />
                        Create Lead
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateLeadModal;
