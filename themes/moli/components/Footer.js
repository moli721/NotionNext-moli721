import { BeiAnGongAn } from '@/components/BeiAnGongAn'
import CopyRightDate from '@/components/CopyRightDate'
import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useEffect, useState } from 'react'
import CONFIG from '../config'

/**
 * 页脚：头像居中的社交按钮、建站时长、按顶部菜单分组的链接、技术徽章，最下面是版权和访问量
 * 链接分组直接用 Notion 里的自定义菜单（有子菜单的那几组），菜单改了页脚跟着变
 */
const Footer = ({ siteInfo, customMenu }) => {
  const BEI_AN = siteConfig('BEI_AN')
  const BEI_AN_LINK = siteConfig('BEI_AN_LINK')
  const BIO = siteConfig('BIO')
  const author = siteConfig('AUTHOR')
  const reserveMusicPlayerSpace =
    siteConfig('MUSIC_PLAYER') && siteConfig('MUSIC_PLAYER_VISIBLE')

  const left = [
    siteConfig('ENABLE_RSS') && { href: '/rss/feed.xml', icon: 'fas fa-rss', name: 'RSS 订阅' },
    siteConfig('CONTACT_GITHUB') && { href: siteConfig('CONTACT_GITHUB'), icon: 'fab fa-github', name: 'GitHub' }
  ].filter(Boolean)
  const right = [
    siteConfig('CONTACT_BILIBILI') && { href: siteConfig('CONTACT_BILIBILI'), icon: 'fab fa-bilibili', name: 'Bilibili' },
    siteConfig('HEO_INFO_CARD_URL3', null, CONFIG) && {
      href: siteConfig('HEO_INFO_CARD_URL3', null, CONFIG),
      icon: 'fas fa-house',
      name: '个人主页'
    },
    siteConfig('CONTACT_EMAIL') && { href: `mailto:${siteConfig('CONTACT_EMAIL')}`, icon: 'fas fa-envelope', name: '邮箱' }
  ].filter(Boolean)

  const groups = siteConfig('CUSTOM_MENU')
    ? (customMenu || []).filter(m => m?.show !== false && m?.subMenus?.length > 0)
    : []

  return (
    <footer className='relative flex-shrink-0 bg-[var(--heo-color-card)] dark:bg-[var(--heo-color-bg-dark)] justify-center text-center m-auto w-full leading-6  text-gray-600 dark:text-gray-100 text-sm'>
      {/* 颜色过度区 */}
      <div
        id='color-transition'
        className='h-32 bg-gradient-to-b from-[var(--heo-color-bg)] to-[var(--heo-color-card)] dark:bg-[var(--heo-color-bg-dark)] dark:from-inherit dark:to-inherit'
      />

      <div className='moli-footer'>
        <div className='moli-footer-social'>
          {left.map(link => (
            <SocialLink key={link.name} link={link} />
          ))}
          <button
            type='button'
            className='moli-footer-avatar'
            title='回到顶部'
            aria-label='回到顶部'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {siteInfo?.icon && <LazyImage src={siteInfo.icon} alt={author} width={60} height={60} />}
          </button>
          {right.map(link => (
            <SocialLink key={link.name} link={link} />
          ))}
        </div>

        <Runtime />

        {groups.length > 0 && (
          <nav className='moli-footer-groups' aria-label='页脚导航'>
            {groups.map(group => (
              <div key={group.name} className='moli-footer-group'>
                <div className='moli-footer-group-title'>{group.name}</div>
                {group.subMenus.map(item => (
                  <SmartLink key={item.title + item.href} href={item.href} target={item.target}>
                    {item.title}
                  </SmartLink>
                ))}
              </div>
            ))}
          </nav>
        )}

        <div className='moli-footer-badges'>
          <Badge label='框架' value='NotionNext' href='https://github.com/notionnext-org/NotionNext' />
          <Badge label='内容' value='Notion' href='https://www.notion.so' />
          <Badge label='托管' value='Vercel' href='https://vercel.com' />
        </div>
      </div>

      {/* 底部页面信息 */}
      <div
        id='footer-bottom'
        className={`w-full min-h-16 flex flex-col gap-1 p-3 lg:flex-row justify-between px-6 items-center bg-[#f1f3f7] dark:bg-[#21232A] border-t dark:border-t-[#3D3D3F] ${
          reserveMusicPlayerSpace ? 'pb-20' : ''
        }`}>
        <div id='footer-bottom-left' className='flex flex-wrap justify-center lg:justify-start items-center gap-x-1'>
          <CopyRightDate />
          <span>By</span>
          <SmartLink href='/about' className='font-semibold dark:text-gray-300'>
            {author}
          </SmartLink>
          {BIO && <span className='ml-2 opacity-70'>{BIO}</span>}
        </div>

        <div id='footer-bottom-right'>
          {BEI_AN && (
            <>
              <i className='fas fa-shield-alt' />{' '}
              <a href={BEI_AN_LINK} className='mr-2'>
                {siteConfig('BEI_AN')}
              </a>
            </>
          )}
          <BeiAnGongAn />

          <span className='hidden busuanzi_container_site_pv'>
            <i className='fas fa-eye' />
            <span className='px-1 busuanzi_value_site_pv'> </span>{' '}
          </span>
          <span className='pl-2 hidden busuanzi_container_site_uv'>
            <i className='fas fa-users' />{' '}
            <span className='px-1 busuanzi_value_site_uv'> </span>{' '}
          </span>
        </div>
      </div>
    </footer>
  )
}

const SocialLink = ({ link }) => (
  <SmartLink href={link.href} title={link.name} aria-label={link.name} className='moli-footer-icon'>
    <i className={link.icon} />
  </SmartLink>
)

const Badge = ({ label, value, href }) => (
  <a href={href} target='_blank' rel='noopener noreferrer' className='moli-footer-badge'>
    <span>{label}</span>
    <span>{value}</span>
  </a>
)

/**
 * 建站时长：从 HEO_SITE_CREATE_TIME 算起，每秒更新；页面加载完才开始显示，避免服务器和浏览器算出来不一样
 */
const Runtime = () => {
  const start = Date.parse(siteConfig('HEO_SITE_CREATE_TIME', null, CONFIG))
  const [now, setNow] = useState(null)
  useEffect(() => {
    setNow(Date.now())
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  if (!Number.isFinite(start)) return null
  const diff = Math.max(0, (now || start) - start)
  const sec = Math.floor(diff / 1000)
  const parts = [
    [Math.floor(sec / 86400), '天'],
    [Math.floor(sec / 3600) % 24, '小时'],
    [Math.floor(sec / 60) % 60, '分'],
    [sec % 60, '秒']
  ]
  return (
    <p className='moli-footer-runtime' style={{ visibility: now ? 'visible' : 'hidden' }}>
      本站已经运行了
      {parts.map(([n, unit]) => (
        <span key={unit}>
          <b>{n}</b>
          {unit}
        </span>
      ))}
      <i className='fas fa-heart-pulse' aria-hidden='true' />
    </p>
  )
}

export default Footer
