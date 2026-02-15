import React from 'react';
import { Calendar, Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react';
import '../styles/misc.css';

const Appointments = () => {
    const appointments = [
        {
            id: 1,
            lead: 'Sarah Jenkins',
            time: '10:00 AM',
            date: 'Today, Oct 24',
            type: 'Property Tour',
            location: 'Downtown Lofts, Unit 4B',
            status: 'Confirmed'
        },
        {
            id: 2,
            lead: 'Michael Chen',
            time: '2:00 PM',
            date: 'Tomorrow, Oct 25',
            type: 'Virtual Consultation',
            location: 'Zoom Meeting',
            status: 'Pending'
        },
        {
            id: 3,
            lead: 'David & Lisa',
            time: '4:30 PM',
            date: 'Mon, Oct 27',
            type: 'Listing Presentation',
            location: '124 Maple Drive',
            status: 'Confirmed'
        }
    ];

    return (
        <div className="outbound-container">
            <div className="flex-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Upcoming Appointments</h2>
                    <p className="text-secondary">Your schedule for the next 7 days</p>
                </div>
                <button className="btn btn-primary">
                    <Calendar size={16} />
                    Sync Calendar
                </button>
            </div>

            <div className="appointments-list flex flex-col gap-4">
                {appointments.map(appt => (
                    <div key={appt.id} className="appointment-card glass-panel p-4 flex-between hover-scale">
                        <div className="flex gap-4 items-center">
                            <div className="date-badge flex-col flex-center bg-primary-light text-primary p-3 rounded-lg" style={{ minWidth: '60px' }}>
                                <span className="text-xs font-bold uppercase">{appt.date.split(',')[0]}</span>
                                <span className="text-lg font-bold">{appt.time.split(' ')[0]}</span>
                                <span className="text-xs">{appt.time.split(' ')[1]}</span>
                            </div>

                            <div className="appt-details">
                                <h3 className="font-bold text-lg mb-1">{appt.lead}</h3>
                                <div className="flex gap-3 text-sm text-secondary">
                                    <span className="flex items-center gap-1"><User size={14} /> {appt.type}</span>
                                    <span className="flex items-center gap-1"><MapPin size={14} /> {appt.location}</span>
                                </div>
                            </div>
                        </div>

                        <div className="appt-actions flex items-center gap-3">
                            <span className={`status-badge ${appt.status.toLowerCase()}`}>
                                {appt.status === 'Confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                {appt.status}
                            </span>
                            <button className="btn btn-outline btn-sm">Reschedule</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Appointments;
