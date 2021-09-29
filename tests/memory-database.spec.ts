import { MemoryDatabase } from '@/memory-database'
import { CollectionProtocol } from '@/protocols/database-protocol'

import faker from 'faker'

const makeFakeUser = (): any => {
  return {
    logs: {
      createdAt: new Date(Date.now()),
      lastLoginAt: null,
      lastSeenAt: null,
      updatedAt: null
    },
    personal: {
      email: faker.internet.email().toLowerCase(),
      id: faker.datatype.uuid(),
      name: faker.name.findName(),
      password: faker.internet.password()
    },
    settings: { accountActivated: false, currency: 'BRL', handicap: 1 },
    temporary: {
      activationCode: faker.lorem.word(5),
      activationCodeExpiration: new Date(Date.now() + 10 * 60 * 1000),
      resetPasswordToken: null,
      tempEmail: null,
      tempEmailCode: null,
      tempEmailCodeExpiration: null
    },
    tokenVersion: 0
  }
}

describe('MemoryDatabase', () => {
  const client = new MemoryDatabase()
  let collection: CollectionProtocol

  afterAll(async () => {
    await collection.deleteMany({})
    await client.disconnect()
  })

  beforeAll(async () => {
    await MemoryDatabase.connect('mongodb://localhost:27017/memory')
    collection = client.collection('users')
  })

  describe('connect', () => {
    it('should be connected to database', async () => {
      expect.hasAssertions()

      expect(MemoryDatabase.client).not.toBeNull()
    })
  })

  describe('disconnect', () => {
    it('should throw if database is not connected', async () => {
      expect.hasAssertions()

      const db = MemoryDatabase.client

      try {
        MemoryDatabase.client = null

        await client.disconnect()

        expect(true).toBeFalsy()
      } catch (error) {
        MemoryDatabase.client = db

        expect(error).toStrictEqual(new Error('Database is not connected'))
      }
    })
  })

  describe('collection', () => {
    it('should return collections methods', async () => {
      expect.hasAssertions()

      expect(collection).toHaveProperty('deleteMany')
      expect(collection).toHaveProperty('deleteOne')
      expect(collection).toHaveProperty('findOne')
      expect(collection).toHaveProperty('insertOne')
      expect(collection).toHaveProperty('updateOne')
    })

    it('should throw if database is not connected', async () => {
      expect.hasAssertions()

      const db = MemoryDatabase.client

      try {
        MemoryDatabase.client = null

        client.collection('users')

        expect(true).toBeFalsy()
      } catch (error) {
        MemoryDatabase.client = db

        expect(error).toStrictEqual(new Error('Database is not connected'))
      }
    })
  })

  describe('deleteMany', () => {
    it('should delete all documents', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()
      const fakeUser2 = makeFakeUser()
      const fakeUser3 = makeFakeUser()

      await collection.insertOne(fakeUser)
      await collection.insertOne(fakeUser2)
      await collection.insertOne(fakeUser3)

      const deletedCount = await collection.deleteMany({})

      expect(deletedCount).toBe(3)
    })

    it('should return the deleted count greater than 0 if deletes a document', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()
      const fakeUser2 = makeFakeUser()

      await collection.insertOne(fakeUser)
      await collection.insertOne(fakeUser2)

      const deletedCount = await collection.deleteMany({ 'personal.id': fakeUser.personal.id })

      expect(deletedCount).toBeGreaterThan(0)

      await collection.deleteMany({})
    })

    it('should return the deleted count equal to 0 if does not delete a document', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()

      const deletedCount = await collection.deleteMany({ 'personal.id': fakeUser.personal.id })

      expect(deletedCount).toBe(0)

      await collection.deleteMany({})
    })
  })

  describe('deleteOne', () => {
    it('should return true if deleted one document', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()

      await collection.insertOne(fakeUser)

      const deleted = await collection.deleteOne({ 'personal.id': fakeUser.personal.id })

      expect(deleted).toBe(true)

      await collection.deleteMany({})
    })

    it('should return false if does not deleted a document', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()

      const deleted = await collection.deleteOne({ 'personal.id': fakeUser.personal.id })

      expect(deleted).toBe(false)

      await collection.deleteMany({})
    })
  })

  describe('findOne', () => {
    it('should return a document if found using dot property', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()

      await collection.insertOne(fakeUser)

      const document = (await collection.findOne({ 'personal.name': fakeUser.personal.name }))

      expect(document?.personal.id).toBe(fakeUser.personal.id)

      await collection.deleteMany({})
    })

    it('should return a document if found', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()
      await collection.insertOne(fakeUser)

      const document = (await collection.findOne({ personal: { name: fakeUser.personal.name } }))

      expect(document?.personal.id).toBe(fakeUser.personal.id)

      await collection.deleteMany({})
    })

    it('should return null if does not find a document', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()
      await collection.insertOne({ any_field: 'any_value' })

      const document = await collection.findOne(fakeUser)

      expect(document).toBeNull()

      await collection.deleteMany({})
    })
  })

  describe('insertOne', () => {
    it('should return the inserted document', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()

      const insertedUser = await collection.insertOne(fakeUser)

      expect(insertedUser.personal.id).toBe(fakeUser.personal.id)

      await collection.deleteMany({})
    })
  })

  describe('updateOne', () => {
    it('should return the updated user', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()
      await collection.insertOne(fakeUser)

      const updatedUser = (await collection.updateOne(fakeUser, {
        'personal.name': 'any_name'
      }))

      expect(updatedUser?.personal.name).toBe('any_name')

      await collection.deleteMany({})
    })

    it('should update the collection', async () => {
      expect.hasAssertions()

      const fakeUser = makeFakeUser()
      await collection.insertOne(fakeUser)

      await collection.updateOne(fakeUser, {
        'personal.name': 'any_name'
      })

      const updatedUser = await collection.findOne(fakeUser)

      expect(updatedUser).toBeNull()

      await collection.deleteMany({})
    })
  })
})
