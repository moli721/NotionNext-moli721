import { useMemo } from 'react'
import { getPageCollection, groupRows } from '../../lib/notionCollection'
import { EmptyState, GroupTitle, PageBanner, PageNotes, thumbOf } from './Shared'

/**
 * 友链页：按「分组」排列的友链卡片，申请说明写在页面正文里
 * 数据库字段：名称、链接、头像（文件，不填就用这一行的图标）、简介、分组（单选）、排序
 */
const LinksPage = ({ post }) => {
  const data = useMemo(() => getPageCollection(post), [post])
  const links = (data?.rows || [])
    .map(row => ({
      id: row.id,
      name: row.title,
      url: row.props['链接'],
      avatar:
        row.props['头像']?.[0] ||
        (row.icon?.type === 'image' ? row.icon.src : null),
      emoji: row.icon?.type === 'emoji' ? row.icon.text : null,
      description: row.props['简介'],
      props: row.props
    }))
    .filter(link => link.name && link.url)
  const groups = groupRows(links, '分组', data?.options?.['分组'])

  return (
    <div id='moli-links'>
      <PageBanner post={post} label={`共 ${links.length} 位朋友`}>
        {links.length > 0 && (
          <div className='mt-6 flex flex-wrap gap-2'>
            {links.slice(0, 12).map(link => (
              <a
                key={link.id}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                title={link.name}
                className='moli-banner-avatar'>
                <Avatar link={link} />
              </a>
            ))}
          </div>
        )}
      </PageBanner>

      {links.length === 0 && <EmptyState text='还没有友链' />}

      {groups.map(group => (
        <section key={group.name || 'other'}>
          <GroupTitle
            title={group.name || (groups.length > 1 ? '其他' : '友链')}
            count={group.rows.length}
          />
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {group.rows.map(link => (
              <a
                key={link.id}
                href={link.url}
                target='_blank'
                rel='noopener noreferrer'
                className='moli-card moli-link-card wow fadeInUp flex items-center gap-4 p-4'>
                <div className='moli-link-avatar shrink-0'>
                  <Avatar link={link} />
                </div>
                <div className='min-w-0'>
                  <div className='font-bold truncate'>{link.name}</div>
                  {link.description && (
                    <div className='moli-link-desc mt-1 text-sm line-clamp-2'>
                      {link.description}
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </section>
      ))}

      <PageNotes post={post} />
    </div>
  )
}

const Avatar = ({ link }) => {
  if (link.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbOf(link.avatar, 160)}
        alt={link.name}
        loading='lazy'
        className='w-full h-full rounded-full object-cover'
      />
    )
  }
  return (
    <span className='w-full h-full rounded-full flex items-center justify-center bg-[var(--heo-color-card-muted)] text-[var(--heo-color-text)] font-bold'>
      {link.emoji || link.name.match(/[\p{L}\p{N}]/u)?.[0] || '?'}
    </span>
  )
}

export default LinksPage
