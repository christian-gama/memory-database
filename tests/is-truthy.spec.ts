import { isTruthy } from '@/utils/is-truthy'

const makeSut = (): (value: any) => boolean => {
  const sut = isTruthy

  return sut
}

describe('isTruthy', () => {
  it('should return true if is not null or undefined', () => {
    const sut = makeSut()

    const value = 'any_value'

    const result = sut(value)

    expect(result).toBeTruthy()
  })

  it('should return false if value is null', () => {
    const sut = makeSut()

    const value = null

    const result = sut(value)

    expect(result).toBeFalsy()
  })

  it('should return false if value is undefined', () => {
    const sut = makeSut()

    const value = undefined

    const result = sut(value)

    expect(result).toBeFalsy()
  })
})
