import LazyImage from '@/components/LazyImage'
import NotionPage from '@/components/NotionPage'
import { compressImage } from '@/lib/db/notion/mapImage'
import mediumZoom from '@fisch0920/medium-zoom'
import { useEffect, useMemo, useState } from 'react'
import { getPostWithoutCollections } from '../../lib/notionCollection'

/**
 * 专属页面顶部横幅：左边是标题和摘要，右边可以放几张代表图
 * 有页面封面时用封面做背景，没有时用主题色渐变
 */
export const PageBanner = ({
  post,
  label,
  images = [],
  imageFit = 'contain',
  children
}) => {
  const cover = post?.pageCoverThumbnail || post?.pageCover
  return (
    <section
      className={`moli-banner wow fadeInUp relative overflow-hidden rounded-3xl text-white ${cover ? 'has-cover' : ''}`}>
      {cover && (
        <LazyImage
          src={cover}
          priority
          alt=''
          className='absolute inset-0 w-full h-full object-cover'
        />
      )}
      <div className='relative z-10 flex items-center justify-between gap-8 p-8 md:p-12 min-h-[16rem]'>
        <div className='min-w-0'>
          {label && (
            <div className='text-sm font-semibold tracking-wider opacity-80'>
              {label}
            </div>
          )}
          <h1 className='mt-2 text-3xl md:text-5xl font-extrabold tracking-wide'>
            {post?.title}
          </h1>
          {post?.summary && (
            <p className='mt-4 text-base md:text-lg opacity-90'>
              {post.summary}
            </p>
          )}
          {children}
        </div>
        {images.length > 0 && (
          <div className='moli-banner-images hidden md:flex shrink-0'>
            {images.slice(0, 3).map((src, i) => (
              <div key={i} className='moli-banner-image'>
                <LazyImage
                  src={src}
                  alt=''
                  className={`w-full h-full ${imageFit === 'cover' ? 'object-cover' : 'object-contain'}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

/**
 * 分组标题
 */
export const GroupTitle = ({ title, count, description }) => (
  <div className='mt-10 mb-4'>
    <h2 className='text-2xl font-bold'>
      {title}
      {count > 0 && (
        <span className='ml-2 text-base font-normal opacity-50'>{count}</span>
      )}
    </h2>
    {description && (
      <p className='mt-1 text-[var(--heo-color-text-secondary)]'>{description}</p>
    )}
  </div>
)

/**
 * 页面正文里除数据库以外的内容，放在数据下方，比如友链的申请说明
 */
export const PageNotes = ({ post }) => {
  const notesPost = useMemo(() => getPostWithoutCollections(post), [post])
  if (!notesPost) return null
  return (
    <section className='moli-card moli-notes mt-10 p-5 md:p-8'>
      <NotionPage post={notesPost} />
    </section>
  )
}

/**
 * 数据库还没有内容时的提示
 */
export const EmptyState = ({ text }) => (
  <div className='moli-card mt-8 py-16 text-center text-[var(--heo-color-text-secondary)]'>
    {text}
  </div>
)

/**
 * 点击图片放大，selector 选中要放大的图片
 */
export const useImageZoom = (selector, deps) => {
  useEffect(() => {
    const zoom = mediumZoom(selector, {
      background: 'rgba(0, 0, 0, 0.6)',
      margin: 24
    })
    return () => zoom.detach()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * 日期按北京时间显示，服务器和浏览器算出来一样
 */
export const formatDate = time => {
  if (!time) return ''
  const d = new Date(time + 8 * 3600 * 1000)
  return `${d.getUTCFullYear()} 年 ${d.getUTCMonth() + 1} 月 ${d.getUTCDate()} 日`
}

/**
 * 时间：页面打开后，一周内的显示“x 天前”，更早的显示日期
 */
export const TimeText = ({ time, className }) => {
  const [now, setNow] = useState(null)
  useEffect(() => setNow(Date.now()), [])
  let text = formatDate(time)
  if (now && time) {
    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour
    const diff = now - time
    if (diff < hour) text = `${Math.max(1, Math.round(diff / minute))} 分钟前`
    else if (diff < day) text = `${Math.round(diff / hour)} 小时前`
    else if (diff < 7 * day) text = `${Math.round(diff / day)} 天前`
  }
  return (
    <time className={className} dateTime={time ? new Date(time).toISOString() : ''}>
      {text}
    </time>
  )
}

/**
 * 缩略图：Notion 图片代理按 width 参数缩小，其他图床交给通用压缩
 */
export const thumbOf = (src, width) => {
  if (!src) return src
  try {
    const url = new URL(src)
    if (url.pathname.startsWith('/image/')) {
      url.searchParams.set('width', width)
      url.searchParams.set('cache', 'v2')
      return url.toString()
    }
  } catch {}
  return compressImage(src, width)
}
