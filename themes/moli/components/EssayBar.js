import SmartLink from '@/components/SmartLink'
import { useEffect, useState } from 'react'
import { getEssays } from './special/EssayPage'
import { ESSAY_SLUG } from './special'

/**
 * 首页文章列表上方的说说滚动条：轮流显示最新几条说说，点击进入说说页
 * 说说页的数据在页面打开后再取，不拖慢首页
 */
const EssayBar = () => {
  const [essays, setEssays] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // 站点开了多语言时，数据地址里要带上语言，例如 /_next/data/<id>/zh-CN/essay.json
    const { buildId, locale } = window.__NEXT_DATA__ || {}
    if (!buildId) return
    const localePath = locale ? `${locale}/` : ''
    let cancelled = false
    const load = () => {
      fetch(`/_next/data/${buildId}/${localePath}${ESSAY_SLUG}.json`)
        .then(res => (res.ok ? res.json() : null))
        .then(data => {
          if (cancelled || !data?.pageProps?.post) return
          setEssays(getEssays(data.pageProps.post).slice(0, 8))
        })
        .catch(() => {})
    }
    const idle = window.requestIdleCallback || (fn => setTimeout(fn, 1500))
    idle(load)
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (essays.length < 2) return
    const timer = setInterval(
      () => setIndex(i => (i + 1) % essays.length),
      3500
    )
    return () => clearInterval(timer)
  }, [essays.length])

  if (essays.length === 0) return null

  return (
    <SmartLink
      href={`/${ESSAY_SLUG}`}
      className='moli-card moli-card-hover wow fadeInUp mb-4 flex items-center gap-3 h-14 px-5'>
      <i className='fas fa-feather-pointed text-[var(--heo-color-primary)] dark:text-[var(--heo-color-accent)]' />
      <span className='shrink-0 font-bold'>说说</span>
      <div className='moli-essay-bar-track relative flex-1 h-full overflow-hidden'>
        {essays.map((essay, i) => (
          <div
            key={essay.id}
            className={`moli-essay-bar-item absolute inset-0 flex items-center truncate ${i === index ? 'is-active' : ''} ${i === (index - 1 + essays.length) % essays.length && essays.length > 1 ? 'is-prev' : ''}`}>
            <span className='truncate'>
              {essay.content || '[图片]'}
            </span>
          </div>
        ))}
      </div>
      <i className='fas fa-angle-right opacity-50' />
    </SmartLink>
  )
}

export default EssayBar
