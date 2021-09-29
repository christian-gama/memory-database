import { updateProperty } from '@/utils/update-property'

type Obj = Record<string, any>

const makeSut = (): (obj: Obj, update: Obj) => Obj => {
  const sut = updateProperty

  return sut
}

describe('updateProperty', () => {
  it('should return the updated object', () => {
    const sut = makeSut()

    const obj = { a: { b: { c: 'value' } } }
    const updatedObj = { a: { b: { c: 'updated_value' } } }

    const result = sut(obj, updatedObj)

    expect(result).toEqual(updatedObj)
  })
})
