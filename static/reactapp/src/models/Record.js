import { EXP } from '../constants/TransactionTypes';

const DEFAULT_CURRENCY = 'CAD';

export default class RecordModel {
    constructor(attrs = {}) {
        attrs = JSON.parse(JSON.stringify(attrs));
        attrs.selectedTags = new Set(attrs.tags);
        Object.assign(this, attrs);

        return this;
    }

    static default() {
        const result = new RecordModel();

        result.selectedTags = new Set();
        result.amount = { currency: DEFAULT_CURRENCY, amount: '' };
        result.transaction_type = EXP;
        result.currency = DEFAULT_CURRENCY;

        return result;
    }

    toggleTag(name) {
        if (this.selectedTags.has(name)) {
            this.selectedTags.delete(name);
        } else {
            this.selectedTags.add(name);
        }

        this.tags = Array.from(this.selectedTags);

        return this;
    }

    asJson() {
        const copy = new RecordModel(this);
        delete copy.selectedTags;

        return copy;
    }
}
