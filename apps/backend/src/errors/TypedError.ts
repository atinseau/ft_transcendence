
type TypedErrorOptions<T extends string> = {
  type: T
  message: string
}

export default class TypedError<T extends string> extends Error {

  public type: T

  constructor(options: TypedErrorOptions<T>) {
    super()
    this.type = options.type
    this.message = options.message
  }
}