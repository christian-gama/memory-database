import { isObject } from './is-object'

export function containProperty (obj: Record<string, any>, otherObj: Record<string, any>): boolean {
  const lastNode: string[] = []
  let matches = 0

  const _obj = JSON.parse(JSON.stringify(obj))
  const _otherObj = JSON.parse(JSON.stringify(otherObj))

  function iterateProperties (obj: Record<string, any>, otherObj: Record<string, any>): any {
    for (const objProperty in obj) {
      for (const otherObjProperty in otherObj) {
        const objValue = obj[objProperty]
        const otherObjValue = otherObj[otherObjProperty]

        if (isObject(otherObjValue)) {
          // Verifies if objProperty from Record<string, any> is equal to objProperty in otherObj.
          if (objValue === otherObjValue && objProperty === otherObjProperty) matches++

          // If filter does not have properties anymore, it means it is the last property of the object. Thus push it.
          if (!otherObjValue && !lastNode.includes(otherObjProperty)) lastNode.push(otherObjProperty)

          // Recursive - Call with current Record<string, any> and filter
          iterateProperties(objValue, otherObjValue)
        } else { // IF filter is not an object, ELSE it means the key is actually the objProperty, not a nested object.
          if (objValue === otherObjValue && objProperty === otherObjProperty) matches++

          // otherObjValue is not an object, but a objProperty. Thus push it.
          if (!lastNode.includes(otherObjProperty)) lastNode.push(otherObjProperty)
        }
      }
    }
  }

  iterateProperties(_obj, _otherObj)

  return lastNode.length === matches && matches !== 0
}
