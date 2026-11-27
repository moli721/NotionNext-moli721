import LazyImage from '@/components/LazyImage'
import NotionPage from '@/components/NotionPage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../../config'
import { groupBangumi } from '../../lib/bangumi'
import { useBangumi } from './BangumiPage'

/**
 * 关于页：头像和自我介绍、站点数据、常用工具、在看的番、其他专属页面入口，最后是页面正文
 * 用到的都是已有配置：AUTHOR、BIO、HEO_INFOCARD_GREETINGS（第一句是问候语，其余是标签）、
 * HEO_GROUP_ICONS（工具图标）、HEO_SITE_CREATE_TIME、CONTACT_*；正文照常在 Notion 里写
 */
const AboutPage = props => {
  const { post, siteInfo } = props
  return (
    <div id='moli-about'>
      <AboutHero siteInfo={siteInfo} />
      <div className='mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <StatsCard {...props} />
        <SkillsCard />
      </div>
      <div className='mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4'>
        <BangumiCard />
        <MoreCard {...props} />
      </div>
      <section className='moli-card moli-notes wow fadeInUp mt-4 p-5 md:p-10'>
        <NotionPage post={post} />
      </section>
    </div>
  )
}

const AboutHero = ({ siteInfo }) => {
  const greetings = siteConfig('HEO_INFOCARD_GREETINGS', null, CONFIG) || []
  const tags = greetings.slice(1)
  const socials = [
    { href: siteConfig('CONTACT_GITHUB'), icon: 'fab fa-github', name: 'GitHub' },
    { href: siteConfig('CONTACT_BILIBILI'), icon: 'fab fa-bilibili', name: 'Bilibili' },
    { href: siteConfig('HEO_INFO_CARD_URL3', null, CONFIG), icon: 'fas fa-house', name: '主页' },
    { href: siteConfig('CONTACT_EMAIL') && `mailto:${siteConfig('CONTACT_EMAIL')}`, icon: 'fas fa-envelope', name: '邮箱' }
  ].filter(s => s.href)
  return (
    <section className='moli-banner moli-about-hero wow fadeInUp relative overflow-hidden rounded-3xl text-white text-center px-6 py-12 md:py-16'>
      <div className='moli-about-avatar mx-auto'>
        <LazyImage
          src={siteInfo?.icon}
          priority
          alt={siteConfig('AUTHOR')}
          className='w-full h-full rounded-full object-cover'
        />
      </div>
      <div className='mt-5 text-sm font-semibold tracking-widest opacity-80'>
        {greetings[0] || '你好，我是'}
      </div>
      <h1 className='mt-1 text-4xl md:text-5xl font-extrabold tracking-wide'>
        {siteConfig('AUTHOR')}
      </h1>
      {siteConfig('BIO') && (
        <p className='mt-3 text-base md:text-lg opacity-90'>{siteConfig('BIO')}</p>
      )}
      {tags.length > 0 && (
        <div className='mt-6 flex flex-wrap justify-center gap-2'>
          {tags.map(tag => (
            <span key={tag} className='moli-about-tag'>
              {tag}
            </span>
          ))}
        </div>
      )}
      {socials.length > 0 && (
        <div className='mt-6 flex justify-center gap-3'>
          {socials.map(s => (
            <a
              key={s.name}
              href={s.href}
              target='_blank'
              rel='noopener noreferrer'
              title={s.name}
              className='moli-about-social'>
              <i className={s.icon} />
            </a>
          ))}
        </div>
      )}
    </section>
  )
}

const CardTitle = ({ children }) => (
  <div className='text-sm text-[var(--heo-color-text-secondary)]'>{children}</div>
)

