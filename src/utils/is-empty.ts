export const isEmpty = (value: any): boolean => {
  if (typeof value === 'object') return Object.keys(value).length === 0
  if (Array.isArray(value)) return value.length === 0

  return false
}
