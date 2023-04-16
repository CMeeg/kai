import { describe, test, expect } from 'vitest'
import { isAbsoluteUrl, isSameOriginUrl } from './url'

describe('isAbsoluteUrl', () => {
  test('should return true when url is absolute', () => {
    const url = 'https://example.com/path/to/resource.html?query=value'

    const actual = isAbsoluteUrl(url)

    expect(actual).toBe(true)
  })

  test('should return false when url is not absolute', () => {
    const url = '/path/to/resource.html?query=value'

    const actual = isAbsoluteUrl(url)

    expect(actual).toBe(false)
  })
})

describe('isSameOriginUrl', () => {
  test('should return false when url is falsy', () => {
    const url = ''
    const originUrl = ''

    const actual = isSameOriginUrl(url, originUrl)

    expect(actual).toBe(false)
  })

  test('should return false when url is relative', () => {
    const url = '/path/to/resource.html?query=value'
    const originUrl = 'https://example.com/'

    const actual = isSameOriginUrl(url, originUrl)

    expect(actual).toBe(false)
  })

  test('should return true when url matches origin', () => {
    const url = 'https://example.com/path/to/resource.html?query=value'
    const originUrl = 'https://example.com/'

    const actual = isSameOriginUrl(url, originUrl)

    expect(actual).toBe(true)
  })

  test('should return true when url with port matches origin', () => {
    const url = 'https://example.com:8080/path/to/resource.html?query=value'
    const originUrl = 'https://example.com:8080/'

    const actual = isSameOriginUrl(url, originUrl)

    expect(actual).toBe(true)
  })
})
