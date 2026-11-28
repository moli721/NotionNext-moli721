import LazyImage from '@/components/LazyImage'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getPageCollection, groupRows } from '../../lib/notionCollection'
import { EmptyState, PageNotes } from './Shared'

const ALL = '全部'
const SORTS = [
  { key: 'default', label: '默认' },
  { key: 'asc', label: '价格从低到高' },
  { key: 'desc', label: '价格从高到低' }
]

const priceOf = row =>
  typeof row.props['价格'] === 'number' ? row.props['价格'] : null

const formatPrice = price => `¥${price.toLocaleString('en-US')}`

// 名称开头已经写了品牌的，卡片上品牌单独一行，名称里就省掉
const nameOf = row => {
  const brand = row.props['品牌']
  if (brand && row.title.startsWith(brand)) {
    return row.title.slice(brand.length).trim() || row.title
  }
  return row.title
}

const sortRows = (rows, sort) => {
  if (sort === 'default') return rows
  return [...rows].sort((a, b) => {
    const pa = priceOf(a)
    const pb = priceOf(b)
    if (pa === null) return pb === null ? 0 : 1
    if (pb === null) return -1
    return sort === 'asc' ? pa - pb : pb - pa
  })
}

/**
 * 装备页：左边是标题、分类和排序，右边是方形卡片墙，点卡片看详情
 * 数据库字段：名称、品牌、价格、规格、简介、分类（单选，按选项顺序排）、排序、链接（可选）
 * 产品图是每行的页面封面，用透明背景的图，产品放在卡片正中完整显示
 */
const EquipmentPage = ({ post }) => {
  const data = useMemo(() => getPageCollection(post), [post])
  const rows = useMemo(() => data?.rows || [], [data])
  const groups = useMemo(
    () => groupRows(rows, '分类', data?.options?.['分类']).filter(g => g.name),
    [rows, data]
  )
  const hasPrice = rows.some(r => priceOf(r) !== null)
  const [category, setCategory] = useState(ALL)
  const [sort, setSort] = useState('default')
  const [animate, setAnimate] = useState(false)
  const [opened, setOpened] = useState(null)
  const close = useCallback(() => setOpened(null), [])

  const inCategory =
    category === ALL ? rows : groups.find(g => g.name === category)?.rows || []
  const shown = sortRows(inCategory, sort)
  const tabs = [ALL].concat(groups.map(g => g.name))

  const choose = (setter, current) => value => {
    if (value === current) return
    setAnimate(true)
    setter(value)
  }

  return (
    <div id='moli-equipment' className='moli-shelf'>
      <aside className='moli-shelf-side'>
        <div className='moli-shelf-heading'>
          <h1>{post?.title}</h1>
          <p>共 {rows.length} 件</p>
        </div>
        {groups.length > 0 && (
          <div className='moli-shelf-options' role='tablist' aria-label='分类'>
            {tabs.map(name => (
              <button
                key={name}
                type='button'
                role='tab'
                aria-selected={name === category}
                onClick={() => choose(setCategory, category)(name)}>
                {name}
              </button>
            ))}
          </div>
        )}
        {hasPrice && (
          <div className='moli-shelf-sort'>
            <div className='moli-shelf-label'>排序</div>
            <div className='moli-shelf-options' role='radiogroup' aria-label='排序'>
              {SORTS.map(s => (
                <button
                  key={s.key}
                  type='button'
                  role='radio'
                  aria-checked={s.key === sort}
                  onClick={() => choose(setSort, sort)(s.key)}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div className='min-w-0'>
        {rows.length === 0 ? (
          <EmptyState text='还没有添加装备' />
        ) : (
          <ul key={`${category}-${sort}`} className='moli-shelf-grid'>
            {shown.map((row, i) => (
              <li
                key={row.id}
                className={animate ? 'moli-shelf-enter' : ''}
                style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                <EquipmentCard row={row} onOpen={setOpened} />
              </li>
            ))}
          </ul>
        )}
        <PageNotes post={post} />
      </div>

      {opened && <EquipmentDetail row={opened} onClose={close} />}
    </div>
  )
}

const EquipmentCard = ({ row, onOpen }) => {
  const brand = row.props['品牌']
  const price = priceOf(row)
  const name = nameOf(row)
  return (
    <button
      type='button'
      className='moli-shelf-card'
      aria-haspopup='dialog'
      onClick={() => onOpen(row)}>
      <span className='moli-shelf-tile'>
        {row.cover && <LazyImage src={row.cover} alt={row.title} />}
      </span>
      {brand && <span className='moli-shelf-brand'>{brand}</span>}
      <span className='moli-shelf-line'>
        <span className='moli-shelf-name' title={name}>
          {name}
        </span>
        {price !== null && (
          <span className='moli-shelf-price'>{formatPrice(price)}</span>
        )}
      </span>
    </button>
  )
}

/**
 * 详情弹窗：大图、价格、规格、简介，有链接时显示「详情」按钮
 * 挂在 #theme-heo 下面，避开页面里带动画的容器，主题的深色样式照样生效
 */
const EquipmentDetail = ({ row, onClose }) => {
  const closeRef = useRef(null)
  const [root, setRoot] = useState(null)
  const { 规格: spec, 简介: desc, 品牌: brand, 链接: link } = row.props
  const price = priceOf(row)
  const specs = (spec || '')
    .split('·')
    .map(s => s.trim())
    .filter(Boolean)

  useEffect(() => {
    setRoot(document.getElementById('theme-heo') || document.body)
  }, [])

  useEffect(() => {
    if (!root) return
    const last = document.activeElement
    closeRef.current?.focus()
    const onKey = e => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const html = document.documentElement
    const overflow = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      html.style.overflow = overflow
      last?.focus?.()
    }
  }, [root, onClose])

  if (!root) return null
  return createPortal(
    <div className='moli-shelf-dialog'>
      <div className='moli-shelf-scrim' onClick={onClose} />
      <div
        className='moli-shelf-panel'
        role='dialog'
        aria-modal='true'
        aria-labelledby='moli-shelf-title'>
        <div className='moli-shelf-panel-media'>
          {row.cover && <LazyImage src={row.cover} alt={row.title} priority />}
        </div>
        <div className='moli-shelf-panel-body'>
          {brand && <div className='moli-shelf-panel-brand'>{brand}</div>}
          <h2 id='moli-shelf-title'>{nameOf(row)}</h2>
          {price !== null && (
            <div className='moli-shelf-panel-price'>{formatPrice(price)}</div>
          )}
          {specs.length > 0 && (
            <ul className='moli-shelf-chips'>
              {specs.map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          )}
          {desc && <p className='moli-shelf-desc'>{desc}</p>}
          {link && (
            <a
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              className='moli-pill-button self-start'>
              详情
            </a>
          )}
        </div>
        <button
          ref={closeRef}
          type='button'
          className='moli-shelf-close'
          aria-label='关闭'
          onClick={onClose}>
          <i className='fas fa-times' />
        </button>
      </div>
    </div>,
    root
  )
}

export default EquipmentPage
