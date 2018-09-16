require('../../test/helpers.js')

import React from 'react'
import Budgets from './Budgets'
import Budget from './Budget'

const attrs = [
    {
        name: 'Monthly budget 1',
        user: 'http://localhost:8008/api/user/1/',
        amount: '10000.00',
        spent: 3568.12,
        left: 6431.88,
        average_per_day: 322.58,
        left_average_per_day: 111.81,
    },
    {
        name: 'Monthly budget 2',
        user: 'http://localhost:8008/api/user/1/',
        amount: '10000.00',
        spent: 3568.12,
        left: 6431.88,
        average_per_day: 322.58,
        left_average_per_day: 111.81,
    },
]

describe('<Budgets>', () => {
    let wrapper

    beforeEach(() => (wrapper = shallow(<Budgets list={attrs} />)))

    it('renders name', () => {
        expect(wrapper.find('h2').text()).toEqual('Budgets')
    })

    it('renders list of budgets', () => {
        expect(wrapper.find(Budget)).toHaveLength(2)
    })
})
