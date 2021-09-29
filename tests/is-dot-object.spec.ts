import { isDotObject } from '@/utils/is-dot-object'

const makeSut = (): (value: any) => boolean => {
  const sut = isDotObject

  return sut
}

describe('isDotObject', () => {
  it('should return true if dot object', () => {
    const sut = makeSut()

    const obj = 'this.is.a.dot.object'

    const result = sut(obj)

    expect(result).toBeTruthy()
  })

  it('should return false if is not a dot object', () => {
    const sut = makeSut()

    const obj = 'this is not a dot object'

    const result = sut(obj)

    expect(result).toBeFalsy()
  })

  it('should return false if type of value is not string', () => {
    const sut = makeSut()

    const value = null

    const result = sut(value)

    expect(result).toBeFalsy()
  })
})
