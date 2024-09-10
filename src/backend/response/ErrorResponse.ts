import {DataResponse} from './DataResponse';
import {ResponseStatus} from './ResponseStatus';
import {IDataResponse} from './IDataResponse';

/**
 * エラーレスポンスを返却します。
 */
export class ErrorResponse extends DataResponse {
    constructor(data: any = {}, message: string, status: ResponseStatus) {
        super(data, message, true, status);
    }

    toResponse(): IDataResponse {
        return super.toResponse();
    }
}
