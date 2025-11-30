/**
 * Utility type to enforce same keys but allow different string values
 * Recursively maps object structure, replacing string literals with string type
 */
export type SameStructure<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends object
      ? SameStructure<T[K]>
      : T[K]
}
