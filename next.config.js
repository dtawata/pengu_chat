const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

/** @type {import('next').NextConfig} */
const nextConfig = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      reactStrictMode: true,
      env: {
        mysqlHost: 'localhost',
        mysqlUser: 'root',
        mysqlPassword: '',
        mysqlDatabase: 'slack'
      }
    }
  }

  return {
    reactStrictMode: true,
    env: {
      mysqlHost: 'localhost',
      mysqlUser: 'root',
      mysqlPassword: '',
      mysqlDatabase: 'slack'
    }
  }
}

module.exports = nextConfig
