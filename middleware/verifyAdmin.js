const verifyAdmin = (req, res, next) => {
  // Assumes req.user is set by previous authentication middleware
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Access denied. Admins only.' });
};

export default verifyAdmin;
