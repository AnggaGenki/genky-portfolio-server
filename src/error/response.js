class ResponseError extends Error {
  constructor(status, title, messages) {
    super();

    this.status = status;
    this.title = title;
    this.messages = messages || [];
  }
}

export default ResponseError;
