import React from 'react';
import {Card, CardBody, CardHeader} from '@nextui-org/card';
import {Divider} from '@nextui-org/divider';
import {Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Helper functions
const getColor = (item: string): string => {
    const hash = item.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return COLORS[Math.abs(hash) % COLORS.length];
};


export const PieChartCard: React.FC<{ title: string; data: any[]; dataKey: string; nameKey: string }> = ({ title, data, dataKey, nameKey }) => (
    <Card>
        <CardHeader>
            <h2 className='text-xl font-semibold'>{title}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
            <ResponsiveContainer width='100%' height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey={dataKey}
                        nameKey={nameKey}
                        cx='50%'
                        cy='50%'
                        outerRadius={80}
                        label
                    >
                        {data.map((entry) => (
                            <Cell key={`cell-${entry[nameKey]}`} fill={getColor(entry[nameKey].toString())} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </CardBody>
    </Card>
);