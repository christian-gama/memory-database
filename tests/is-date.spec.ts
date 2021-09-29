import { isDate } from '@/utils/is-date'

const makeSut = (): (obj: any) => boolean => {
  const sut = isDate

  return sut
}

describe('isDate', () => {
  it('should return true value is date', () => {
    const sut = makeSut()

    const value = new Date(Date.now())

    const result = sut(value)

    expect(result).toBeTruthy()
  })

  it('should return false if value is not date', () => {
    const sut = makeSut()

    const value = 'invalid_date'

    const result = sut(value)

    expect(result).toBeFalsy()
  })
})
