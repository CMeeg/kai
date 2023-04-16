import { URL } from 'url'

const absoluteUrlRegex = /^[a-z][a-z\d-.+]+:\/\//i

function isAbsoluteUrl(url: string) {
  return absoluteUrlRegex.test(url)
}

function isSameOriginUrl(
  url: string | null | undefined,
  originUrl: string | null | undefined
) {
  if (!url || !originUrl) {
    return false
  }

  if (!isAbsoluteUrl(url) || !isAbsoluteUrl(originUrl)) {
    return false
  }

  try {
    return new URL(url).origin === new URL(originUrl).origin
  } catch {
    return false
  }
}

export { isAbsoluteUrl, isSameOriginUrl }
