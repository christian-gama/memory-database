import { isEqual } from '@/utils/is-equal'

type Obj = Record<string, any>

const makeSut = (): (obj: Obj, otherObj: Obj) => boolean => {
  const sut = isEqual

  return sut
}

describe('isEqual', () => {
  it('should return true if objects are equal', () => {
    const sut = makeSut()

    const obj = { a: { b: { c: 'value' } } }
    const otherObj = { a: { b: { c: 'value' } } }

    const result = sut(obj, otherObj)

    expect(result).toBeTruthy()
  })

  it('should return false if objects are not equal', () => {
    const sut = makeSut()

    const obj = { a: { b: { c: 'value' } } }
    const otherObj = { a: { b: { c: 'different_value' } } }

    const result = sut(obj, otherObj)

    expect(result).toBeFalsy()
  })
})
