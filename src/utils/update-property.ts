import { isObject } from './is-object'

export function updateProperty (obj: Record<string, any>, update: Record<string, any>): Record<string, any> {
  const _obj = JSON.parse(JSON.stringify(obj))
  const _update = JSON.parse(JSON.stringify(update))

  function iterateProperties (obj: Record<string, any>, update: Record<string, any>): void {
    for (const objProperty in obj) {
      for (const updateProperty in update) {
        const objValue = obj[objProperty]
        const updateValue = update[updateProperty]

        if (isObject(updateValue)) iterateProperties(objValue, updateValue)
        else if (objProperty === updateProperty) { obj[objProperty] = updateValue }
      }
    }
  }

  iterateProperties(_obj, _update)

  return _obj
}
