// @flow

export default (text: string): number | null => {
    try {
        // eslint-disable-next-line
        const evalResult = Number.parseFloat(eval(text));
        if (Number.isFinite(evalResult)) {
            const floatStr = evalResult.toFixed(2);
            return parseFloat(floatStr);
        }
    } catch (_err) {}
    return null;
};
