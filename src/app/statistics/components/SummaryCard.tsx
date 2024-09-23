import React from 'react';
import {Card, CardBody, CardHeader} from '@nextui-org/card';
import {Divider} from '@nextui-org/divider';
import {IStatisticsData} from '@/app/statistics/interface/IStatisticsData';


const formatNumber = (value: number | null | undefined, decimals: number = 2): string => {
    if (value == null) return 'N/A';
    return value.toFixed(decimals);
};

const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString();
};

export const SummaryCard: React.FC<{ statistics: IStatisticsData }> = ({ statistics }) => (
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
);