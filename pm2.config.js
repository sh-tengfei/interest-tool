module.exports = {
  apps: [{
    name   : "interest-tool",
    script : "./dist/main.js",
    env: {
      NODE_ENV: "production"
    },
    error_file: './logs/app-err.log',
    out_file: './logs/app-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
  }]
}
