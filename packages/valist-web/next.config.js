/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    WEB3_PROVIDER: process.env.WEB3_PROVIDER || 'https://rpc.valist.io',
    MAGIC_PUBKEY: 'pk_live_B577A4A7B11805D0',
    METATX_ENABLED: process.env.METATX_ENABLED || true,
  },
  webpack: function (config, options) {
    if (!options.isServer) {
      // polyfill events on browser. since webpack5, polyfills are not automatically included
      config.resolve.fallback.events = require.resolve('events/');
    }
    config.plugins.push(new options.webpack.IgnorePlugin({ resourceRegExp: /^electron$/ }));
    return config;
  },
};

module.exports = nextConfig;
