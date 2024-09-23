'use client';

import React, {useEffect, useState} from 'react';
import {IStatisticsData} from '@/app/statistics/interface/IStatisticsData';
import axios from 'axios';
import {Spinner} from '@nextui-org/spinner';
import {SummaryCard} from '@/app/statistics/components/SummaryCard';
import {TCPFlagsCard} from '@/app/statistics/components/TCPFlagsCard';
import {IPTable} from '@/app/statistics/components/IPTable';
import {BarChartCard} from '@/app/statistics/components/BarChartCard';
import {PieChartCard} from '@/app/statistics/components/PieChartCard';

export default function Page() {
    const [statistics, setStatistics] = useState<IStatisticsData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get<{data: IStatisticsData}>('/api/statistics');
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

    if (isLoading)
        return (
            <div className='flex h-screen items-center justify-center'>
                <Spinner size='lg' />
            </div>
        );
    if (error) return <div className='text-red-500'>{error}</div>;
    if (!statistics) return <div>データがありません。</div>;

    return (
        <div className='container mx-auto p-4'>
            <h1 className='mb-4 text-2xl font-bold'>パケットログ統計情報</h1>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <SummaryCard statistics={statistics} />
                <TCPFlagsCard data={statistics.tcpFlagsDistribution} />
                <IPTable
                    title='上位送信元IP'
                    data={statistics.topSourceIPs}
                />
                <IPTable
                    title='上位宛先IP'
                    data={statistics.topDestinationIPs}
                />
                <BarChartCard
                    title='上位アプリケーションプロトコル'
                    data={statistics.topApplicationProtocols}
                    dataKey='count'
                    nameKey='application_protocol'
                />
                <BarChartCard
                    title='パケットサイズ分布'
                    data={statistics.packetSizeDistribution}
                    dataKey='count'
                    nameKey='size_range'
                />
                <PieChartCard
                    title='上位プロトコル'
                    data={statistics.topProtocols}
                    dataKey='count'
                    nameKey='protocol'
                />
                <PieChartCard
                    title='IPバージョン分布'
                    data={statistics.ipVersionDistribution}
                    dataKey='count'
                    nameKey='ip_version'
                />
            </div>
        </div>
    );
}
