import { map, last, prop, join, split, compose, toLower } from 'ramda'

export const getFileType = compose(toLower, last, split('.'))

export const convertFileListToUrl = compose(join(','), map(prop('url')))

export const getFileNameByUrl = compose(last, split('/')) as (
  // eslint-disable-next-line no-unused-vars
  input: string
) => string

const mapUrl = (url: string) => ({ name: getFileNameByUrl(url), url, uid: url })

export const convertUrlToFileList = compose(map(mapUrl), split(','))
