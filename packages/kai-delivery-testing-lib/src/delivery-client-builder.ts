import { createDeliveryClient as createKontentDeliveryClient } from '@kontent-ai/delivery-sdk'
import type {
  IDeliveryClient,
  IDeliveryClientConfig
} from '@kontent-ai/delivery-sdk'
import { faker } from '@faker-js/faker'
import { createHttpServiceWithData } from './test-http-service-factory'

function createDefaultDeliveryClientConfig(): IDeliveryClientConfig {
  return {
    projectId: faker.datatype.uuid()
  }
}

function setDeliveryClientConfig(
  state: DeliveryClientBuilderState,
  config: Partial<IDeliveryClientConfig>
) {
  const stateConfig = state.config
  const mergedConfig = Object.assign(stateConfig, config)

  state.config = mergedConfig
}

function setResponseData<TData>(
  state: DeliveryClientBuilderState,
  data: TData
) {
  const httpService = createHttpServiceWithData(data)

  state.config.httpService = httpService
}

function createDeliveryClient(state: DeliveryClientBuilderState) {
  return createKontentDeliveryClient(state.config)
}

interface DeliveryClientBuilderState {
  config: IDeliveryClientConfig
}

interface DeliveryClientBuilder {
  withConfig(config: Partial<IDeliveryClientConfig>): DeliveryClientBuilder
  withResponseData<TData>(data: TData): DeliveryClientBuilder
  build(): IDeliveryClient
}

function deliveryClientBuilder() {
  const state: DeliveryClientBuilderState = {
    config: createDefaultDeliveryClientConfig()
  }

  const builder: DeliveryClientBuilder = {
    withConfig: function (config) {
      setDeliveryClientConfig(state, config)

      return this
    },
    withResponseData: function (data) {
      setResponseData(state, data)

      return this
    },
    build: function () {
      return createDeliveryClient(state)
    }
  }

  return builder
}

export { deliveryClientBuilder }

export type { DeliveryClientBuilder }
