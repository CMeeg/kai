import { DeliveryError, MultipleItemsQuery } from '@kontent-ai/delivery-sdk'
import type { IContentItem } from '@kontent-ai/delivery-sdk'

interface ContentItemsResponse<
  TContentItem extends IContentItem = IContentItem
> {
  readonly error: DeliveryError | null
  readonly items: TContentItem[]
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
    error: new DeliveryError({
      message,
      requestId: null,
      errorCode: 0,
      specificCode: 0
    }),
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

export { fetchContentItems }
