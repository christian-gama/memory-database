import { dotToObject } from './utils/dot-to-object'
import { isEmpty } from './utils/is-empty'
import { isEqual } from './utils/is-equal'
import { containProperty } from './utils/contain-property'
import { Document, ICollection, DatabaseProtocol, CollectionsName, CollectionProtocol } from './protocols/database-protocol'
import { updateProperty } from './utils/update-property'
import { isDotObject } from './utils/is-dot-object'

export class MemoryDatabase extends ICollection implements DatabaseProtocol {
  private collectionName!: string
  protected _collection: any = {}
  static client: any = null

  collection (name: CollectionsName): CollectionProtocol {
    if (!MemoryDatabase.client) throw new Error('Database is not connected')

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
    if (MemoryDatabase.client) {
      MemoryDatabase.client = null
    } else {
      throw new Error('Database is not connected')
    }
  }

  protected async deleteMany (filter: Document): Promise<number> {
    const collection = this._collection[this.collectionName] as Document[] | null

    if (isEmpty(collection)) return 0

    const foundDocs = await this.findMany(filter)

    const collectionLengthBefore = (collection as Document[]).length

    if (isEmpty(filter)) (collection as Document[]).length = 0
    else {
      foundDocs.forEach((foundDoc) => {
        collection?.find((collectionDoc: Document) => {
          if (isEqual(collectionDoc, foundDoc)) {
            const index = collection?.indexOf(collectionDoc)
            collection.splice(index, 1)

            return true
          } else {
            return false
          }
        })
      })
    }

    const collectionLengthAfter = (collection as Document[]).length

    return collectionLengthBefore - collectionLengthAfter
  }

  protected async deleteOne (filter: Document): Promise<boolean> {
    const collection = this._collection[this.collectionName] as | Document[] | null

    if (isEmpty(collection)) return false

    const foundDoc = await this.findOne(filter)

    const found = (collection as Document[]).find((doc: Document) => {
      if (isEqual(doc, foundDoc)) {
        const index = (collection as Document[]).indexOf(doc);
        (collection as Document[]).splice(index, 1)

        return true
      } else {
        return false
      }
    })

    if (found == null) return false

    return true
  }

  protected async findOne<T extends Document>(filter: Document): Promise<T | null> {
    const collection = this._collection[this.collectionName] as | Document[] | null

    if (isEmpty(collection)) return null

    for (const key in filter) {
      if (isDotObject(key)) {
        filter = dotToObject(filter)
      }
    }

    for (const doc of collection as Document[]) {
      if (containProperty(doc, filter)) return doc as T
    }

    return null
  }

  protected async findMany<T extends Document[]>(filter: Document): Promise<T | []> {
    const collection = this._collection[this.collectionName] as Document[] | null
    const results: Document[] = []

    if (isEmpty(collection)) return results as []

    if (isEmpty(filter)) return collection as []

    for (const key in filter) {
      if (isDotObject(key)) {
        filter = dotToObject(filter)
      }
    }

    for (const doc of collection as Document[]) {
      if (containProperty(doc, filter)) results.push(doc)
    }

    return results as T
  }

  protected async insertOne<T extends Document>(doc: Document): Promise<T> {
    const collection = (await this._collection[this.collectionName]) as Document[]

    collection.push(doc)

    return collection[collection.length - 1] as T
  }

  protected async updateOne<T extends Document> (filter: Document, update: Document): Promise<T | null> {
    const collection = (await this._collection[this.collectionName]) as Document[]

    const foundDoc = await this.findOne(filter)

    if (!foundDoc) return null

    for (const key in update) {
      if (isDotObject(key)) {
        update = dotToObject(update)
      }
    }

    const updatedDoc = updateProperty(foundDoc, update)

    const docIndex = collection.indexOf(foundDoc)

    collection[docIndex] = updatedDoc

    return collection[docIndex] as T
  }

  static async connect (url?: string): Promise<void> {
    MemoryDatabase.client = true
  }
}
