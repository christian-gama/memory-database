import { isEmpty } from '@/utils/is-empty'

const makeSut = (): (value: any) => boolean => {
  const sut = isEmpty

  return sut
}

describe('isEmpty', () => {
  it('should return true if object is empty', () => {
    const sut = makeSut()

    const obj = {}

    const result = sut(obj)

    expect(result).toBeTruthy()
  })

  it('should return false if obj is not empty', () => {
    const sut = makeSut()

    const obj = { field: 'not_empty' }

    const result = sut(obj)

    expect(result).toBeFalsy()
  })

  it('should return true if array is empty', () => {
    const sut = makeSut()

    const arr = []

    const result = sut(arr)

    expect(result).toBeTruthy()
  })

  it('should return false if array is not empty', () => {
    const sut = makeSut()

    const arr = ['not_empty']

    const result = sut(arr)

    expect(result).toBeFalsy()
  })

  it('should return false if is not array or object', () => {
    const sut = makeSut()

    const value = 'any_value'

    const result = sut(value)

    expect(result).toBeFalsy()
  })
})
