import {useCallback, useEffect, useRef, useState} from 'react';
import {IPacketLog} from '@/app/index/interface/IPacketLog';
import {IPaginationInfo} from '@/app/index/interface/IPaginationInfo';
import axios from 'axios';
import {IDataResponse} from '@/backend/response/IDataResponse';
import {ResponseStatus} from '@/backend/response/ResponseStatus';

export const usePacketLogs = (initialPage: number) => {
    const [logs, setLogs] = useState<IPacketLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<IPacketLog[]>([]);
    const [pagination, setPagination] = useState<IPaginationInfo>({
        currentPage: initialPage,
        totalPages: 1,
        totalCount: 0,
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [minPayloadLength, setMinPayloadLength] = useState(0);
    const currentPageRef = useRef(initialPage);

    const fetchLogs = useCallback(async (page: number) => {
        setIsLoading(true);
        try {
            const response = await axios.get<IDataResponse>(`/api/packet-logs?page=${page}&limit=50`);
            const {data, error, status, message} = response.data;

            if (error || status !== ResponseStatus.SUCCESS) {
                setError(message || 'データベースからログを取得できませんでした');
            } else if (page === currentPageRef.current) {
                setLogs(data.logs);
                setPagination(data.pagination);
                setError(null);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error('Error fetching packet logs:', error);
            setError('データベースからログを取得できませんでした');
        } finally {
            setIsLoading(false);
            setIsInitialLoading(false);
        }
    }, []);

    useEffect(() => {
        setFilteredLogs(logs.filter((log) => log.payload.length >= minPayloadLength));
    }, [logs, minPayloadLength]);

    return {
        logs: filteredLogs,
        pagination,
        error,
        isLoading,
        isInitialLoading,
        lastUpdated,
        minPayloadLength,
        setMinPayloadLength,
        fetchLogs,
        currentPageRef,
    };
};