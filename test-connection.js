// Quick test script to verify backend is running
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = http.request(options, (res) => {
  console.log(`Backend Status: ${res.statusCode}`);
  console.log('Backend is responding!');
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (error) => {
  console.error('Backend Error:', error.message);
  console.log('Backend might not be running. Start it with: docker-compose up -d');
});

req.write(JSON.stringify({
  email: 'admin@nexus.dev',
  password: 'Admin@123'
}));

req.end();
