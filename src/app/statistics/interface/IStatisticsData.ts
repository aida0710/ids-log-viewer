export interface IStatisticsData {
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