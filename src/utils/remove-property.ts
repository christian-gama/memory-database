export const removeProperty = (obj: Record<string, any>, key: string): Record<string, any> => {
  const object = obj

  const { [key]: removedObj, ...newObj } = object

  return newObj
}
