module.exports = {
  // 不要分号
  semi: false,
  // 单引号
  singleQuote: true,
  // 不要尾逗号
  trailingComma: 'none',
  plugins: ['prettier-plugin-classify-imports'],
  importOrder: ['^[./]|(@/)']
}
