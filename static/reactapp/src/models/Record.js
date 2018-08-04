// @flow

import { EXP } from '../constants/TransactionTypes';

const DEFAULT_CURRENCY = 'CAD';

export type AmountType = {
    currency: string,
    amount: string,
};

export default class RecordModel {
    transaction_type: string;
    currency: string;
    amount: AmountType;
    selectedTags: Set<string>;
    id: number;
    tags: Array<string>;

    // TODO: add type for attrs
    constructor(attrs: any = {}) {
        attrs = JSON.parse(JSON.stringify(attrs));
        attrs.selectedTags = new Set(attrs.tags);

        if (attrs.amount && 'object' === typeof attrs.amount.currency) {
            attrs.amount.currency = attrs.amount.currency.code;
        }

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

    toggleTag(name: string) {
        if (this.selectedTags.has(name)) {
            this.selectedTags.delete(name);
        } else {
            this.selectedTags.add(name);
        }

        this.tags = Array.from(this.selectedTags);

        return this;
    }

    get isPersisted() {
        return Boolean(this.id);
    }

    asJson() {
        const copy = new RecordModel(this);
        delete copy.selectedTags;

        return copy;
    }
}
