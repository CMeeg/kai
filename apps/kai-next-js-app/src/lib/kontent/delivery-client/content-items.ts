import {
  DeliveryError,
  MultipleItemsQuery,
  SingleItemQuery
} from '@kontent-ai/delivery-sdk'
import type { IContentItem } from '@kontent-ai/delivery-sdk'

interface ContentItemsResponse<
  TContentItem extends IContentItem = IContentItem
> {
  readonly error: DeliveryError | null
  readonly items: TContentItem[]
}

interface ContentItemResponse<
  TContentItem extends IContentItem = IContentItem
> {
  readonly error: DeliveryError | null
  readonly item: TContentItem | null
}

function createContentItemsSuccessResponse<
  TContentItem extends IContentItem = IContentItem
>(items: TContentItem[]): ContentItemsResponse<TContentItem> {
  return {
    error: null,
    items
  }
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

async function fetchContentItems<
  TContentItem extends IContentItem = IContentItem
>(
  query: MultipleItemsQuery<TContentItem>
): Promise<ContentItemsResponse<TContentItem>> {
  try {
    const response = await query.toPromise()

    return createContentItemsSuccessResponse(response.data.items)
  } catch (error) {
    // TODO: Logging
    return createContentItemsErrorResponse<TContentItem>(error)
  }
}

function createContentItemSuccessResponse<
  TContentItem extends IContentItem = IContentItem
>(item: TContentItem): ContentItemResponse<TContentItem> {
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

async function fetchContentItem<
  TContentItem extends IContentItem = IContentItem
>(
  query: SingleItemQuery<TContentItem>
): Promise<ContentItemResponse<TContentItem>> {
  try {
    const response = await query.toPromise()

    return createContentItemSuccessResponse(response.data.item)
  } catch (error) {
    // TODO: Logging
    return createContentItemErrorResponse<TContentItem>(error)
  }
}

export { fetchContentItems, fetchContentItem }
