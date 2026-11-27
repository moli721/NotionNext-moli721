import { useRouter } from 'next/router'
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
 * 相册页：先显示相册列表，点进去是这本相册的照片墙
 * 数据库每一行是一本相册。字段：名称、照片（文件，可传多张）、简介、日期、地点、排序；
 * 相册封面用这一行的页面封面，没有就用第一张照片
 */
const AlbumPage = ({ post }) => {
  const router = useRouter()
  const albums = useMemo(
    () =>
      (getPageCollection(post)?.rows || [])
        .map(row => {
          const photos = row.props['照片'] || []
          return {
            id: row.id,
            name: row.title,
            photos,
            cover: row.cover || photos[0],
            description: row.props['简介'],
            time: row.props['日期'],
            location: row.props['地点']
          }
        })
        .filter(album => album.name && album.photos.length),
    [post]
  )
  const openId = router.query.album
  const current = albums.find(a => a.id === openId)

  // 打开相册只改网址里的 album 参数，不重新加载页面；浏览器后退回到相册列表
  const open = id => {
    const query = { ...router.query }
    delete query.prefix
    if (id) query.album = id
    else delete query.album
    router.push({ pathname: router.asPath.split('?')[0], query }, undefined, {
      shallow: true,
      scroll: true
    })
  }

  if (current) {
    return <AlbumDetail album={current} onBack={() => open(null)} />
  }

  const total = albums.reduce((n, a) => n + a.photos.length, 0)
  return (
    <div id='moli-album'>
      <PageBanner
        post={post}
        label={`${albums.length} 本相册 · ${total} 张照片`}
        images={albums.map(a => thumbOf(a.cover, 400))}
        imageFit='cover'
      />

      {albums.length === 0 && <EmptyState text='还没有相册' />}

      <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
        {albums.map(album => (
          <button
            key={album.id}
            type='button'
            onClick={() => open(album.id)}
            className='moli-album-card wow fadeInUp group text-left'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbOf(album.cover, 800)}
              alt={album.name}
              loading='lazy'
              className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            />
            <div className='moli-album-card-info'>
              <div className='text-xs opacity-80'>
                {album.photos.length} 张
                {album.location ? ` · ${album.location}` : ''}
              </div>
              <h3 className='mt-1 text-xl font-bold'>{album.name}</h3>
              {album.description && (
                <p className='mt-1 text-sm opacity-90 line-clamp-2'>
                  {album.description}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>

      <PageNotes post={post} />
    </div>
  )
}

const AlbumDetail = ({ album, onBack }) => {
  useImageZoom('#moli-album-detail .moli-photo img', [album.id])
  return (
    <div id='moli-album-detail'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <div>
          <button
            type='button'
            onClick={onBack}
            className='moli-pill-button'>
            <i className='fas fa-arrow-left mr-2' />
            全部相册
          </button>
          <h1 className='mt-4 text-3xl md:text-4xl font-extrabold'>{album.name}</h1>
          {album.description && (
            <p className='mt-2 text-[var(--heo-color-text-secondary)]'>
              {album.description}
            </p>
          )}
        </div>
        <div className='text-sm text-[var(--heo-color-text-secondary)]'>
          {album.photos.length} 张
          {album.time ? (
            <>
              {' · '}
              <TimeText time={album.time} />
            </>
          ) : null}
          {album.location ? ` · ${album.location}` : ''}
        </div>
      </div>

      <div className='mt-6 columns-2 md:columns-3 xl:columns-4 gap-3'>
        {album.photos.map((src, i) => (
          <div key={i} className='moli-photo mb-3 break-inside-avoid'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbOf(src, 600)}
              data-zoom-src={src}
              alt=''
              loading='lazy'
              className='w-full rounded-xl cursor-zoom-in bg-[var(--heo-color-card-muted)]'
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlbumPage
