'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardBody, CardHeader } from '@nextui-org/card';
import { Divider } from '@nextui-org/divider';
import { Spinner } from '@nextui-org/spinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatisticsData {
    totalPackets: number;
    uniqueSourceIPs: number;
    uniqueDestinationIPs: number;
    topProtocols: { protocol: string; count: number }[];
    topSourceIPs: { ip: string; count: number }[];
    topDestinationIPs: { ip: string; count: number }[];
    topApplicationProtocols: { application_protocol: string; count: number }[];
    packetSizeDistribution: { size_range: string; count: number }[];
    tcpFlagsDistribution: { tcp_flags: number; count: number }[];
}

const TCPFlagNames: { [key: number]: string } = {
    1: 'FIN',
    2: 'SYN',
    4: 'RST',
    8: 'PSH',
    16: 'ACK',
    32: 'URG',
    64: 'ECE',
    128: 'CWR'
};

const getFlagNames = (flags: number): string => {
    return Object.entries(TCPFlagNames)
        .filter(([bit]) => (flags & parseInt(bit)) !== 0)
        .map(([, name]) => name)
        .join(', ');
};

const StatisticsPage: React.FC = () => {
    const [statistics, setStatistics] = useState<StatisticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get<{ data: StatisticsData }>('/api/statistics');
                setStatistics(response.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError('統計情報の取得中にエラーが発生しました。');
                setIsLoading(false);
            }
        };

        fetchStatistics().then(r => r);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500">{error}</div>;
    }

    if (!statistics) {
        return <div>データがありません。</div>;
    }

    const renderList = (items: any[] | undefined, keyPrefix: string, renderItem: (item: any) => React.ReactNode) => {
        if (!items || items.length === 0) {
            return <p>データがありません。</p>;
        }
        return (
            <ul>
                {items.map((item, index) => (
                    <li key={`${keyPrefix}-${index}`}>{renderItem(item)}</li>
                ))}
            </ul>
        );
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">パケットログ統計情報</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">概要</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <p>総パケット数: {statistics.totalPackets}</p>
                        <p>ユニークな送信元IP数: {statistics.uniqueSourceIPs}</p>
                        <p>ユニークな宛先IP数: {statistics.uniqueDestinationIPs}</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">上位プロトコル</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {renderList(statistics.topProtocols, 'protocol', (item) => `${item.protocol}: ${item.count}`)}
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">上位送信元IP</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {renderList(statistics.topSourceIPs, 'source', (item) => `${item.ip}: ${item.count}`)}
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">上位宛先IP</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {renderList(statistics.topDestinationIPs, 'destination', (item) => `${item.ip}: ${item.count}`)}
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">上位アプリケーションプロトコル</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {statistics.topApplicationProtocols && statistics.topApplicationProtocols.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={statistics.topApplicationProtocols}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="application_protocol" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>データがありません。</p>
                        )}
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">パケットサイズ分布</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {statistics.packetSizeDistribution && statistics.packetSizeDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={statistics.packetSizeDistribution}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="size_range" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>データがありません。</p>
                        )}
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold">TCPフラグ分布</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        {statistics.tcpFlagsDistribution && statistics.tcpFlagsDistribution.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={statistics.tcpFlagsDistribution.map(item => ({
                                    ...item,
                                    flags: getFlagNames(item.tcp_flags)
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="flags" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#82ca9d" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <p>データがありません。</p>
                        )}
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default StatisticsPage;