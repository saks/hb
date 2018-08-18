require('../../test/helpers.js');
import React from 'react';
import sinon from 'sinon';

import RecordForm from './RecordForm';
import RecordModel from '../models/Record';
import Tag from './Tag';

const attrs = {
    id: 85,
    user: 'http://localhost:8000/api/user/1/',
    tags: ['foo-tag', 'bar-tag'],
    amount: { amount: 12.5, currency: { code: 'CAD', name: 'Canadian Dollar' } },
    transaction_type: 'EXP',
    created_at: 1533407979.0,
};

class Wrapper {
    constructor(attrs, tags = ['foo-tag', 'bar-tag']) {
        this.submit = sinon.spy();
        this.history = { goBack: sinon.spy() };

        this.wrapper = shallow(
            <RecordForm
                attrs={{ ...attrs }}
                history={this.history}
                submit={this.submit}
                tags={tags}
            />
        );
    }

    get amountInput() {
        return this.wrapper.find('#record-form-amount');
    }

    get transactionTypesSelect() {
        return this.wrapper.find('select[name="transaction_type"]');
    }

    set amount(value) {
        const input = this.wrapper.find('#record-form-amount');
        input.simulate('change', { target: { value: value } });
    }

    set transactionType(value) {
        const select = this.wrapper.find('select');
        select.simulate('change', { target: { value: value } });
    }

    get calculateButton() {
        return this.wrapper.find('button[children="calculate"]');
    }

    get record() {
        return this.wrapper.state().record;
    }

    tag(name) {
        return this.wrapper
            .find(Tag)
            .filterWhere(tag => {
                // console.log(tag.props);
                return name === tag.props().name;
            })
            .first();
    }

    find(...rest) {
        return this.wrapper.find(...rest);
    }
}

describe('<RecordForm />', () => {
    describe('showing attribute values', () => {
        it('should have empty list of tags', () => {
            const wrapper = new Wrapper(attrs, []);

            expect(wrapper.find('#tagsContainer').text()).toEqual('');
            expect(wrapper.find(Tag)).toHaveLength(0);
        });

        it('should render tags', () => {
            const wrapper = new Wrapper(attrs, ['foo', 'bar']);
            expect(wrapper.find(Tag)).toHaveLength(2);
        });

        it('should display correct amount', () => {
            const wrapper = new Wrapper(attrs);
            expect(wrapper.amountInput.props().value).toEqual('12.5');
        });

        it('should display correct transaction type', () => {
            const wrapper = new Wrapper(attrs);
            expect(wrapper.transactionTypesSelect.props().value).toEqual('EXP');
        });

        it('should display toggled tags', () => {
            const wrapper = new Wrapper(attrs, ['foo-tag', 'bar-tag', 'zzz']);

            expect(wrapper.tag('foo-tag').props().isSelected).toBe(true);
            expect(wrapper.tag('bar-tag').props().isSelected).toBe(true);
            expect(wrapper.tag('zzz').props().isSelected).toBe(false);
        });
    });

    describe('page header', () => {
        it('should have new record header', () => {
            const wrapper = new Wrapper({ ...attrs, id: undefined });
            expect(wrapper.find('h2').text()).toEqual('Add New Record');
        });

        it('should have edit record header', () => {
            const wrapper = new Wrapper(attrs);
            expect(wrapper.find('h2').text()).toEqual('Edit Record');
        });
    });

    describe('actions', () => {
        it('should submit successfully', () => {
            const wrapper = new Wrapper(attrs);

            wrapper.find('button[children="Save"]').simulate('click');

            expect(wrapper.submit.calledOnceWith(wrapper.record)).toEqual(true);
        });

        it('should submit and add another', () => {
            const wrapper = new Wrapper(attrs);

            wrapper.find('button[children="Save & Add"]').simulate('click');

            expect(wrapper.submit.calledOnceWith(wrapper.record)).toEqual(true);
        });

        it('should go back', () => {
            const wrapper = new Wrapper(attrs);

            wrapper.find('button[children="Cancel"]').simulate('click');

            expect(wrapper.history.goBack.calledOnce).toEqual(true);
        });

        it('should calculate correct expression', () => {
            const wrapper = new Wrapper(attrs);

            wrapper.amount = '1 + 2.2';
            wrapper.calculateButton.simulate('click');

            expect(wrapper.find('#record-form-amount').props().value).toEqual('3.2');
            expect(wrapper.record.amount).toEqual(3.2);
        });

        it('should do nothing with wrong expression', () => {
            const wrapper = new Wrapper(attrs);

            wrapper.amount = '1 + asd';
            wrapper.calculateButton.simulate('click');
            expect(wrapper.find('#record-form-amount').props().value).toEqual('1 + asd');
        });

        it('should update transaction type', () => {
            const wrapper = new Wrapper(attrs);

            expect(wrapper.record.transaction_type).toEqual('EXP');
            wrapper.transactionType = 'INC';
            expect(wrapper.record.transaction_type).toEqual('INC');
        });

        it('should toggle tag', () => {
            const wrapper = new Wrapper(attrs);

            expect(wrapper.record.tags.has('foo-tag')).toBe(true);

            wrapper
                .tag('foo-tag')
                .props()
                .toggle('foo-tag');

            expect(wrapper.record.tags.has('foo-tag')).toBe(false);
        });
    });
});
