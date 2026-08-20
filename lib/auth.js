// Session guards shared by the routes in server.js.

function adminOnly(req, res, next) {
  if (!req.session.userId || req.session.role !== 'admin') {
    return res.status(401).json({ message: 'Admin login required.' });
  }
  return next();
}

function authOnly(req, res, next) {
  if (!req.session.userId) return res.status(401).json({ message: 'Login required' });
  next();
}

// Loads the logged-in user once and exposes it as `req.sessionUser` /
// `req.sessionUserEmail` for the routes that need the account's email.
function createSessionUserLoader(User) {
  return async function loadSessionUser(req, res, next) {
    try {
      const user = await User.findById(req.session.userId);
      if (!user) return res.status(401).json({ message: 'User not found' });
      req.sessionUser = user;
      req.sessionUserEmail = (user.email || '').toLowerCase();
      next();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}

module.exports = { adminOnly, authOnly, createSessionUserLoader };
