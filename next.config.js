/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración existente
};

const withNextIntl = require('next-intl/plugin')(
  // Este es el archivo de configuración de next-intl
  './i18n.ts'
);

module.exports = withNextIntl(nextConfig);
