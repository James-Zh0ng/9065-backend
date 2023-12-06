import admin from './firebaseAdmin';

const verifyToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new Error('No token provided');
    }

    const token = authorization.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);

    // Attach the decoded token to the request object
    req.user = decodedToken;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default verifyToken;
