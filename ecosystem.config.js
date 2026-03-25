module.exports = {
  apps: [{
    name: 'nexus-tendo-md',
    script: 'src/main.js',
    watch: false,
    autorestart: true,
    max_memory_restart: '300M',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
