export const validateRequest = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) Object.assign(req.query, parsed.query);
    if (parsed.params) Object.assign(req.params, parsed.params);
    
    next();
  } catch (error) {
    // If it's a ZodError, return validation issues
    if (error.issues) {
      return res.status(400).json({
        message: "Validation Error",
        errors: error.issues.map((issue) => ({
          field: issue.path.slice(1).join("."),
          message: issue.message,
        })),
      });
    }
    
    // Otherwise it's a system error, bubble it up
    next(error);
  }
};
