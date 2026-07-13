/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      // pptxgenjs가 서버 전용 부품(node:fs 등)을 참조하는데,
      // 브라우저에서는 쓰이지 않으므로 빈 모듈로 대체한다
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(/^node:/, (resource) => {
          resource.request = resource.request.replace(/^node:/, '');
        })
      );
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        https: false,
        http: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;
