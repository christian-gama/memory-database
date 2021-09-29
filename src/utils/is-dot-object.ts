export const isDotObject = (value: any): boolean => {
  if (typeof value === 'string') return value.includes('.')

  return false
}
