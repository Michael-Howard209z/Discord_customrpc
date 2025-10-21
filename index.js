require('dotenv').config();


const { spawn } = require('child_process');

// Chạy tệp rac.js với quyền gọi garbage collector
spawn('node', ['--expose-gc', 'rac.js'], {
  stdio: 'inherit'
});

