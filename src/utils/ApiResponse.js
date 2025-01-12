class ApiResponse {
  constructor(
    statusCode,
    data,
    message = "succes",
  ) {
    this.statusCode = statusCode
    this.data = data
    this.message = message
    this.success = statusCode < 400
  }
}

export { ApiResponse }

// info response 100-199
// successful response 200-299
// redirection response 300-399
// client error response 400-499
// server side error response 500-599