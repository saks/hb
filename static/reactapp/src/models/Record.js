// @flow

import { EXP } from '../constants/TransactionTypes';

import type { RecordAttrs } from '../types/Data';

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
    created_at: number;

    // TODO: add type for attrs
    constructor(attrs: RecordAttrs) {
        attrs = JSON.parse(JSON.stringify(attrs));
        attrs.selectedTags = new Set(attrs.tags);

        if (attrs.amount && 'object' === typeof attrs.amount.currency) {
            attrs.amount.currency = attrs.amount.currency.code;
        }

        attrs.amount.amount = parseFloat(attrs.amount.amount) || '';

        Object.assign(this, attrs);

        return this;
    }

    static default() {
        const attrs: RecordAttrs = {
            id: 1,
            user: '',
            tags: [],
            amount: { amount: 0, currency: { code: DEFAULT_CURRENCY, name: DEFAULT_CURRENCY } },
            transaction_type: EXP,
            created_at: 0,
        };
        return new RecordModel(attrs);
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
        const copy = this.clone();
        delete copy.selectedTags;

        return copy;
    }

    clone() {
        const result = new RecordModel();
        const attrs = JSON.parse(JSON.stringify(this));
        attrs.selectedTags = new Set(attrs.xtags);

        Object.assign(result, attrs);

        return result;
    }
}
