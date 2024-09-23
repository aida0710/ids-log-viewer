import React from 'react';
import {IPacketLog} from '@/app/index/interface/IPacketLog';
import {Card, CardBody, CardFooter, CardHeader} from '@nextui-org/card';
import {Divider} from '@nextui-org/divider';
import {PayloadViewer} from '@/app/index/components/PayloadViewer';

export const PacketLogCard: React.FC<{ log: IPacketLog }> = ({ log }) => (
    <Card key={log.id}>
        <CardHeader>
            <h2 className='mb-2 text-xl font-semibold'>Packet Log ID: {log.id}</h2>
        </CardHeader>
        <Divider />
        <CardBody>
            <div className='grid grid-cols-2'>
                <p>Arrival Time: {new Date(log.arrival_time).toLocaleString()}</p>
                <p>Protocol: {log.protocol}</p>
                <p>IP Version: {log.ip_version}</p>
                <p>IP Header Length: {log.ip_header_length}</p>
                <p>Total Length: {log.total_length}</p>
                <p>TTL: {log.ttl}</p>
                <p>Fragment Offset: {log.fragment_offset}</p>
                <p>Source: {`${log.src_ip} : ${log.src_port}`}</p>
                <p>Destination: {`${log.dst_ip} : ${log.dst_port}`}</p>
                <p>Application Protocol: {log.application_protocol}</p>
                <p>TCP State: {log.tcp_state}</p>
                <p>Stream ID: {log.stream_id}</p>
                <p>Tcp Seq Num: {log.tcp_seq_num}</p>
                <p>Tcp Ack Num: {log.tcp_ack_num}</p>
                <p>Tcp Window Size: {log.tcp_window_size}</p>
                <p>Tcp Flags: {log.tcp_flags}</p>
                <p>Tcp Data Offset: {log.tcp_data_offset}</p>
                <p>Is From Client: {log.is_from_client ? 'Yes' : 'No'}</p>
            </div>
        </CardBody>
        <Divider />
        <CardFooter>
            <PayloadViewer payload={log.payload} protocol={log.protocol} />
        </CardFooter>
    </Card>
);