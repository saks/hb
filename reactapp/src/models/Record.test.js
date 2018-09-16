import RecordModel from './Record'

const data = [
    {
        id: 85,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['foo'],
        amount: { amount: 1.0, currency: { code: 'CAD', name: 'Canadian Dollar' } },
        transaction_type: 'EXP',
        created_at: 1533407979.0,
    },
    {
        id: 84,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['SCHOOL'],
        amount: {
            amount: 123.0,
            currency: { code: 'CAD', name: 'Canadian Dollar' },
        },
        transaction_type: 'EXP',
        created_at: 1533399928.0,
    },
    {
        id: 83,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['FUN'],
        amount: {
            amount: 245.0,
            currency: { code: 'CAD', name: 'Canadian Dollar' },
        },
        transaction_type: 'INC',
        created_at: 1533382224.0,
    },
    {
        id: 82,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['ZZZ'],
        amount: {
            amount: 125.0,
            currency: { code: 'CAD', name: 'Canadian Dollar' },
        },
        transaction_type: 'EXP',
        created_at: 1533297850.0,
    },
    {
        id: 81,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['BAR'],
        amount: {
            amount: 124.0,
            currency: { code: 'CAD', name: 'Canadian Dollar' },
        },
        transaction_type: 'EXP',
        created_at: 1533297847.0,
    },
    {
        id: 80,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['ZZZ'],
        amount: {
            amount: 123.0,
            currency: { code: 'CAD', name: 'Canadian Dollar' },
        },
        transaction_type: 'EXP',
        created_at: 1533297844.0,
    },
    {
        id: 79,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['foo'],
        amount: {
            amount: 12.0,
            currency: { code: 'CAD', name: 'Canadian Dollar' },
        },
        transaction_type: 'EXP',
        created_at: 1533297835.0,
    },
    {
        id: 78,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['FOO'],
        amount: {
            amount: 123.0,
            currency: { code: 'CAD', name: 'Canadian Dollar' },
        },
        transaction_type: 'EXP',
        created_at: 1533293050.0,
    },
    {
        id: 77,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['SCHOOL'],
        amount: {
            amount: 345345.0,
            currency: { code: 'CAD', name: 'Canadian Dollar' },
        },
        transaction_type: 'EXP',
        created_at: 1533293034.0,
    },
    {
        id: 76,
        user: 'http://localhost:8000/api/user/1/',
        tags: ['FUN'],
        amount: {
            amount: 123.0,
            currency: { code: 'CAD', name: 'Canadian Dollar' },
        },
        transaction_type: 'EXP',
        created_at: 1533293029.0,
    },
]

describe('record model', () => {
    const verifyRecord = record => {
        expect(record.id).toEqual(85)
        expect(record.user).toEqual('http://localhost:8000/api/user/1/')
        expect(record.amount).toEqual(1)
        expect(record.currency).toEqual('CAD')
        expect(record.transaction_type).toEqual('EXP')
        expect(record.tags).toEqual(new Set(['foo']))
        expect(record.created_at).toEqual(1533407979)
    }

    it('should create new record from attrs', () => {
        const record = RecordModel.from(data[0])
        verifyRecord(record)
    })

    it('should clone correctly', () => {
        const record = RecordModel.from(data[0]).clone()
        verifyRecord(record)
    })

    it('should export as json', () => {
        const record = RecordModel.from(data[0])
        expect(record.asJson).toEqual(data[0])
    })

    it('should check persistence', () => {
        const record = RecordModel.from(data[0])
        expect(record.isPersisted).toBe(true)

        delete record.id
        expect(record.isPersisted).toBe(false)
    })

    it('should toggle tag', () => {
        const record = RecordModel.from(data[0])

        expect(record.tags.has('foo')).toBe(true)
        expect(record.tags.has('bar')).toBe(false)

        record.toggleTag('foo')
        record.toggleTag('bar')

        expect(record.tags.has('foo')).toBe(false)
        expect(record.tags.has('bar')).toBe(true)
    })

    test('defalt', () => {
        const record = RecordModel.default()

        expect(record.id).toBeUndefined()
        expect(record.tags).toEqual(new Set([]))
        expect(record.amount).toEqual(0)
        expect(record.currency).toEqual('CAD')
        expect(record.currency_name).toEqual('Canadian Dollar')
        expect(record.transaction_type).toEqual('EXP')
        expect(record.created_at).toEqual(0)
    })

    test('default record is not persisted', () => {
        const record = RecordModel.default()

        expect(record.isPersisted).toBe(false)
    })
})
