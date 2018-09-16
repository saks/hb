require('../../test/helpers.js')
import React from 'react'
import sinon from 'sinon'

import Record from './Record'
import RecordModel from '../models/Record'

const attrs = {
    id: 85,
    user: 'http://localhost:8000/api/user/1/',
    tags: ['foo-tag', 'bar-tag'],
    amount: { amount: 12.5, currency: { code: 'CAD', name: 'Canadian Dollar' } },
    transaction_type: 'EXP',
    created_at: 1533407979.0,
}

describe('<Record>', () => {
    let wrapper, history

    beforeEach(() => (history = { push: sinon.spy() }))

    describe('with expence model', () => {
        beforeEach(() => {
            const model = RecordModel.from(attrs)

            wrapper = shallow(<Record model={model} history={history} />)
        })

        it('renders tags', () => {
            expect(wrapper.find('.tags').text()).toEqual('foo-tag, bar-tag')
        })

        it('renders date', () => {
            expect(wrapper.find('.date').text()).toEqual('Aug 04, 03:39')
        })

        it('renders amount', () => {
            expect(wrapper.find('.amount').text()).toEqual('12.50')
        })

        it('renders expence', () => {
            expect(wrapper.find('div.card.bd-callout-warning').exists()).toBe(true)
        })

        it('handles click', () => {
            wrapper.find('.card').simulate('click')

            expect(history.push.calledOnce).toEqual(true)
            expect(history.push.calledWith('/records/85')).toEqual(true)
        })
    })

    describe('with income model', () => {
        beforeEach(() => {
            const model = RecordModel.from(attrs)
            model.transaction_type = 'INC'

            wrapper = shallow(<Record model={model} />)
        })

        it('renders income', () => {
            expect(wrapper.find('div.card.bd-callout-success').exists()).toBe(true)
        })
    })
})
