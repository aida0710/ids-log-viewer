import React from 'react';
import {Card, CardBody, CardHeader} from '@nextui-org/card';
import {Divider} from '@nextui-org/divider';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

export const BarChartCard: React.FC<{ title: string; data: any[]; dataKey: string; nameKey: string }> = ({ title, data, dataKey, nameKey }) => (
    <Card>
        <CardHeader>
            <h2 className='text-xl font-semibold'>{title}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
            <ResponsiveContainer width='100%' height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey={nameKey} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={dataKey} fill='#8884d8' />
                </BarChart>
            </ResponsiveContainer>
        </CardBody>
    </Card>
);
