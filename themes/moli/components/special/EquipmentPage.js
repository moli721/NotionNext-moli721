import LazyImage from '@/components/LazyImage'
import { useMemo } from 'react'
import { getPageCollection, groupRows } from '../../lib/notionCollection'
import {
  EmptyState,
  GroupTitle,
  PageBanner,
  PageNotes,
  useImageZoom
} from './Shared'

/**
 * 装备页：按「分类」分组的卡片墙
 * 数据库字段：名称、规格、简介、分类（单选）、排序、链接（可选）；产品图是每行的页面封面
 */
const EquipmentPage = ({ post }) => {
  const data = useMemo(() => getPageCollection(post), [post])
  const rows = data?.rows || []
  const groups = groupRows(rows, '分类', data?.options?.['分类'])
  useImageZoom('#moli-equipment .moli-equipment-cover img', [rows.length])

  return (
    <div id='moli-equipment'>
      <PageBanner
        post={post}
        label={`共 ${rows.length} 件`}
        images={rows.map(r => r.cover).filter(Boolean)}
      />

      {rows.length === 0 && <EmptyState text='还没有添加装备' />}

      {groups.map(group => (
        <section key={group.name || 'other'}>
          <GroupTitle title={group.name || '其他'} count={group.rows.length} />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {group.rows.map(row => (
              <EquipmentCard key={row.id} row={row} />
            ))}
          </div>
        </section>
      ))}

      <PageNotes post={post} />
    </div>
  )
}

const EquipmentCard = ({ row }) => {
  const { 规格: spec, 简介: desc, 链接: link } = row.props
  return (
    <article className='moli-card moli-card-hover wow fadeInUp flex flex-col overflow-hidden'>
      <div className='moli-equipment-cover'>
        {row.cover && (
          <LazyImage
            src={row.cover}
            alt={row.title}
            className='w-full h-full object-contain cursor-zoom-in'
          />
        )}
      </div>
      <div className='flex flex-col flex-1 p-4'>
        <h3 className='text-lg font-bold truncate' title={row.title}>
          {row.title}
        </h3>
        {spec && (
          <div className='mt-1 text-xs text-[var(--heo-color-text-secondary)] truncate' title={spec}>
            {spec}
          </div>
        )}
        {desc && (
          <p className='mt-3 text-sm leading-6 line-clamp-3 text-[var(--heo-color-text-secondary)]'>
            {desc}
          </p>
        )}
        {link && (
          <div className='mt-auto pt-4'>
            <a
              href={link}
              target='_blank'
              rel='noopener noreferrer'
              className='moli-pill-button'>
              详情
            </a>
          </div>
        )}
      </div>
    </article>
  )
}

export default EquipmentPage
