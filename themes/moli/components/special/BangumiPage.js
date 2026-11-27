import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../../config'
import { fetchBangumi, groupBangumi } from '../../lib/bangumi'
import { EmptyState, PageBanner, PageNotes } from './Shared'

/**
 * 读 Bangumi 收藏的通用钩子，关于页的“在看”卡片也用它
 */
export const useBangumi = () => {
  const user = siteConfig('MOLI_BANGUMI_USER', null, CONFIG)
  const [state, setState] = useState({ loading: !!user, items: [], error: null })
  useEffect(() => {
    if (!user) return
    let alive = true
    fetchBangumi(user)
      .then(items => alive && setState({ loading: false, items, error: null }))
      .catch(error => alive && setState({ loading: false, items: [], error }))
    return () => {
      alive = false
    }
  }, [user])
  return { user, ...state }
}

/**
 * 追番页：读 Bangumi 番组计划上的公开收藏，按动画 / 书籍 / 游戏和在看 / 看过 / 想看分栏
 * 配置中心 MOLI_BANGUMI_USER 填 Bangumi 的用户名或数字 id
 */
const BangumiPage = ({ post }) => {
  const { user, loading, items, error } = useBangumi()
  const groups = groupBangumi(items)
  const [typeId, setTypeId] = useState(null)
  const [status, setStatus] = useState(null)

  const type = groups.find(g => g.id === typeId) || groups[0]
  const current =
    type?.statuses.find(s => s.status === status) || type?.statuses[0]

  const label = type
    ? type.statuses.map(s => `${s.name} ${s.items.length}`).join(' · ')
    : ''

  return (
    <div id='moli-bangumi'>
      <PageBanner
        post={post}
        label={label}
        images={(current?.items || []).slice(0, 3).map(i => i.cover)}
        imageFit='cover'
      />

      {!user && <EmptyState text='还没有设置 Bangumi 账号' />}
      {loading && <EmptyState text='正在读取…' />}
      {error && <EmptyState text='Bangumi 暂时连不上，稍后刷新再试' />}
      {user && !loading && !error && groups.length === 0 && (
        <EmptyState text='Bangumi 上还没有收藏' />
      )}

      {type && (
        <>
          <div className='mt-8 flex flex-wrap items-center gap-3'>
            {groups.length > 1 &&
              groups.map(g => (
                <button
                  key={g.id}
                  type='button'
                  onClick={() => {
                    setTypeId(g.id)
                    setStatus(null)
                  }}
                  className={`moli-tab ${g.id === type.id ? 'is-active' : ''}`}>
                  {g.name}
                  <span className='ml-1 opacity-60'>{g.count}</span>
                </button>
              ))}
            {groups.length > 1 && (
              <span className='mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600' />
            )}
            {type.statuses.map(s => (
              <button
                key={s.status}
                type='button'
                onClick={() => setStatus(s.status)}
                className={`moli-tab ${s.status === current.status ? 'is-active' : ''}`}>
                {s.name}
                <span className='ml-1 opacity-60'>{s.items.length}</span>
              </button>
            ))}
          </div>

          <div className='mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4'>
            {current.items.map(item => (
              <BangumiCard key={item.id} item={item} type={type} />
            ))}
          </div>
        </>
      )}

      {user && (
        <p className='mt-6 text-xs text-[var(--heo-color-text-secondary)]'>
          数据来自{' '}
          <a
            href={`https://bgm.tv/user/${user}`}
            target='_blank'
            rel='noopener noreferrer'
            className='underline'>
            Bangumi 番组计划
          </a>
        </p>
      )}

      <PageNotes post={post} />
    </div>
  )
}

const BangumiCard = ({ item, type }) => {
  let progress = item.date?.slice(0, 4)
  if (type.id === 2 && item.eps) {
    progress = item.epStatus
      ? `看到 ${item.epStatus} / ${item.eps} 话`
      : `共 ${item.eps} 话`
  }
  return (
    <a
      href={`https://bgm.tv/subject/${item.id}`}
      target='_blank'
      rel='noopener noreferrer'
      title={item.summary || item.name}
      className='moli-bangumi-card group'>
      <div className='moli-bangumi-cover'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.cover}
          alt={item.name}
          loading='lazy'
          referrerPolicy='no-referrer'
          className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
        />
        {item.score > 0 && (
          <span className='moli-bangumi-score'>★ {item.score.toFixed(1)}</span>
        )}
      </div>
      <div className='mt-2 text-sm font-bold leading-5 line-clamp-2'>
        {item.name}
      </div>
      {progress && (
        <div className='mt-1 text-xs text-[var(--heo-color-text-secondary)]'>
          {progress}
        </div>
      )}
    </a>
  )
}

export default BangumiPage
