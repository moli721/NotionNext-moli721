import { mapImgUrl } from '@/lib/db/notion/mapImage'
import { getBlockValue } from 'notion-utils'

/**
 * 读取页面里内嵌的 Notion 数据库。
 * 专属页面（装备、说说、友链、相册）的数据都放在页面里的一个数据库中，
 * 这里把它整理成「按字段名取值」的行列表，行的顺序与数据库视图的排序、筛选一致。
 */

const textOf = value =>
  Array.isArray(value) ? value.map(segment => segment?.[0] ?? '').join('') : ''

const decorationOf = (value, type) => {
  for (const segment of value || []) {
    const found = (segment?.[1] || []).find(d => d?.[0] === type)
    if (found) return found[1]
  }
  return null
}

const toDate = (dateDecoration, fallback) => {
  if (dateDecoration?.start_date) {
    const time = dateDecoration.start_time ? `T${dateDecoration.start_time}` : ''
    const parsed = Date.parse(`${dateDecoration.start_date}${time}`)
    if (Number.isFinite(parsed)) return parsed
  }
  return fallback
}

const fileUrlsOf = (value, block) =>
  (value || [])
    .map(segment => {
      const link = (segment?.[1] || []).find(d => d?.[0] === 'a')?.[1]
      return link || segment?.[0]
    })
    .filter(url => typeof url === 'string' && /^(https?:|attachment:|\/)/.test(url))
    .map(url => mapImgUrl(url, block, 'block'))

const readProperty = (schemaItem, value, block) => {
  switch (schemaItem.type) {
    case 'number': {
      const n = parseFloat(textOf(value))
      return Number.isFinite(n) ? n : null
    }
    case 'checkbox':
      return textOf(value) === 'Yes'
    case 'multi_select':
      return textOf(value)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    case 'date':
      return toDate(decorationOf(value, 'd'), null)
    case 'file':
      return fileUrlsOf(value, block)
    case 'url':
      return decorationOf(value, 'a') || textOf(value)
    case 'created_time':
      return block.created_time
    case 'last_edited_time':
      return block.last_edited_time
    default:
      return textOf(value)
  }
}

const iconOf = block => {
  const icon = block?.format?.page_icon
  if (!icon) return null
  if (/^(https?:|attachment:|\/)/.test(icon)) {
    return { type: 'image', src: mapImgUrl(icon, block, 'block') }
  }
  return { type: 'emoji', text: icon }
}

/**
 * 页面内第一个数据库
 * @returns {{ name, rows, options } | null}
 *  rows: [{ id, title, cover, icon, created, props: { 字段名: 值 } }]
 *  options: { 字段名: [单选项, ...] }，保持 Notion 里选项的顺序，用于分组排序
 */
export function getPageCollection(post) {
  const blockMap = post?.blockMap
  if (!blockMap?.block) return null
  const page = getBlockValue(blockMap.block[post.id])
  const viewBlock = (page?.content || [])
    .map(id => getBlockValue(blockMap.block[id]))
    .find(b => b?.type === 'collection_view')
  if (!viewBlock) return null

  const collectionId =
    viewBlock.collection_id || viewBlock.format?.collection_pointer?.id
  const collection = getBlockValue(blockMap.collection?.[collectionId])
  const schema = collection?.schema || {}
  const viewId = viewBlock.view_ids?.[0]
  const query = blockMap.collection_query?.[collectionId]?.[viewId]
  const rowIds =
    query?.collection_group_results?.blockIds ||
    query?.blockIds ||
    Object.keys(blockMap.block).filter(
      id => getBlockValue(blockMap.block[id])?.parent_id === collectionId
    )

  const rows = rowIds
    .map(id => getBlockValue(blockMap.block[id]))
    .filter(block => block && block.alive !== false)
    .map(block => {
      const props = {}
      Object.entries(schema).forEach(([key, item]) => {
        props[item.name] = readProperty(item, block.properties?.[key], block)
      })
      const cover = block.format?.page_cover
      return {
        id: block.id,
        title: textOf(block.properties?.title),
        cover: cover ? mapImgUrl(cover, block, 'block') : null,
        icon: iconOf(block),
        created: block.created_time,
        props
      }
    })

  const options = {}
  Object.values(schema).forEach(item => {
    if (item.options) options[item.name] = item.options.map(o => o.value)
  })

  return { name: textOf(collection?.name), rows, options }
}

/**
 * 去掉数据库后的页面正文；只剩空内容时返回 null
 */
export function getPostWithoutCollections(post) {
  const blockMap = post?.blockMap
  const pageEntry = blockMap?.block?.[post?.id]
  const page = getBlockValue(pageEntry)
  if (!page) return null
  const content = (page.content || []).filter(id => {
    const block = getBlockValue(blockMap.block[id])
    if (!block || block.type === 'collection_view') return false
    // 空段落不算内容
    return !(block.type === 'text' && !textOf(block.properties?.title).trim())
  })
  if (content.length === 0) return null
  const newPage = { ...page, content }
  const newEntry = pageEntry.value?.value
    ? { ...pageEntry, value: { ...pageEntry.value, value: newPage } }
    : { ...pageEntry, value: newPage }
  return {
    ...post,
    blockMap: { ...blockMap, block: { ...blockMap.block, [post.id]: newEntry } }
  }
}

/**
 * 按单选字段分组，组的顺序跟 Notion 里选项的顺序一致，没填的放最后
 */
export function groupRows(rows, field, optionOrder = []) {
  const groups = new Map()
  optionOrder.forEach(name => groups.set(name, []))
  rows.forEach(row => {
    const key = row.props[field] || ''
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(row)
  })
  if (groups.has('')) {
    const rest = groups.get('')
    groups.delete('')
    groups.set('', rest)
  }
  return [...groups.entries()]
    .filter(([, list]) => list.length > 0)
    .map(([name, list]) => ({ name, rows: list }))
}
