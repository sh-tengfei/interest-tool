module.exports = {
    apps : [{
      name   : "interest-tool",
      script : "./dist/main.js",
      env: {
        NODE_ENV: "development",
      },
      watch: false,
      env_production: {
        NODE_ENV: 'production'
      },
      cwd: './',
      instances : "max",
      exec_mode : "cluster",
      error_file: './logs/app-err.log',
      out_file: './logs/app-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    }],
    deploy: {
      production : {
        "user" : "root",
        "host" : ["119.3.187.4"],
        "ref"  : "origin/master",
        "repo" : "git@gitee.com:sh_tengfei/interest-tool.git",
        "path" : "/home/www/interest-tool",
        'post-deploy': 'npm run npx:restart',
        'pre-setup': ''
      }
    }
  }
