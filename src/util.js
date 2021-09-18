/* @flow */

import { AMPLITUDE_URL } from './config';
import type { Payload } from './types';

type CanUseBeaconOptions = {|
    headers : { [string] : string },
    enableSendBeacon : boolean
|};

type SendBeaconOptions = {|
    url : string,
    data : JSON,
    useBlob : boolean
|};

const canUseSendBeacon = ({ headers, enableSendBeacon } : CanUseBeaconOptions) : boolean => {
    const hasHeaders = headers && Object.keys(headers).length;
    if (window && window.navigator.sendBeacon && !hasHeaders && enableSendBeacon && window.Blob) {
        return true;
    }

    return false;
};

const isAmplitude = (url : string) : boolean => {
    if (url === AMPLITUDE_URL) {
        return true;
    }

    return false;
};

const sendBeacon = ({ url, data, useBlob = true } : SendBeaconOptions) : boolean => {
    try {
        const json = JSON.stringify(data);

        if (useBlob) {
            const blob = new Blob([ json ], { type: 'application/json' });
            return window.navigator.sendBeacon(url, blob);
        }
        
        // eslint-disable-next-line compat/compat
        return window.navigator.sendBeacon(url, json);
    } catch (e) {
        return false;
    }
};

const extendIfDefined = (target : Payload, source : Payload) => {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
};

export { canUseSendBeacon, extendIfDefined, isAmplitude, sendBeacon };
