import {NextRequest, NextResponse} from 'next/server';
import {SqlQuery} from '@/backend/repository/SqlQuery';
import {SuccessResponse} from '@/backend/response/SuccessResponse';
import {ErrorResponse} from '@/backend/response/ErrorResponse';
import {ResponseStatus} from '@/backend/response/ResponseStatus';

export async function GET(request: NextRequest) {
    try {
        const totalPacketsQuery = 'SELECT COUNT(*) as total FROM packet_log';
        const uniqueSourceIPsQuery = 'SELECT COUNT(DISTINCT src_ip) as total FROM packet_log';
        const uniqueDestinationIPsQuery = 'SELECT COUNT(DISTINCT dst_ip) as total FROM packet_log';
        const topProtocolsQuery = 'SELECT protocol, COUNT(*) as count FROM packet_log GROUP BY protocol ORDER BY count DESC LIMIT 5';
        const topSourceIPsQuery = 'SELECT src_ip as ip, COUNT(*) as count FROM packet_log GROUP BY src_ip ORDER BY count DESC LIMIT 5';
        const topDestinationIPsQuery = 'SELECT dst_ip as ip, COUNT(*) as count FROM packet_log GROUP BY dst_ip ORDER BY count DESC LIMIT 5';
        const topApplicationProtocolsQuery =
            'SELECT application_protocol, COUNT(*) as count FROM packet_log WHERE application_protocol IS NOT NULL GROUP BY application_protocol ORDER BY count DESC LIMIT 5';
        const packetSizeDistributionQuery =
            'SELECT CASE WHEN total_length < 64 THEN "< 64" WHEN total_length < 512 THEN "64-511" WHEN total_length < 1518 THEN "512-1517" ELSE "> 1517" END AS size_range, COUNT(*) as count FROM packet_log GROUP BY size_range ORDER BY FIELD(size_range, "< 64", "64-511", "512-1517", "> 1517")';
        const tcpFlagsDistributionQuery =
            'SELECT tcp_flags, COUNT(*) as count FROM packet_log WHERE protocol = "TCP" GROUP BY tcp_flags ORDER BY count DESC LIMIT 5';
        const avgPacketSizeQuery = 'SELECT AVG(total_length) as avg_size FROM packet_log';
        const totalTrafficVolumeQuery = 'SELECT SUM(total_length) as total_volume FROM packet_log';
        const ipVersionDistributionQuery = 'SELECT ip_version, COUNT(*) as count FROM packet_log GROUP BY ip_version';
        const maxPacketSizeQuery = 'SELECT MAX(total_length) as max_size FROM packet_log';
        const minPacketSizeQuery = 'SELECT MIN(total_length) as min_size FROM packet_log';
        const uniqueApplicationProtocolsQuery = 'SELECT COUNT(DISTINCT application_protocol) as total FROM packet_log WHERE application_protocol IS NOT NULL';
        const totalTcpPacketsQuery = 'SELECT COUNT(*) as total FROM packet_log WHERE protocol = "TCP"';
        const totalUdpPacketsQuery = 'SELECT COUNT(*) as total FROM packet_log WHERE protocol = "UDP"';
        const latestPacketTimeQuery = 'SELECT MAX(arrival_time) as latest_time FROM packet_log';
        const oldestPacketTimeQuery = 'SELECT MIN(arrival_time) as oldest_time FROM packet_log';

        const [totalPacketsResult] = await SqlQuery.select(totalPacketsQuery, []);
        const [uniqueSourceIPsResult] = await SqlQuery.select(uniqueSourceIPsQuery, []);
        const [uniqueDestinationIPsResult] = await SqlQuery.select(uniqueDestinationIPsQuery, []);
        const [topProtocols] = await SqlQuery.select(topProtocolsQuery, []);
        const [topSourceIPs] = await SqlQuery.select(topSourceIPsQuery, []);
        const [topDestinationIPs] = await SqlQuery.select(topDestinationIPsQuery, []);
        const [topApplicationProtocols] = await SqlQuery.select(topApplicationProtocolsQuery, []);
        const [packetSizeDistribution] = await SqlQuery.select(packetSizeDistributionQuery, []);
        const [tcpFlagsDistribution] = await SqlQuery.select(tcpFlagsDistributionQuery, []);
        const [avgPacketSizeResult] = await SqlQuery.select(avgPacketSizeQuery, []);
        const [totalTrafficVolumeResult] = await SqlQuery.select(totalTrafficVolumeQuery, []);
        const [ipVersionDistribution] = await SqlQuery.select(ipVersionDistributionQuery, []);
        const [maxPacketSizeResult] = await SqlQuery.select(maxPacketSizeQuery, []);
        const [minPacketSizeResult] = await SqlQuery.select(minPacketSizeQuery, []);
        const [uniqueApplicationProtocolsResult] = await SqlQuery.select(uniqueApplicationProtocolsQuery, []);
        const [totalTcpPacketsResult] = await SqlQuery.select(totalTcpPacketsQuery, []);
        const [totalUdpPacketsResult] = await SqlQuery.select(totalUdpPacketsQuery, []);
        const [latestPacketTimeResult] = await SqlQuery.select(latestPacketTimeQuery, []);
        const [oldestPacketTimeResult] = await SqlQuery.select(oldestPacketTimeQuery, []);

        const statistics = {
            totalPackets: totalPacketsResult[0].total,
            uniqueSourceIPs: uniqueSourceIPsResult[0].total,
            uniqueDestinationIPs: uniqueDestinationIPsResult[0].total,
            topProtocols,
            topSourceIPs,
            topDestinationIPs,
            topApplicationProtocols,
            packetSizeDistribution,
            tcpFlagsDistribution,
            avgPacketSize: avgPacketSizeResult[0].avg_size !== null ? Number(avgPacketSizeResult[0].avg_size) : null,
            totalTrafficVolume: totalTrafficVolumeResult[0].total_volume !== null ? Number(totalTrafficVolumeResult[0].total_volume) : null,
            ipVersionDistribution,
            maxPacketSize: maxPacketSizeResult[0].max_size !== null ? Number(maxPacketSizeResult[0].max_size) : null,
            minPacketSize: minPacketSizeResult[0].min_size !== null ? Number(minPacketSizeResult[0].min_size) : null,
            uniqueApplicationProtocols: uniqueApplicationProtocolsResult[0].total,
            totalTcpPackets: totalTcpPacketsResult[0].total,
            totalUdpPackets: totalUdpPacketsResult[0].total,
            latestPacketTime: latestPacketTimeResult[0].latest_time,
            oldestPacketTime: oldestPacketTimeResult[0].oldest_time,
        };

        const successResponse = new SuccessResponse(statistics, 'Statistics fetched successfully', ResponseStatus.SUCCESS);

        return NextResponse.json(successResponse.toResponse());
    } catch (error) {
        console.error('Error fetching statistics:', error);

        const errorResponse = new ErrorResponse({}, '統計情報の取得中にエラーが発生しました', ResponseStatus.INTERNAL_SERVER_ERROR);

        return NextResponse.json(errorResponse.toResponse(), {status: ResponseStatus.INTERNAL_SERVER_ERROR});
    }
}
