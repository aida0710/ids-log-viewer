import {ResponseStatus} from './ResponseStatus';

export interface IDataResponse {
    data: any;
    message: string;
    error: boolean;
    status: ResponseStatus;
}