const StatsCard = ({ postCount, categoryOptions, tagOptions }) => {
  const createTime = siteConfig('HEO_SITE_CREATE_TIME', null, CONFIG)
  // 天数在浏览器里算，避免和服务器生成页面时的日期不一致
  const [days, setDays] = useState(null)
  useEffect(() => {
    const start = Date.parse(createTime)
    if (Number.isFinite(start)) {
      setDays(Math.max(1, Math.ceil((Date.now() - start) / 86400000)))
    }
  }, [createTime])
  const stats = [
    { name: '文章', value: postCount },
    { name: '分类', value: categoryOptions?.length },
    { name: '标签', value: tagOptions?.length },
    { name: '建站天数', value: days ?? '-' }
  ]
  return (
    <section className='moli-card wow fadeInUp p-6'>
      <CardTitle>站点数据</CardTitle>
      <div className='mt-4 grid grid-cols-2 gap-y-5'>
        {stats.map(s => (
          <div key={s.name}>
            <div className='text-3xl font-extrabold'>{s.value ?? 0}</div>
            <div className='mt-1 text-xs text-[var(--heo-color-text-secondary)]'>
              {s.name}
            </div>
          </div>
        ))}
        <div className='hidden busuanzi_container_site_pv'>
          <div className='text-3xl font-extrabold busuanzi_value_site_pv' />
          <div className='mt-1 text-xs text-[var(--heo-color-text-secondary)]'>
            访问量
          </div>
        </div>
        <div className='hidden busuanzi_container_site_uv'>
          <div className='text-3xl font-extrabold busuanzi_value_site_uv' />
          <div className='mt-1 text-xs text-[var(--heo-color-text-secondary)]'>
            访客
          </div>
        </div>
      </div>
    </section>
  )
}

const SkillsCard = () => {
  const pairs = siteConfig('HEO_GROUP_ICONS', null, CONFIG) || []
  const icons = pairs.flatMap(p => [
    { title: p.title_1, img: p.img_1, color: p.color_1 },
    { title: p.title_2, img: p.img_2, color: p.color_2 }
  ]).filter(i => i.title && i.img)
  if (icons.length === 0) return null
  return (
    <section className='moli-card wow fadeInUp p-6 lg:col-span-2'>
      <CardTitle>常用的工具和技术</CardTitle>
      <div className='mt-4 flex flex-wrap gap-3'>
        {icons.map(icon => (
          <div key={icon.title} className='moli-skill' title={icon.title}>
            <span className='moli-skill-icon' style={{ background: icon.color }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={icon.img} alt='' loading='lazy' />
            </span>
            <span className='text-sm font-semibold'>{icon.title}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

const BangumiCard = () => {
  const { user, items } = useBangumi()
  if (!user) return null
  const anime = groupBangumi(items).find(g => g.id === 2)
  const status = anime?.statuses[0]
  return (
    <SmartLink href='/bangumi' className='moli-card moli-card-hover wow fadeInUp block p-6 lg:col-span-2'>
      <div className='flex items-center justify-between'>
        <CardTitle>{status ? `最近${status.name}的番` : '追番'}</CardTitle>
        <i className='fas fa-angle-right opacity-50' />
      </div>
      <div className='mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3'>
        {(status?.items || []).slice(0, 5).map(item => (
          <div key={item.id} className='min-w-0'>
            <div className='moli-bangumi-cover'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.cover}
                alt={item.name}
                loading='lazy'
                referrerPolicy='no-referrer'
                className='w-full h-full object-cover'
              />
            </div>
            <div className='mt-2 text-xs font-semibold truncate'>{item.name}</div>
          </div>
        ))}
      </div>
    </SmartLink>
  )
}

const MORE_PAGES = [
  { href: '/equipment', icon: 'fas fa-laptop' },
  { href: '/bangumi', icon: 'fas fa-tv' },
  { href: '/music', icon: 'fas fa-music' },
  { href: '/album', icon: 'fas fa-images' },
  { href: '/essay', icon: 'fas fa-feather-pointed' },
  { href: '/links', icon: 'fas fa-link' }
]

/**
 * 其他专属页面的入口：只列出已经发布（出现在菜单数据里）的页面
 */
const MoreCard = ({ customNav, post }) => {
  const published = new Map(
    (customNav || []).map(nav => [nav.href?.replace(/\/$/, ''), nav.name])
  )
  const pages = MORE_PAGES.filter(
    p => published.has(p.href) && p.href !== `/${post?.slug}`
  )
  if (pages.length === 0) return null
  return (
    <section className='moli-card wow fadeInUp p-6'>
      <CardTitle>更多关于我</CardTitle>
      <div className='mt-3 flex flex-col'>
        {pages.map(p => (
          <SmartLink key={p.href} href={p.href} className='moli-more-link'>
            <i className={`${p.icon} w-5 text-center`} />
            <span className='font-semibold'>{published.get(p.href)}</span>
            <i className='fas fa-angle-right ml-auto opacity-40' />
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

export default AboutPage
