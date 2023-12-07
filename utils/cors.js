// Middleware for CORS
function allowCors(fn) {
    return async function(req, res) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Access-Control-Max-Age", "1800");
      res.setHeader("Access-Control-Allow-Headers", "content-type");
      res.setHeader("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, PATCH, OPTIONS");
      
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }
  
      return await fn(req, res);
    }
  }
  
  export default allowCors;
  