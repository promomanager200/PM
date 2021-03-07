module.exports = {
  apps: [
    {
      name: "promo_manager",
      script: "./app.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
      watch: ".",
    },
  ],
  deploy: {
    production: {
      ref: "origin/main",
      repo: "https://github.com/promomanager200/PM.git",
      path: "/",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
