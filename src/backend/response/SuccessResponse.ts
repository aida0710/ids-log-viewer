import {ResponseStatus} from './ResponseStatus';
import {DataResponse} from './DataResponse';
import {IDataResponse} from './IDataResponse';

/**
 * 成功したリクエストのレスポンスを返却します。
 */
export class SuccessResponse extends DataResponse {
    constructor(data: any = {}, message: string, status: ResponseStatus) {
        super(data, message, false, status);
    }

    toResponse(): IDataResponse {
        return super.toResponse();
    }
}
