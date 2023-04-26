import {
  DeliveryClient,
  DeliveryError,
  IContentItem,
  MultipleItemsQuery,
  SingleItemQuery
} from '@kontent-ai/delivery-sdk'
import type { IDeliveryClientConfig } from '@kontent-ai/delivery-sdk'
import {
  KaiContentItem,
  contentItemResponseResolver,
  contentItemUrlResolver
} from '@meeg/kai-delivery'
import { routeConfig } from '~/lib/kontent/routing'

function createDeliveryClient(preview = false) {
  const config: IDeliveryClientConfig = {
    environmentId: process.env.PRIVATE_KONTENT_ENV_ID ?? ''
  }

  if (preview) {
    config.previewApiKey = process.env.PRIVATE_KONTENT_PREVIEW_API_KEY
    config.defaultQueryConfig = {
      usePreviewMode: true
    }
  }

  return new DeliveryClient(config)
}

function getErrorMessage(error: unknown): string {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  ) {
    return error.message
  }

  return String(error)
}

function createDeliveryError(message: string): DeliveryError {
  return new DeliveryError({
    message,
    requestId: null,
    errorCode: 0,
    specificCode: 0
  })
}

interface ContentItemResponse<
  TContentItem extends IContentItem = IContentItem
> {
  readonly error: DeliveryError | null
  readonly item: KaiContentItem<TContentItem> | null
}

function createContentItemSuccessResponse<
  TContentItem extends IContentItem = IContentItem
>(item: KaiContentItem<TContentItem>): ContentItemResponse<TContentItem> {
  return {
    error: null,
    item
  }
}

function createContentItemErrorResponse<
  TContentItem extends IContentItem = IContentItem
>(error: unknown): ContentItemResponse<TContentItem> {
  if (error instanceof DeliveryError) {
    return {
      error,
      item: null
    }
  }

  const message = getErrorMessage(error)

  return {
    error: createDeliveryError(message),
    item: null
  }
}

interface ContentItemsResponse<
  TContentItem extends IContentItem = IContentItem
> {
  readonly error: DeliveryError | null
  readonly items: KaiContentItem<TContentItem>[]
}

function createContentItemsSuccessResponse<
  TContentItem extends IContentItem = IContentItem
>(items: KaiContentItem<TContentItem>[]): ContentItemsResponse<TContentItem> {
  return {
    error: null,
    items
  }
}

function createContentItemsErrorResponse<
  TContentItem extends IContentItem = IContentItem
>(error: unknown): ContentItemsResponse<TContentItem> {
  if (error instanceof DeliveryError) {
    return {
      error,
      items: []
    }
  }

  const message = getErrorMessage(error)

  return {
    error: createDeliveryError(message),
    items: []
  }
}

interface KontentApi {
  fetchItem: <T extends IContentItem = IContentItem>(
    query: (client: DeliveryClient) => SingleItemQuery<T>
  ) => Promise<ContentItemResponse<T>>
  fetchItems: <T extends IContentItem = IContentItem>(
    query: (client: DeliveryClient) => MultipleItemsQuery<T>
  ) => Promise<ContentItemsResponse<T>>
}

function createKontentApi(preview = false): KontentApi {
  const deliveryClient = createDeliveryClient(preview)
  const urlResolver = contentItemUrlResolver(routeConfig)
  const responseResolver = contentItemResponseResolver({
    routing: {
      urlResolver
    }
  })

  return {
    fetchItem: async (query) => {
      try {
        const response = await query(deliveryClient).toPromise()

        const item = responseResolver.resolveItem(response)

        return createContentItemSuccessResponse(item)
      } catch (error) {
        // TODO: Logging
        return createContentItemErrorResponse(error)
      }
    },
    fetchItems: async (query) => {
      try {
        const response = await query(deliveryClient).toPromise()

        const items = responseResolver.resolveItems(response)

        return createContentItemsSuccessResponse(items)
      } catch (error) {
        // TODO: Logging
        return createContentItemsErrorResponse(error)
      }
    }
  }
}

export { createDeliveryClient, createKontentApi }
