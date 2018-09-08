// @flow

export default (text: string): string | null => {
    try {
        // eslint-disable-next-line
        const evalResult = Number.parseFloat(eval(text));
        if (Number.isFinite(evalResult)) {
            return evalResult.toFixed(2);
        }
    } catch (_err) {}
    return null;
};
