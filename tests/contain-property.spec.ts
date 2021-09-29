import { containProperty } from '@/utils/contain-property'

type Obj = Record<string, any>

const makeSut = (): (obj: Obj, otherObj: Obj) => boolean => {
  const sut = containProperty

  return sut
}

describe('containProperty', () => {
  it('should return true if objects have same properties', () => {
    const sut = makeSut()

    const obj = { a: { b: { c: 'value' } } }
    const otherObj = { a: { b: { c: 'value' } } }

    const result = sut(obj, otherObj)

    expect(result).toBeTruthy()
  })

  it('should return false if does not have same properties', () => {
    const sut = makeSut()

    const obj = { a: { b: { c: 'value' } } }
    const otherObj = { a: { b: { c: 'different_value' } } }

    const result = sut(obj, otherObj)

    expect(result).toBeFalsy()
  })

  it('should return true contain property', () => {
    const sut = makeSut()

    const obj = { a: { b: { c: 'value' } }, other: { prop: 'other_value' } }
    const otherObj = { other: { prop: 'other_value' } }

    const result = sut(obj, otherObj)

    expect(result).toBeTruthy()
  })

  it('should return false if does not contain property', () => {
    const sut = makeSut()

    const obj = { a: { b: { c: 'value' } }, other: { prop: 'other_value' } }
    const otherObj = { other: { prop: 'different_value' } }

    const result = sut(obj, otherObj)

    expect(result).toBeFalsy()
  })
})
