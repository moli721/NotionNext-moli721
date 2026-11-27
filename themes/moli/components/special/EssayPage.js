import { useMemo } from 'react'
import { getPageCollection } from '../../lib/notionCollection'
import {
  EmptyState,
  PageBanner,
  PageNotes,
  thumbOf,
  TimeText,
  useImageZoom
} from './Shared'

/**
 * 读出说说列表，首页滚动条也用它
 * 数据库字段：内容（标题）、图片（文件）、日期、地点、链接；没填日期按创建时间
 */
export const getEssays = post => {
  const data = getPageCollection(post)
  return (data?.rows || [])
    .map(row => ({
      id: row.id,
      content: row.title,
      images: row.props['图片'] || [],
      time: row.props['日期'] || row.created,
      location: row.props['地点'],
      link: row.props['链接']
    }))
    .filter(e => e.content || e.images.length)
    .sort((a, b) => b.time - a.time)
}

/**
 * 说说页：瀑布流排列的短动态
 */
const EssayPage = ({ post }) => {
  const essays = useMemo(() => getEssays(post), [post])
  useImageZoom('#moli-essay .moli-essay-images img', [essays.length])

  return (
    <div id='moli-essay'>
      <PageBanner post={post} label={`共 ${essays.length} 条`} />

      {essays.length === 0 && <EmptyState text='还没有发说说' />}

      <div className='mt-8 columns-1 md:columns-2 xl:columns-3 gap-4'>
        {essays.map(essay => (
          <EssayCard key={essay.id} essay={essay} />
        ))}
      </div>

      <PageNotes post={post} />
    </div>
  )
}

const EssayCard = ({ essay }) => {
  const { content, images, time, location, link } = essay
  return (
    <article className='moli-card moli-card-hover wow fadeInUp mb-4 break-inside-avoid p-5'>
      {content && (
        <p className='whitespace-pre-wrap break-words leading-7'>{content}</p>
      )}
      {images.length > 0 && (
        <div
          className={`moli-essay-images mt-3 grid gap-2 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-3'}`}>
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={thumbOf(src, images.length === 1 ? 900 : 400)}
              data-zoom-src={src}
              alt=''
              loading='lazy'
              className={`w-full rounded-xl object-cover cursor-zoom-in bg-[var(--heo-color-card-muted)] ${images.length === 1 ? 'max-h-96' : 'aspect-square'}`}
            />
          ))}
        </div>
      )}
      <div className='moli-divider mt-4 pt-3 flex items-center gap-4 text-xs text-[var(--heo-color-text-secondary)]'>
        <span>
          <i className='far fa-clock mr-1' />
          <TimeText time={time} />
        </span>
        {location && (
          <span className='truncate'>
            <i className='fas fa-location-dot mr-1' />
            {location}
          </span>
        )}
        {link && (
          <a
            href={link}
            target='_blank'
            rel='noopener noreferrer'
            className='ml-auto hover:text-[var(--heo-color-primary)]'>
            <i className='fas fa-link mr-1' />
            链接
          </a>
        )}
      </div>
    </article>
  )
}

export default EssayPage
