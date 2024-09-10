'use client';

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {IDataResponse} from '@/backend/response/IDataResponse';
import {ResponseStatus} from '@/backend/response/ResponseStatus';

interface Log {
    id: number;
    message: string;
    timestamp: string;
}

const LogViewer: React.FC = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        try {
            const response = await axios.get<IDataResponse>('/api/logs');
            const {data, error, status, message} = response.data;

            if (error || status !== ResponseStatus.SUCCESS) {
                throw new Error(message || 'Failed to fetch logs');
            }

            setLogs(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching logs:', error);
            setError('Failed to fetch logs. Please try again later.');
        }
    };

    useEffect(() => {
        fetchLogs().then((r) => console.log(r));
        const intervalId = setInterval(fetchLogs, 5000); // Poll every 5 seconds

        return () => clearInterval(intervalId);
    }, []);

    if (error) {
        return <div className='text-red-500'>{error}</div>;
    }

    return (
        <div className='container mx-auto p-4'>
            <h1 className='mb-4 text-2xl font-bold'>Log Viewer</h1>
            <div className='rounded-lg bg-gray-100 p-4'>
                {logs.map((log) => (
                    <div
                        key={log.id}
                        className='mb-2 rounded bg-white p-2 shadow'>
                        <span className='font-semibold'>{new Date(log.timestamp).toLocaleString()}</span>
                        <p>{log.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogViewer;
