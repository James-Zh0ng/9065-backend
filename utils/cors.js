import cors from 'cors';

// Configure CORS options for the cors package
const corsOptions = {
  origin: '*', // Adjust this to match your client's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Include 'Authorization' header
};

// Define a function that applies additional CORS settings
function allowCors(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust this as needed
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Ensure 'Authorization' header is allowed
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
}

// Create the unified CORS middleware
const unifiedCorsMiddleware = (req, res, next) => {
  cors(corsOptions)(req, res, () => allowCors(req, res, next));
};

export default unifiedCorsMiddleware;
