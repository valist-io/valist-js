/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "s-maxage=1, stale-while-revalidate=59",
          },
        ],
      },
    ];
  },
  assetPrefix: process.env.IPFS_BUILD ? './' : undefined,
  publicRuntimeConfig: {
    CHAIN_ID: process.env.CHAIN_ID || 1337,
    WEB3_PROVIDER: process.env.WEB3_PROVIDER || 'http://localhost:8545',
    IPFS_HOST: process.env.IPFS_HOST || 'http://localhost:5001',
    IPFS_GATEWAY: process.env.IPFS_GATEWAY || 'http://localhost:8080',
    PINATA_JWT: process.env.PINATA_JWT,
    GRAPH_PROVIDER: process.env.GRAPH_PROVIDER || 'http://localhost:8000/subgraphs/name/valist-io/valist',
    MAGIC_PUBKEY: 'pk_live_631BA2340BB9ACD8',
    METATX_ENABLED: process.env.METATX_ENABLED || false,
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

    config.plugins.push(new options.webpack.IgnorePlugin({ resourceRegExp: /^electron$/ }));
    return config;
  },
  // trailingSlash: true,
};
module.exports = nextConfig;
