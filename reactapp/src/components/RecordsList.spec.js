require('../../test/helpers.js')
import React from 'react'
import sinon from 'sinon'

import RecordsList from './RecordsList'
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

describe('<RecordsList />', () => {
    let visitNextPage, visitPrevPage

    const render = (list = []) =>
        shallow(
            <RecordsList
                history={history}
                list={list}
                visitNextPage={visitNextPage}
                visitPrevPage={visitPrevPage}
                currentPage={10}
            />
        )

    beforeEach(() => {
        visitPrevPage = sinon.spy()
        visitNextPage = sinon.spy()
    })

    it('renders with empty list', () => {
        const wrapper = render()
        expect(wrapper.find(Record)).toHaveLength(0)
    })

    it('renders 3 records', () => {
        const wrapper = render([attrs, attrs, attrs])
        expect(wrapper.find(Record)).toHaveLength(3)
    })

    test('visit prev page', () => {
        const wrapper = render()

        wrapper.find('.visit-prev-page').simulate('click')
        expect(visitPrevPage.calledOnce).toEqual(true)
    })

    test('visit next page', () => {
        const wrapper = render()

        wrapper.find('.visit-next-page').simulate('click')
        expect(visitNextPage.calledOnce).toEqual(true)
    })

    it('should show current page number', () => {
        const wrapper = render([attrs, attrs, attrs])
        expect(wrapper.find('.current-page-number').text()).toEqual('10')
    })
})
