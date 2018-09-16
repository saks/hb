require('../../test/helpers.js')

import React from 'react'
import Budget from './Budget'

const attrs = {
    name: 'Monthly budget',
    user: 'http://localhost:8008/api/user/1/',
    amount: '10000.00',
    spent: 3568.12,
    left: 6431.88,
    average_per_day: 322.58,
    left_average_per_day: 111.81,
}

describe('<Budget>', () => {
    let wrapper

    beforeEach(() => (wrapper = shallow(<Budget attrs={attrs} />)))

    it('renders name', () => {
        expect(wrapper.find('h5').text()).toEqual('Monthly budget')
    })

    test('average per day', () => {
        expect(wrapper.text()).toContain('left 111.81 / day')
    })

    test('left of total', () => {
        expect(wrapper.text()).toContain('left 6431.88 of 10000.00')
    })

    test('progress bar', () => {
        expect(wrapper.find('.progress-bar').props().style.width).toEqual('36%')
    })
})
