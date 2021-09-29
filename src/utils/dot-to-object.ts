import { removeProperty } from './remove-property'

export const dotToObject = (obj: Record<string, any>): Record<string, any> => {
  let object = obj
  const result: Record<string, any> = {}

  for (const path in obj) {
    const properties = path.split('.')

    let target = result
    while (properties.length > 1) {
      const property = properties.shift() as string

      target = target[property] = target[property] || {}
    }

    target[properties[0]] = obj[path]
  }

  for (const key in object) {
    object = removeProperty(object, key)
  }

  return Object.assign(result, object)
}
