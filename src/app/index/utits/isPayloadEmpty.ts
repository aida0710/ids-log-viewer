import {IPacketLog} from '@/app/index/interface/IPacketLog';

export const isPayloadEmpty = (payload: IPacketLog['payload']): boolean => {
    if (payload && payload.type === 'Buffer' && payload.data) {
        const text = Buffer.from(payload.data).toString().replace(/\s+/g, '');
        return text === '';
    }
    return true;
};