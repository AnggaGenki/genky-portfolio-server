export default {
  httpStatus: {
    success: {
      OK: {
        code: 200,
        message: "OK",
      },
      created: {
        code: 201,
        message: "Created",
      },
    },
    clientError: {
      badRequest: {
        code: 400,
        message: "Bad Request",
      },
      unauthorized: {
        code: 401,
        message: "Unauthorized",
      },
    },
    serverError: {
      internalServerError: {
        code: 500,
        message: "Internal Server Error",
      },
    },
  },
};
