// Shared HTTP helpers used by the express routes in server.js.

// Wraps an async route handler so a rejected promise answers with a JSON error
// body instead of every route repeating the same try/catch.
// options.message  — fixed message to return instead of the raw error message
// options.logPrefix — when set, the error is logged as `${logPrefix} error: ...`
// options.status   — response status, defaults to 500
function asyncHandler(handler, options = {}) {
  const { message, logPrefix, status = 500 } = options;
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (e) {
      if (logPrefix) console.error(`${logPrefix} error:`, e.message);
      if (res.headersSent) return;
      res.status(status).json({ message: message || e.message });
    }
  };
}

module.exports = { asyncHandler };
