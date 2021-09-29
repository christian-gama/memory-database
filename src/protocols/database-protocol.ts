export interface Document {
  [key: string]: any
}

export interface CollectionProtocol {
  deleteMany: (filter: Document) => Promise<number>
  deleteOne: (filter: Document) => Promise<boolean>
  findMany: <T extends Document>(filter: Document) => Promise<T[] | []>
  findOne: <T extends Document>(filter: Document) => Promise<T | null>
  insertOne: <T extends Document>(doc: Document) => Promise<T>
  updateOne: <T extends Document>(filter: Document, update: Document) => Promise<T | null>
}

export interface DbClientProtocol {
  collection: (name: string) => CollectionProtocol
  disconnect: () => Promise<void>
}

export interface DatabaseProtocol {
  collection: (name: CollectionsName) => CollectionProtocol
  disconnect: () => Promise<void>
}

export abstract class ICollection {
  protected _collection: any

  protected abstract deleteMany (filter: Document): Promise<number>

  protected abstract deleteOne (filter: Document): Promise<boolean>

  protected abstract findOne<T extends Document> (filter: Document): Promise<T | null>

  protected abstract findMany<T extends Document[]>(filter: Document): Promise<T | []>

  protected abstract insertOne<T extends Document>(doc: Document): Promise<T>

  protected abstract updateOne<T extends Document>(
    filter: Document,
    update: Document
  ): Promise<T | null>
}

export type CollectionsName = string
