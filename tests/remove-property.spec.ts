import { removeProperty } from '@/utils/remove-property'

type Obj = Record<string, any>

const makeSut = (): (obj: Obj, key: string) => Obj => {
  const sut = removeProperty

  return sut
}

describe('removeProperty', () => {
  it('should return true if object is empty', () => {
    const sut = makeSut()

    const obj = { a: 'value', b: 'other_value' }

    const result = sut(obj, 'a')

    expect(result).toEqual({ b: 'other_value' })
  })

  it('should return the same object if no property is removed', () => {
    const sut = makeSut()

    const obj = { a: 'value', b: 'other_value ' }

    const result = sut(obj, 'c')

    expect(result).toEqual(obj)
  })
})
