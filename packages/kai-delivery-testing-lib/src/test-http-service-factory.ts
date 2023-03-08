import { TestHttpService } from '@kontent-ai/core-sdk'
import type { IResponse } from '@kontent-ai/core-sdk'
import { DeliveryError } from '@kontent-ai/delivery-sdk'
import { faker } from '@faker-js/faker'

function createDefaultResponse(): IResponse<object> {
  return {
    data: {},
    headers: [],
    rawResponse: {},
    status: 200,
    retryStrategy: {
      options: {},
      retryAttempts: 0
    }
  }
}

function createResponse<TData>(response: Partial<IResponse<TData>>) {
  const defaultResponse = createDefaultResponse()

  const mergedResponse = Object.assign(defaultResponse, response)

  return mergedResponse
}

function createHttpServiceWithResponse<TData>(
  response: Partial<IResponse<TData>>
) {
  return new TestHttpService({
    response: createResponse(response)
  })
}

function createHttpServiceWithData<TData>(data: TData) {
  return new TestHttpService({
    response: createResponse({ data })
  })
}

function createDefaultError() {
  const error: DeliveryError = {
    message: 'An error has occurred',
    requestId: faker.datatype.uuid(),
    errorCode: 100,
    specificCode: 0
  }

  return error
}

type DeliveryErrorData = Partial<ConstructorParameters<typeof DeliveryError>[0]>

function createError(error?: DeliveryErrorData) {
  const defaultError = createDefaultError()

  if (!error) {
    return defaultError
  }

  const mergedError = Object.assign(defaultError, error)

  return mergedError
}

function createHttpServiceWithError(error?: DeliveryErrorData) {
  const serviceError = createError(error)

  return new TestHttpService({
    error: serviceError
  })
}

export {
  createHttpServiceWithResponse,
  createHttpServiceWithData,
  createHttpServiceWithError
}
