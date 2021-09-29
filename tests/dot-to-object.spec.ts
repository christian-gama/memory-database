import { dotToObject } from '@/utils/dot-to-object'

type Obj = Record<string, any>

const makeSut = (): (obj: Obj) => Obj => {
  const sut = dotToObject

  return sut
}

describe('dotToObject', () => {
  it('should return nested object', () => {
    const sut = makeSut()

    const obj = { 'deep.dot.object': 'value', 'other.deep.dot.object': 'value' }

    const result = sut(obj)

    expect(result).toEqual({ deep: { dot: { object: 'value' } }, other: { deep: { dot: { object: 'value' } } } })
  })

  it('should return nested object', () => {
    const sut = makeSut()

    const obj = { 'dot.object': 'value' }

    const result = sut(obj)

    expect(result).toEqual({ dot: { object: 'value' } })
  })

  it('should return nested object along the rest of object', () => {
    const sut = makeSut()

    const obj = { rest: { of: { object: 'value ' } }, 'deep.dot.object': 'value' }

    const result = sut(obj)

    expect(result).toEqual({ rest: { of: { object: 'value ' } }, deep: { dot: { object: 'value' } } })
  })
})
