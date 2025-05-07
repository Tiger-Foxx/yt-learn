/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
/* tslint:disable */

export const parseJSON = (str: string) => {
    const start = str.indexOf('{');
    const end = str.lastIndexOf('}') + 1;
    return JSON.parse(str.substring(start, end));
};

export const parseHTML = (str: string, opener: string, closer: string) => {
    const start = str.indexOf(opener);
    const end = str.lastIndexOf(closer);
    const code =str.substring(start, end);
    console.log(code,opener)
    return code;
};