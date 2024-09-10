import {ResponseStatus} from './ResponseStatus';
import {IDataResponse} from './IDataResponse';

/**
 * クライアントかサーバーか関係なくレスポンスを返却できます。
 * @note toResponseを呼び出すことでレスポンスを返却します。
 * @returns {Promise<IDataResponse>}
 */
export class DataResponse {
    constructor(
        public data: any = {},
        public message: string = '',
        public error: boolean,
        private status: ResponseStatus,
    ) {}

    /**
     * レスポンスを返却します。
     * @returns {Promise<IDataResponse>}
     */
    protected toResponse(): IDataResponse {
        return {
            data: this.data,
            message: this.message,
            error: this.error,
            status: this.status,
        };
    }
}
