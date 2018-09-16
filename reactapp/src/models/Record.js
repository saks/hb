// @flow

import { EXP } from '../constants/TransactionTypes'

import type { Attrs } from '../types/Record'

const DEFAULT_CURRENCY = 'CAD'
const DEFAULT_CURRENCY_NAME = 'Canadian Dollar'

export type AmountType = {
    currency: string,
    amount: string,
}

export default class RecordModel {
    id: ?number
    user: string
    amount: number
    currency: string
    currency_name: string
    transaction_type: string
    tags: Set<string>
    created_at: number

    static from(attrs: Attrs): RecordModel {
        const record = new RecordModel()

        if (undefined !== attrs.id) {
            record.id = attrs.id
        }
        record.user = attrs.user
        record.amount = parseFloat(attrs.amount.amount) || 0.0
        record.currency = attrs.amount.currency.code
        record.currency_name = attrs.amount.currency.name
        record.transaction_type = attrs.transaction_type
        record.tags = new Set(attrs.tags)
        record.created_at = attrs.created_at

        return record
    }

    static default() {
        const attrs: Attrs = {
            id: 0,
            user: '',
            tags: [],
            amount: {
                amount: 0,
                currency: { code: DEFAULT_CURRENCY, name: DEFAULT_CURRENCY_NAME },
            },
            transaction_type: EXP,
            created_at: 0,
        }

        const record = RecordModel.from(attrs)
        delete record.id

        return record
    }

    toggleTag(name: string) {
        if (this.tags.has(name)) {
            this.tags.delete(name)
        } else {
            this.tags.add(name)
        }

        return this
    }

    get isPersisted(): boolean {
        return 'number' === typeof this.id
    }

    get asJson() {
        const attrs = JSON.parse(JSON.stringify(this))
        attrs.amount = {
            amount: this.amount,
            currency: { code: this.currency, name: this.currency_name },
        }
        attrs.tags = Array.from(this.tags)

        delete attrs.currency
        delete attrs.currency_name

        return attrs
    }

    clone() {
        return RecordModel.from(this.asJson)
    }
}
