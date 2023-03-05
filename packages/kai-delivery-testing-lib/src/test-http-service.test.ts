import { describe, test, expect } from 'vitest'
import { DeliveryError } from '@kontent-ai/delivery-sdk'
import {
  createHttpServiceWithResponse,
  createHttpServiceWithData,
  createHttpServiceWithError
} from './test-http-service'

describe('createHttpServiceWithResponse', () => {
  test('output response should match input response', async () => {
    const data = {
      customData: true
    }

    const expected = {
      data,
      headers: [{ header: 'X-Custom-Header', value: 'My custom header' }],
      rawResponse: {},
      status: 404,
      retryStrategy: {
        options: {},
        retryAttempts: 3
      }
    }

    const httpService = createHttpServiceWithResponse(expected)

    const response = await httpService.getAsync({
      url: ''
    })

    const actual = response

    expect(actual).toEqual(expected)
  })
})

describe('createHttpServiceWithData', () => {
  test('output data should match input data', async () => {
    const expected = {
      customData: true
    }

    const httpService = createHttpServiceWithData(expected)

    const response = await httpService.getAsync({
      url: ''
    })

    const actual = response.data

    expect(actual).toEqual(expected)
  })
})

describe('createHttpServiceWithError', () => {
  test('output error should match input error', async () => {
    const expected = {
      message: 'Error'
    }

    const httpService = createHttpServiceWithError(expected)

    let actual

    try {
      await httpService.getAsync({
        url: ''
      })
    } catch (e) {
      actual = e as DeliveryError
    }

    expect(actual?.message).toEqual(expected.message)
  })

  test('`DeliveryError` should be thrown when input error not provided', async () => {
    const httpService = createHttpServiceWithError()

    let actual

    try {
      await httpService.getAsync({
        url: ''
      })
    } catch (e) {
      actual = e
    }

    expect(actual).toEqual<DeliveryError>(expect.anything())
  })
})
