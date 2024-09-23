import React from 'react';
import {Card, CardBody, CardHeader} from '@nextui-org/card';
import {Divider} from '@nextui-org/divider';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

const TCPFlagNames: {[key: number]: string} = {
    1: 'FIN',
    2: 'SYN',
    4: 'RST',
    8: 'PSH',
    16: 'ACK',
    32: 'URG',
    64: 'ECE',
    128: 'CWR',
};

const getFlagNames = (flags: number): string => {
    return Object.entries(TCPFlagNames)
        .filter(([bit]) => (flags & parseInt(bit)) !== 0)
        .map(([, name]) => name)
        .join(', ');
};

export const TCPFlagsCard: React.FC<{data: {tcp_flags: number; count: number}[]}> = ({data}) => (
    <Card>
        <CardHeader>
            <h2 className='text-xl font-semibold'>TCPフラグ分布</h2>
        </CardHeader>
        <Divider />
        <CardBody>
            <ResponsiveContainer
                width='100%'
                height={300}>
                <BarChart data={data.map((item) => ({...item, flags: getFlagNames(item.tcp_flags)}))}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='flags' />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                        dataKey='count'
                        fill='#82ca9d'
                    />
                </BarChart>
            </ResponsiveContainer>
        </CardBody>
    </Card>
);
