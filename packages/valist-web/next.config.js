/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: process.env.IPFS_BUILD ? './' : undefined,
  publicRuntimeConfig: {
    CHAIN_ID: process.env.CHAIN_ID || 137,
    CLIENT_ID: process.env.CLIENT_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gateway.valist.io',
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com',
      },
    ],
  },
  webpack: function (config, options) {
    if (!options.isServer) {
      // polyfill events on browser. since webpack5, polyfills are not automatically included
      config.resolve.fallback.events = require.resolve('events/');
      config.resolve.fallback.fs = false;
    }


    // add graphql file loader
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });

    const path = require('path');
    config.resolve.alias['bn.js'] = path.resolve(__dirname, '..', '..', 'node_modules', 'bn.js');

    config.plugins.push(new options.webpack.IgnorePlugin({ resourceRegExp: /^electron$/ }));

    config.plugins.push(new options.webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      resource.request = resource.request.replace(/^node:/, "");
    }));

    return config;
  },
};

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
