function urlEncode(value: string) {
  if (!value) {
    return null
  }

  try {
    return encodeURIComponent(value)
  } catch {
    return value
  }
}

export { urlEncode }
