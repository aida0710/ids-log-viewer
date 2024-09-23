'use client';

import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Card, CardBody, CardHeader} from '@nextui-org/card';
import {Divider} from '@nextui-org/divider';
import {Spinner} from '@nextui-org/spinner';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/table';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell} from 'recharts';

interface StatisticsData {
    totalPackets: number;
    uniqueSourceIPs: number;
    uniqueDestinationIPs: number;
    topProtocols: {protocol: string; count: number}[];
    topSourceIPs: {ip: string; count: number}[];
    topDestinationIPs: {ip: string; count: number}[];
    topApplicationProtocols: {application_protocol: string; count: number}[];
    packetSizeDistribution: {size_range: string; count: number}[];
    tcpFlagsDistribution: {tcp_flags: number; count: number}[];
    ipVersionDistribution: {ip_version: number; count: number}[];
    avgPacketSize: number | null;
    totalTrafficVolume: number | null;
    maxPacketSize: number | null;
    minPacketSize: number | null;
    uniqueApplicationProtocols: number;
    totalTcpPackets: number;
    totalUdpPackets: number;
    latestPacketTime: string;
    oldestPacketTime: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const getColor = (item: string): string => {
    // 文字列をハッシュ化してCOLORS配列のインデックスを決定
    const hash = item.split('').reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    return COLORS[Math.abs(hash) % COLORS.length];
};

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

const StatisticsPage: React.FC = () => {
    const [statistics, setStatistics] = useState<StatisticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get<{data: StatisticsData}>('/api/statistics');
                setStatistics(response.data.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching statistics:', error);
                setError('統計情報の取得中にエラーが発生しました。');
                setIsLoading(false);
            }
        };

        fetchStatistics().then((r) => r);
    }, []);

    if (isLoading) {
        return (
            <div className='flex h-screen items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    }

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    if (!statistics) {
        return <div>データがありません。</div>;
    }

    const formatNumber = (value: number | null | undefined, decimals: number = 2): string => {
        if (value == null) return 'N/A';
        return value.toFixed(decimals);
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className='container mx-auto p-4'>
            <h1 className='mb-4 text-2xl font-bold'>パケットログ統計情報</h1>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>概要</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <p>総パケット数: {statistics.totalPackets.toLocaleString()}</p>
                        <p>ユニークな送信元IP数: {statistics.uniqueSourceIPs.toLocaleString()}</p>
                        <p>ユニークな宛先IP数: {statistics.uniqueDestinationIPs.toLocaleString()}</p>
                        <p>平均パケットサイズ: {formatNumber(statistics.avgPacketSize)} バイト</p>
                        <p>最大パケットサイズ: {formatNumber(statistics.maxPacketSize)} バイト</p>
                        <p>最小パケットサイズ: {formatNumber(statistics.minPacketSize)} バイト</p>
                        <p>総トラフィック量: {formatNumber(statistics.totalTrafficVolume ? statistics.totalTrafficVolume / (1024 * 1024) : null)} MB</p>
                        <p>ユニークなアプリケーションプロトコル数: {statistics.uniqueApplicationProtocols}</p>
                        <p>TCPパケット数: {statistics.totalTcpPackets.toLocaleString()}</p>
                        <p>UDPパケット数: {statistics.totalUdpPackets.toLocaleString()}</p>
                        <p>最新パケット時刻: {formatDate(statistics.latestPacketTime)}</p>
                        <p>最古パケット時刻: {formatDate(statistics.oldestPacketTime)}</p>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>TCPフラグ分布</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <ResponsiveContainer
                            width='100%'
                            height={300}>
                            <BarChart
                                data={statistics.tcpFlagsDistribution.map((item) => ({
                                    ...item,
                                    flags: getFlagNames(item.tcp_flags),
                                }))}>
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

                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>上位送信元IP</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Table aria-label='Top Source IPs'>
                            <TableHeader>
                                <TableColumn>IP アドレス</TableColumn>
                                <TableColumn>パケット数</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {statistics.topSourceIPs.map((item) => (
                                    <TableRow key={`source-${item.ip}`}>
                                        <TableCell>{item.ip}</TableCell>
                                        <TableCell>{item.count.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>上位宛先IP</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <Table aria-label='Top Destination IPs'>
                            <TableHeader>
                                <TableColumn>IP アドレス</TableColumn>
                                <TableColumn>パケット数</TableColumn>
                            </TableHeader>
                            <TableBody>
                                {statistics.topDestinationIPs.map((item) => (
                                    <TableRow key={`destination-${item.ip}`}>
                                        <TableCell>{item.ip}</TableCell>
                                        <TableCell>{item.count.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>上位アプリケーションプロトコル</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <ResponsiveContainer
                            width='100%'
                            height={300}>
                            <BarChart data={statistics.topApplicationProtocols}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='application_protocol' />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey='count'
                                    fill='#8884d8'
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>パケットサイズ分布</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <ResponsiveContainer
                            width='100%'
                            height={300}>
                            <BarChart data={statistics.packetSizeDistribution}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='size_range' />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar
                                    dataKey='count'
                                    fill='#8884d8'
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>上位プロトコル</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <ResponsiveContainer
                            width='100%'
                            height={300}>
                            <PieChart>
                                <Pie
                                    data={statistics.topProtocols}
                                    dataKey='count'
                                    nameKey='protocol'
                                    cx='50%'
                                    cy='50%'
                                    outerRadius={80}
                                    label>
                                    {statistics.topProtocols.map((entry, index) => (
                                        <Cell
                                            key={`cell-${entry.protocol}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>
                        <h2 className='text-xl font-semibold'>IPバージョン分布</h2>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <ResponsiveContainer
                            width='100%'
                            height={300}>
                            <PieChart>
                                <Pie
                                    data={statistics.ipVersionDistribution}
                                    dataKey='count'
                                    nameKey='ip_version'
                                    cx='50%'
                                    cy='50%'
                                    outerRadius={80}
                                    label>
                                    {statistics.topProtocols.map((entry) => (
                                        <Cell
                                            key={`cell-${entry.protocol}`}
                                            fill={getColor(entry.protocol)}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default StatisticsPage;
