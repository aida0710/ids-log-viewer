import {NextRequest, NextResponse} from 'next/server';
import {SqlQuery} from '@/backend/repository/SqlQuery';
import {SuccessResponse} from '@/backend/response/SuccessResponse';
import {ErrorResponse} from '@/backend/response/ErrorResponse';
import {ResponseStatus} from '@/backend/response/ResponseStatus';

export async function GET(request: NextRequest) {
    try {
        const query = 'SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100';
        const [rows] = await SqlQuery.select(query, []);

        const successResponse = new SuccessResponse(rows, 'Logs fetched successfully', ResponseStatus.SUCCESS);

        return NextResponse.json(successResponse.toResponse());
    } catch (error) {
        console.error('Error fetching logs:', error);

        const errorResponse = new ErrorResponse({}, 'Error fetching logs', ResponseStatus.INTERNAL_SERVER_ERROR);

        return NextResponse.json(errorResponse.toResponse(), {status: ResponseStatus.INTERNAL_SERVER_ERROR});
    }
}
