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
        const topApplicationProtocolsQuery = 'SELECT application_protocol, COUNT(*) as count FROM packet_log WHERE application_protocol IS NOT NULL GROUP BY application_protocol ORDER BY count DESC LIMIT 5';
        const packetSizeDistributionQuery = 'SELECT CASE WHEN total_length < 64 THEN "< 64" WHEN total_length < 512 THEN "64-511" WHEN total_length < 1518 THEN "512-1517" ELSE "> 1517" END AS size_range, COUNT(*) as count FROM packet_log GROUP BY size_range ORDER BY FIELD(size_range, "< 64", "64-511", "512-1517", "> 1517")';
        const tcpFlagsDistributionQuery = 'SELECT tcp_flags, COUNT(*) as count FROM packet_log WHERE protocol = "TCP" GROUP BY tcp_flags ORDER BY count DESC LIMIT 5';
        const hourlyTrafficQuery = 'SELECT HOUR(arrival_time) as hour, COUNT(*) as count FROM packet_log GROUP BY hour ORDER BY hour';

        const [totalPacketsResult] = await SqlQuery.select(totalPacketsQuery, []);
        const [uniqueSourceIPsResult] = await SqlQuery.select(uniqueSourceIPsQuery, []);
        const [uniqueDestinationIPsResult] = await SqlQuery.select(uniqueDestinationIPsQuery, []);
        const [topProtocols] = await SqlQuery.select(topProtocolsQuery, []);
        const [topSourceIPs] = await SqlQuery.select(topSourceIPsQuery, []);
        const [topDestinationIPs] = await SqlQuery.select(topDestinationIPsQuery, []);
        const [topApplicationProtocols] = await SqlQuery.select(topApplicationProtocolsQuery, []);
        const [packetSizeDistribution] = await SqlQuery.select(packetSizeDistributionQuery, []);
        const [tcpFlagsDistribution] = await SqlQuery.select(tcpFlagsDistributionQuery, []);
        const [hourlyTraffic] = await SqlQuery.select(hourlyTrafficQuery, []);

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
            hourlyTraffic,
        };

        const successResponse = new SuccessResponse(statistics, 'Statistics fetched successfully', ResponseStatus.SUCCESS);

        return NextResponse.json(successResponse.toResponse());
    } catch (error) {
        console.error('Error fetching statistics:', error);

        const errorResponse = new ErrorResponse({}, '統計情報の取得中にエラーが発生しました', ResponseStatus.INTERNAL_SERVER_ERROR);

        return NextResponse.json(errorResponse.toResponse(), {status: ResponseStatus.INTERNAL_SERVER_ERROR});
    }
}
