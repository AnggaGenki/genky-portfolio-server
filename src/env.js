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
      notFound: {
        code: 404,
        message: "Not Found",
      },
      unprocessableEntity: {
        code: 422,
        message: "Unprocessable Entity",
      },
      conflict: {
        code: 409,
        message: "Conflict",
      },
    },
    serverError: {
      internalServerError: {
        code: 500,
        message: "Internal Server Error",
      },
    },
  },
  appSettings: {
    jwtExpires: 60 * 60 * 24,
  },
};
