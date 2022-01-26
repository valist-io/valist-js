/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    WEB3_PROVIDER: process.env.WEB3_PROVIDER || 'https://rpc.valist.io',
    MAGIC_PUBKEY: 'pk_live_B577A4A7B11805D0',
    METATX_ENABLED: process.env.METATX_ENABLED || true,
  },
};

module.exports = nextConfig;
