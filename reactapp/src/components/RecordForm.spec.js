require('../../test/helpers.js');
import React from 'react';
import sinon from 'sinon';

const wasm = require('./../wasm/home_budget_bg');
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
        const submit = sinon.stub();
        const history = { goBack: sinon.stub(), push: sinon.stub() };

        this.submit = submit;
        this.history = history;

        this.wrapper = shallow(
            <RecordForm attrs={{ ...attrs }} history={history} submit={submit} tags={tags} />
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

    get state() {
        return this.wrapper.state();
    }

    click(buttonText) {
        return this.find(`button[children="${buttonText}"]`).simulate('click');
    }

    tag(name) {
        return this.wrapper
            .find(Tag)
            .filterWhere(tag => {
                return name === tag.props().name;
            })
            .first();
    }

    find(...rest) {
        return this.wrapper.find(...rest);
    }
}

describe('<RecordForm />', () => {
    beforeAll(async () => await wasm.booted);

    describe('showing attribute values', () => {
        it('should have empty list of tags', () => {
            const newAttrs = { ...attrs, tags: [] };
            const wrapper = new Wrapper(newAttrs, []);

            expect(wrapper.find('#tagsContainer').text()).toEqual('');
            expect(wrapper.find(Tag)).toHaveLength(0);
        });

        it('should render tags from attrs and from user profile', () => {
            const wrapper = new Wrapper(attrs, ['foo', 'bar']);
            expect(wrapper.find(Tag)).toHaveLength(4);
        });

        it('should render tags from attrs only', () => {
            const wrapper = new Wrapper(attrs, []);
            expect(wrapper.find(Tag)).toHaveLength(2);
        });

        it('should render tags from user profile only', () => {
            const newAttrs = { ...attrs, tags: [] };
            const wrapper = new Wrapper(newAttrs, ['foo', 'bar']);
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
        describe('submit', () => {
            describe('with "Save" button', () => {
                it('should submit successfully and redirect to records page', async () => {
                    const wrapper = new Wrapper(attrs, ['foo']);
                    wrapper.submit.resolves(true);

                    await wrapper.click('Save');

                    expect(wrapper.history.push.calledOnceWith('/records')).toBe(true);
                });

                it('should submit updated value if expression is OK', async () => {
                    const wrapper = new Wrapper(attrs, ['foo']);
                    wrapper.submit.resolves(true);

                    // set amount to an expression
                    wrapper.amount = '1 + 2.2';
                    // calculate result
                    await wrapper.click('calculate');
                    // submit
                    await wrapper.click('Save');

                    expect(wrapper.submit.callCount).toEqual(1);

                    const submittedRecord = wrapper.submit.lastCall.args[0];
                    expect(submittedRecord.amount).toEqual(3.2);
                });

                it('should not submit if expression is not OK', async () => {
                    const wrapper = new Wrapper(attrs, ['foo']);
                    wrapper.submit.resolves(true);

                    // set amount to an expression
                    wrapper.amount = '1 + foo';
                    // calculate result
                    await wrapper.click('calculate');
                    // submit
                    await wrapper.click('Save');

                    expect(wrapper.submit.notCalled).toBe(true);
                });

                it('should not redirect if submit failed', async () => {
                    const wrapper = new Wrapper(attrs, ['foo']);
                    wrapper.submit.resolves(false);

                    await wrapper.click('Save');

                    expect(wrapper.history.push.notCalled).toBe(true);
                });
            });

            describe('with "Save & Add" button', () => {
                it('should submit successfully', async () => {
                    const wrapper = new Wrapper(attrs);
                    wrapper.submit.resolves(true);

                    await wrapper.click('Save & Add');

                    expect(wrapper.submit.calledOnce).toEqual(true);
                    expect(wrapper.history.push.notCalled).toBe(true);
                });

                it('should submit updated value if expression is OK', async () => {
                    const wrapper = new Wrapper(attrs, ['foo']);
                    wrapper.submit.resolves(true);

                    // set amount to an expression
                    wrapper.amount = '1 + 2.2';
                    // calculate result
                    await wrapper.click('calculate');
                    // submit
                    await wrapper.click('Save & Add');

                    expect(wrapper.submit.callCount).toEqual(1);

                    const submittedRecord = wrapper.submit.lastCall.args[0];
                    expect(submittedRecord.amount).toEqual(3.2);
                });

                it('should not submit if expression is not OK', async () => {
                    const wrapper = new Wrapper(attrs, ['foo']);
                    wrapper.submit.resolves(true);

                    // set amount to an expression
                    wrapper.amount = '1 + foo';
                    // calculate result
                    await wrapper.click('calculate');
                    // submit
                    await wrapper.click('Save & Add');

                    expect(wrapper.submit.notCalled).toBe(true);
                });

                it('should cleanup amount field after successful submit', async () => {
                    const wrapper = new Wrapper(attrs);
                    wrapper.submit.resolves(true);

                    await wrapper.click('Save & Add');

                    expect(wrapper.amountInput.props().value).toEqual('');
                });
            });
        });

        it('should go back', () => {
            const wrapper = new Wrapper(attrs);

            wrapper.click('Cancel');

            expect(wrapper.history.goBack.calledOnce).toEqual(true);
        });

        it('should calculate correct expression', async () => {
            const wrapper = new Wrapper(attrs);

            wrapper.amount = '1 + 2.2';
            await wrapper.click('calculate');

            // should update form input
            expect(wrapper.find('#record-form-amount').props().value).toEqual('3.20');

            // should update "amount" in state
            expect(wrapper.state.amount).toEqual('3.20');

            // should not update "record" in state
            expect(wrapper.state.record.amount).toEqual(12.5);
        });

        it('should do nothing with wrong expression', async () => {
            const wrapper = new Wrapper(attrs);

            wrapper.amount = '1 + asd';
            await wrapper.click('calculate');
            expect(wrapper.find('#record-form-amount').props().value).toEqual('1 + asd');
        });

        it('should update transaction type', () => {
            const wrapper = new Wrapper(attrs);

            expect(wrapper.state.record.transaction_type).toEqual('EXP');
            wrapper.transactionType = 'INC';
            expect(wrapper.state.record.transaction_type).toEqual('INC');
        });

        it('should toggle tag', () => {
            const wrapper = new Wrapper(attrs);

            expect(wrapper.state.record.tags.has('foo-tag')).toBe(true);

            wrapper
                .tag('foo-tag')
                .props()
                .toggle('foo-tag');

            expect(wrapper.state.record.tags.has('foo-tag')).toBe(false);
        });
    });
});
