import { isObject } from '@/utils/is-object'

const makeSut = (): (value: any) => boolean => {
  const sut = isObject

  return sut
}

describe('isObject', () => {
  it('should return true if value is an object', () => {
    const sut = makeSut()

    const value = { a: { b: { c: 'value' } } }

    const result = sut(value)

    expect(result).toBeTruthy()
  })

  it('should return false if value is not an object', () => {
    const sut = makeSut()

    const value = 'value'

    const result = sut(value)

    expect(result).toBeFalsy()
  })
})
