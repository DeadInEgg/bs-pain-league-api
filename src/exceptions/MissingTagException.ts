export class MissingTagException extends Error {
  constructor() {
    super('The tracker must have a tag to get suggested games');
  }
}
