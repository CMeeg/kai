import type { Contracts } from '@kontent-ai/delivery-sdk'

function createComponentHtml(codename: string) {
  // TODO: is this html still correct?
  return `<object type="application/kenticocloud" data-type="item" data-rel="component" data-codename="${codename}"></object>`
}

function createImageAssetHtml(id: string, url: string, alt: string) {
  // TODO: is this html still correct?
  return `<figure data-asset-id="${id}" data-image-id="${id}"><img src="${url}" data-asset-id="${id}" data-image-id="${id}" alt="${alt}"></figure>`
}

function createInternalLinkHtml(
  contentItem: Contracts.IViewContentItemContract,
  text: string
) {
  const itemId = contentItem.item.system.id

  // TODO: is this html still correct?
  return `<a data-item-id="${itemId}" href="">${text}</a>`
}

function createLinkedItemHtml(codename: string) {
  // TODO: is this html still correct?
  return `<object type="application/kenticocloud" data-type="item" data-rel="link" data-codename="${codename}"></object>`
}

export {
  createComponentHtml,
  createImageAssetHtml,
  createInternalLinkHtml,
  createLinkedItemHtml
}
