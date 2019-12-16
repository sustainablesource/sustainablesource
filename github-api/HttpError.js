export class HttpError extends Error {
  constructor ({ status, message }) {
    super(`${status}: ${message}`)
    this.name = this.constructor.name
  }
}
