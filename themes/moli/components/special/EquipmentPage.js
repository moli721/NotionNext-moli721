import LazyImage from '@/components/LazyImage'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getPageCollection, groupRows } from '../../lib/notionCollection'
import { EmptyState, PageNotes } from './Shared'

const ALL = '全部'

/**
 * 装备页：左边是标题和分类，右边是方形卡片墙，点卡片看详情
 * 数据库字段：名称、规格、简介、分类（单选，按选项顺序排）、排序、链接（可选）
 * 产品图是每行的页面封面，用透明背景的图，产品放在卡片正中完整显示
 */
const EquipmentPage = ({ post }) => {
  const data = useMemo(() => getPageCollection(post), [post])
  const rows = useMemo(() => data?.rows || [], [data])
  const groups = useMemo(
    () => groupRows(rows, '分类', data?.options?.['分类']).filter(g => g.name),
    [rows, data]
  )
  const [category, setCategory] = useState(ALL)
  const [animate, setAnimate] = useState(false)
  const [opened, setOpened] = useState(null)
  const close = useCallback(() => setOpened(null), [])

  const shown =
    category === ALL ? rows : groups.find(g => g.name === category)?.rows || []
  const tabs = [{ name: ALL, count: rows.length }].concat(
    groups.map(g => ({ name: g.name, count: g.rows.length }))
  )

  const choose = name => {
    if (name === category) return
    setAnimate(true)
    setCategory(name)
  }

  return (
    <div id='moli-equipment' className='moli-shelf'>
      <aside className='moli-shelf-side'>
        <div className='moli-shelf-heading'>
          <h1>{post?.title}</h1>
          <p>共 {rows.length} 件</p>
        </div>
        {groups.length > 0 && (
          <div className='moli-shelf-cats' role='tablist' aria-label='分类'>
            {tabs.map(tab => (
              <button
                key={tab.name}
                type='button'
                role='tab'
                aria-selected={tab.name === category}
                onClick={() => choose(tab.name)}>
                <span>{tab.name}</span>
                <span className='moli-shelf-cat-count'>{tab.count}</span>
              </button>
            ))}
          </div>
        )}
      </aside>

      <div className='min-w-0'>
        {rows.length === 0 ? (
          <EmptyState text='还没有添加装备' />
        ) : (
          <ul key={category} className='moli-shelf-grid'>
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
  const spec = row.props['规格']
  return (
    <button
      type='button'
      className='moli-shelf-card'
      aria-haspopup='dialog'
      onClick={() => onOpen(row)}>
      <span className='moli-shelf-tile'>
        {row.cover && <LazyImage src={row.cover} alt={row.title} />}
      </span>
      <span className='moli-shelf-name'>{row.title}</span>
      {spec && <span className='moli-shelf-spec'>{spec}</span>}
    </button>
  )
}

/**
 * 详情弹窗：大图、规格、简介，有链接时显示「详情」按钮
 * 挂在 #theme-heo 下面，避开页面里带动画的容器，主题的深色样式照样生效
 */
const EquipmentDetail = ({ row, onClose }) => {
  const closeRef = useRef(null)
  const [root, setRoot] = useState(null)
  const { 规格: spec, 简介: desc, 分类: category, 链接: link } = row.props
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
          {category && <div className='moli-shelf-panel-cat'>{category}</div>}
          <h2 id='moli-shelf-title'>{row.title}</h2>
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
