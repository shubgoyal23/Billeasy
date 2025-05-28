class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public errors: string[] = [],
    stack?: string,
    public data: any = null,
    public success: boolean = statusCode < 400,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.data = data;
    this.success = success;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
