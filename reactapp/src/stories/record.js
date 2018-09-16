import React from 'react'

import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { linkTo } from '@storybook/addon-links'

import Record from '../components/Record'
import RecordModel from '../models/Record'

const expenceRecord = RecordModel.from({
    id: 85,
    user: 'http://localhost:8000/api/user/1/',
    tags: ['foo-tag', 'bar-tag'],
    amount: { amount: 12.5, currency: { code: 'CAD', name: 'Canadian Dollar' } },
    transaction_type: 'EXP',
    created_at: 1533407979.0,
})

const incomeRecord = RecordModel.from({
    id: 85,
    user: 'http://localhost:8000/api/user/1/',
    tags: ['foo-tag', 'bar-tag'],
    amount: { amount: 12.5, currency: { code: 'CAD', name: 'Canadian Dollar' } },
    transaction_type: 'INC',
    created_at: 1533407979.0,
})

storiesOf('Record', module)
    .add('Income', () => <Record model={incomeRecord} />)
    .add('Expence', () => <Record model={expenceRecord} />)
