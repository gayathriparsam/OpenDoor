import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const LeadScoringRadar = ({ data }) => {
    // Expected data format: { budget: number, intent: number, timeline: number }
    // Scores should be 0-100

    const chartData = [
        { subject: 'Budget', A: data?.budget || 0, fullMark: 100 },
        { subject: 'Intent', A: data?.intent || 0, fullMark: 100 },
        { subject: 'Timeline', A: data?.timeline || 0, fullMark: 100 }
    ];

    return (
        <div style={{ width: '100%', height: '220px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: 'var(--color-secondary)', fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={false}
                        axisLine={false}
                    />
                    <Radar
                        name="Lead Info"
                        dataKey="A"
                        stroke="var(--color-primary)"
                        fill="var(--color-primary)"
                        fillOpacity={0.5}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default LeadScoringRadar;
