/**
 * Request logging middleware
 * Logs request method, path, query params, body, and response status
 */
export const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Log request details
  console.log('\n--- Incoming Request ---');
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`);
  
  // Log query parameters if any
  if (Object.keys(req.query).length > 0) {
    console.log(`Query Params:`, JSON.stringify(req.query, null, 2));
  }
  
  // Log route parameters if any
  if (Object.keys(req.params).length > 0) {
    console.log(`Route Params:`, JSON.stringify(req.params, null, 2));
  }
  
  // Log request body (excluding sensitive data)
  if (req.body && Object.keys(req.body).length > 0) {
    const sanitizedBody = { ...req.body };
    // Hide password in logs
    if (sanitizedBody.password) {
      sanitizedBody.password = '***HIDDEN***';
    }
    console.log(`Request Body:`, JSON.stringify(sanitizedBody, null, 2));
  }
  
  // Log headers (optional, can be verbose)
  if (req.headers.authorization) {
    console.log(`Authorization: Bearer ${req.headers.authorization.substring(7, 20)}...`);
  }
  
  // Capture response finish to log status and time
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`Status: ${res.statusCode}`);
    console.log(`Duration: ${duration}ms`);
    console.log('--- End Request ---\n');
  });
  
  next();
};

