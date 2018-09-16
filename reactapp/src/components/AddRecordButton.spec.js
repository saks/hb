require('../../test/helpers.js')

import React from 'react'
import { Link, MemoryRouter } from 'react-router-dom'

import AddRecordButton from './AddRecordButton'
import PlusIcon from './PlusIcon'

describe('<AddRecordButton>', () => {
    let wrapper
    beforeEach(() => {
        wrapper = mount(
            <MemoryRouter initialEntries={['/records']} initialIndex={1}>
                <AddRecordButton />
            </MemoryRouter>
        )
    })

    it('renders plus icon', () => {
        expect(wrapper.find(PlusIcon)).toHaveLength(1)
    })

    it('renders link', () => {
        expect(wrapper.exists('Link')).toEqual(true)
        expect(wrapper.find(Link).props().to).toEqual('/records/new')
    })

    it('should lead to record form', () => {
        // TODO:
        // console.log(wrapper.context());
        wrapper.find('a').simulate('click')
        // console.log(wrapper.find(Link).context());
        // console.log(wrapper.props());
        // expect()
    })
})
