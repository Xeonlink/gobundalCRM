export class JSONResponse extends Response {
  constructor(data: { [key: string]: any }, init: ResponseInit = {}) {
    super(JSON.stringify(data), init);
  }
}
