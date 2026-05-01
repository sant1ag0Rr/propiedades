const HttpError = require("../../domain/errors/HttpError");

const validate = (schema, source = "body") => (req, _res, next) => {
  const result = schema.safeParse(req[source]);

  if (!result.success) {
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));

    return next(new HttpError(400, "Datos invalidos", details));
  }

  req[source] = result.data;
  return next();
};

module.exports = validate;
