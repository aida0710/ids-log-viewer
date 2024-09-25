import {NextRequest, NextResponse} from 'next/server';
import {SqlQuery} from '@/backend/repository/SqlQuery';
import {SuccessResponse} from '@/backend/response/SuccessResponse';
import {ErrorResponse} from '@/backend/response/ErrorResponse';
import {ResponseStatus} from '@/backend/response/ResponseStatus';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '50', 10);
    const offset = (page - 1) * limit;

    try {
        const query = `
            SELECT *
            FROM packet_log
            ORDER BY arrival_time DESC LIMIT ?
            OFFSET ?
        `;
        const [rows] = await SqlQuery.select(query, [limit, offset]);

        // Base64エンコードされたペイロードを二重デコード
        const decodedRows = rows.map((row: any) => {
            let decodedPayload: string;
            try {
                // 最初のBase64デコード
                const buffer = Buffer.from(row.payload, 'base64');
                const firstDecoded = buffer.toString('utf-8');

                // 二回目のBase64デコード（必要な場合のみ）
                if (isBase64(firstDecoded)) {
                    const secondBuffer = Buffer.from(firstDecoded, 'base64');
                    decodedPayload = secondBuffer.toString('utf-8');
                } else {
                    decodedPayload = firstDecoded;
                }
            } catch (error) {
                console.error('Error decoding payload:', error);
                decodedPayload = 'Error decoding payload';
            }
            return {
                ...row,
                payload: decodedPayload,
            };
        });

        // デコードされたペイロードをログ出力（デバッグ用）

        //decodedRows.forEach((row: any) => {
        //    console.log('Decoded payload:', row.payload);
        //});

        const countQuery = 'SELECT COUNT(*) as total FROM packet_log';
        const [countResult] = await SqlQuery.select(countQuery, []);
        const totalCount = countResult[0].total;

        const successResponse = new SuccessResponse(
            {
                logs: decodedRows,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                },
            },
            'Packet logs fetched successfully',
            ResponseStatus.SUCCESS,
        );

        const response = successResponse.toResponse();
        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching packet logs:', error);

        const errorResponse = new ErrorResponse({}, 'データベースにアクセスできませんでした', ResponseStatus.INTERNAL_SERVER_ERROR);

        return NextResponse.json(errorResponse.toResponse(), {status: ResponseStatus.INTERNAL_SERVER_ERROR});
    }
}

// 文字列がBase64エンコードされているかどうかを判断する関数
function isBase64(str: string) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}
