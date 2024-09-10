export interface IPacketLog {
    id: number;
    arrival_time: string;
    protocol: string;
    ip_version: number;
    src_ip: string;
    dst_ip: string;
    src_port: number;
    dst_port: number;
    ip_header_length: number;
    total_length: number;
    ttl: number;
    fragment_offset: number;
    tcp_seq_num: number;
    tcp_ack_num: number;
    tcp_window_size: number;
    tcp_flags: number;
    tcp_data_offset: number;
    payload_length: number;
    stream_id: string;
    is_from_client: boolean;
    tcp_state: string;
    application_protocol: string;
    payload: {
        type: string;
        data: number[];
    };
    created_at: string;
}
