import {
  CollectionProtocol,
  CollectionsName,
  DatabaseProtocol,
  Document,
  ICollection
} from './protocols/database-protocol'

import faker from 'faker'

export class MemoryAdapter extends ICollection implements DatabaseProtocol {
  private collectionName!: string
  protected _collection: any = {}
  static client: any = null

  collection (name: CollectionsName): CollectionProtocol {
    if (!MemoryAdapter.client) throw new Error('Database is not connected')

    this._collection = Object.assign({ [name]: [] }, this._collection)
    this.collectionName = name

    return {
      deleteMany: this.deleteMany.bind(this),
      deleteOne: this.deleteOne.bind(this),
      findOne: this.findOne.bind(this),
      insertOne: this.insertOne.bind(this),
      updateOne: this.updateOne.bind(this)
    }
  }

  async disconnect (): Promise<void> {
    if (MemoryAdapter.client) {
      MemoryAdapter.client = null
    } else {
      throw new Error('Database is not connected')
    }
  }

  protected async deleteMany (filter: Document): Promise<number> {
    const collection = this._collection[this.collectionName]

    const foundDoc = this.findMany(filter)

    console.log(filter)

    if (foundDoc.length > 0) {
      console.log('Found deleted', foundDoc)
    }

    collection.length = 0

    return 1
  }

  protected async deleteOne (filter: Document): Promise<boolean> {
    const collection = this._collection[this.collectionName] as
      | Document[]
      | null

    if (collection == null) return false

    const document = await this.findOne(filter)

    const found = collection.find((value: Document | null) => {
      if (value != null && shallowComparer(value, document)) {
        const index = collection.indexOf(value)
        collection.splice(index, 1)

        return true
      } else {
        return false
      }
    })

    if (found == null) return false

    return true
  }

  protected async findOne<T extends Document>(
    filter: Document
  ): Promise<T | null> {
    const collection = this._collection[this.collectionName] as
      | Document[]
      | null

    if (collection == null) return null

    for (const doc of collection) {
      const foundDoc = findDocument(doc, filter)

      if (foundDoc) return foundDoc as T
    }

    return null
  }

  private findMany (filter: Document): any {
    const collection = this._collection[this.collectionName] as
      | Document[]
      | null

    if (collection == null) return null

    const results: Document[] = []

    for (const doc of collection) {
      const foundDoc = findDocument(doc, filter)

      console.log('findMany', foundDoc)

      if (foundDoc) results.push(foundDoc)
    }

    return results
  }

  protected async insertOne<T extends Document>(doc: Document): Promise<T> {
    const collection = (await this._collection[
      this.collectionName
    ]) as Document[]
    collection.push(doc)

    const insertedDoc = await this._collection[this.collectionName][
      this._collection[this.collectionName].length - 1
    ]

    return insertedDoc
  }

  protected async updateOne<T extends Document>(
    filter: Document,
    update: Document
  ): Promise<T | null> {
    const updatedDoc = Object.create({})

    return updatedDoc
  }

  static async connect (url?: string): Promise<void> {
    MemoryAdapter.client = true
  }
}

function objectSize (object: Document): number {
  let size = 0

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const _key in object) {
    size++
  }

  return size
}

function shallowComparer (
  value: Document | null,
  document: Document | null
): boolean {
  if (value == null) return false

  for (const key in value) {
    if (document == null) return false
    if (value[key] !== document[key]) return false
  }

  return true
}

function findDocument (
  doc: Document | null,
  filter: Document
): Document | false {
  let iteration = 0
  const bol: any = []

  if (doc == null) return false

  const result: Record<string, any> = {}

  for (const key in filter) {
    if (key.includes('.')) {
      for (const objectPath in filter) {
        const parts = objectPath.split('.')

        let target = result
        while (parts.length > 1) {
          const part = parts.shift()
          if (!part) break
          target = target[part] = target[part] || {}
        }

        target[parts[0]] = filter[objectPath]
      }

      filter = Object.assign(result, filter)

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete filter[key]
    }
  }

  for (const property in doc) {
    if (iteration === objectSize(filter)) bol.length = 0
    if (JSON.stringify(doc[property]) === JSON.stringify(filter[property])) {
      bol.push(true)
    }
    if (bol.length === objectSize(filter)) return doc
    iteration++
  }

  return false
}

export const makeFakeUser = (): any => {
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

async function main (): Promise<any> {
  await MemoryAdapter.connect()

  const client = new MemoryAdapter()
  const fakeUser = makeFakeUser()
  await client.collection('users').insertOne(fakeUser)
  await client.collection('users').insertOne({ age: 22, name: 'Camilla' })
  await client.collection('users').insertOne({
    age: 25,
    hobbies: { programming: { node: true, react: false } },
    name: 'Paula'
  })
  await client
    .collection('logs')
    .insertOne({ error: 'ops', opa: 'xd', zumba: 'zuzu' })

  const result = await client.collection('users').findOne(fakeUser)
  console.log(result)
}

main().catch((err) => console.log(err))

// const db = {
//   logs: [{ log: 'log 1' }, { log: 'log 2' }],
//   users: [{ user: 'usuário 1' }, { user: 'usuário 2' }]
// }

// console.log(db.users[0].user === 'usuário 1')
