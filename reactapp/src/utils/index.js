// @flow

export const fmtNum = (input: number | string): string =>
    Number.parseFloat(String(input)).toFixed(2)
