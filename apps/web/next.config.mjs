import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    const emptyModule = path.resolve(__dirname, 'lib/empty-module.js');

    // These aliases apply to all imports regardless of nesting depth.
    // This handles both @txnlab/use-wallet v3 AND the nested v4 copy
    // inside @txnlab/use-wallet-react/node_modules/.
    config.resolve.alias = {
      ...config.resolve.alias,

      // Web3Auth providers (all optional in use-wallet v4)
      '@web3auth/modal': emptyModule,
      '@web3auth/base': emptyModule,
      '@web3auth/base-provider': emptyModule,
      '@web3auth/single-factor-auth': emptyModule,
      '@web3auth/ethereum-provider': emptyModule,
      '@web3auth/auth': emptyModule,
      '@web3auth/openlogin-adapter': emptyModule,

      // Other optional wallet providers
      '@algorandfoundation/liquid-auth-use-wallet-client': emptyModule,
      '@agoralabs-sh/avm-web-provider': emptyModule,
      '@perawallet/connect-beta': emptyModule,
      'lute-connect': emptyModule,
      'magic-sdk': emptyModule,
      '@magic-sdk/provider': emptyModule,
      '@magic-ext/algorand': emptyModule,
      '@kibisis/utils': emptyModule,
      '@awesome-algorand/use-next-wallet': emptyModule,
    };

    return config;
  },
};

export default nextConfig;
