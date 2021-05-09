const jwt = require('jsonwebtoken');

module.exports = async function(req, res, next) {
  const token = req.headers['authorization']

  if (!token) return res.status(401).json({ msg: 'Unauthorized' });

  try {
    const onlyToken = token.split(" ")[1];
    const decoded = await jwt.verify(onlyToken, process.env.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json({ msg: 'Unauthorized', status: 401 });
  }
}