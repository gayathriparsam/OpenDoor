import React from 'react';
import '../styles/misc.css';

const Traces = () => {
    const traces = [
        { time: '14:30:05', level: 'INFO', msg: 'Incoming call from +15550123456' },
        { time: '14:30:06', level: 'INFO', msg: 'LLM generated greeting (latency 450ms)' },
        { time: '14:30:12', level: 'DEBUG', msg: 'User audio transcribed: "I am looking for a house"' },
        { time: '14:30:13', level: 'INFO', msg: 'Intent identified: BUYER_INTENT (confidence 0.98)' },
        { time: '14:30:13', level: 'INFO', msg: 'Tool call: update_crm_stage(id=8842, stage="Qualified")' },
        { time: '14:30:15', level: 'INFO', msg: 'LLM response generated (latency 600ms)' },
        { time: '14:30:22', level: 'WARN', msg: 'Audio packet loss detected (15ms)' },
        { time: '14:30:25', level: 'INFO', msg: 'Appointment slot checked: Sat 10:00 AM [AVAILABLE]' },
    ];

    return (
        <div className="outbound-container">
            <h2 className="text-xl font-bold mb-4">System Traces & Logs</h2>
            <div className="trace-log glass-panel">
                {traces.map((trace, i) => (
                    <div key={i} className="log-entry">
                        <span className="log-time">{trace.time}</span>
                        <span className={`log-level ${trace.level === 'WARN' ? 'text-warning' : (trace.level === 'DEBUG' ? 'text-secondary' : 'text-success')}`}>
                            [{trace.level}]
                        </span>
                        <span className="log-msg">{trace.msg}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Traces;
