const [ebookOptions, ebookMap] = (() => {
  const options = [
    { label: '纪实文学', value: 'non-fiction' },
    { label: '未分类', value: 'other' },
    { label: '小说', value: 'fiction' },
    { label: '传记', value: 'biography' },
    { label: '哲学', value: 'philosophy' },
    { label: '经济学', value: 'economics' },
    { label: '专业书籍', value: 'professional' }
  ]

  const map = new Map(options.map(({ label, value }) => [value, label]))
  return [options, map]
})()

export { ebookMap, ebookOptions }