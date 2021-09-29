export const isEqual = (obj: Record<string, any>, otherObj: Record<string, any> | null): boolean => {
  return (JSON.stringify(obj) === JSON.stringify(otherObj))
}
