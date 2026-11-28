import LazyImage from '@/components/LazyImage'
import SmartLink from '@/components/SmartLink'
import { siteConfig } from '@/lib/config'
import { useState } from 'react'
import CONFIG from '../config'

export function normalizeInfoCardGreetings(value) {
  if (Array.isArray(value)) {
    return value.map(item => String(item).trim()).filter(Boolean)
  }

  if (typeof value !== 'string') {
    return []
  }

  const trimmed = value.trim()
  if (!trimmed) {
    return []
  }

  if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
    try {
      const parsed = JSON.parse(trimmed.replace(/'/g, '"'))
      return normalizeInfoCardGreetings(parsed)
    } catch {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map(item => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
    }
  }

  return [trimmed]
}

/**
 * 侧边栏资料卡：顶部一句问候（点击换一句），中间是会转的圆形头像和右下角的状态小图标，
 * 鼠标移上去头像收起、换成几句自我介绍；底部是名字、简介和社交按钮。
 * 问候和自我介绍都来自 HEO_INFOCARD_GREETINGS：第一句是问候，其余是介绍。
 */
export function InfoCard(props) {
  const { siteInfo, className } = props
  const greetings = normalizeInfoCardGreetings(
    siteConfig('HEO_INFOCARD_GREETINGS', null, CONFIG)
  )
  const intro = greetings.slice(1)
  const status = siteConfig('MOLI_INFO_CARD_STATUS', null, CONFIG)
  const author = siteConfig('AUTHOR')
  const links = [
    {
      href: siteConfig('CONTACT_GITHUB') || siteConfig('HEO_INFO_CARD_URL2', null, CONFIG),
      icon: 'fab fa-github',
      name: 'GitHub'
    },
    { href: siteConfig('CONTACT_BILIBILI'), icon: 'fab fa-bilibili', name: 'Bilibili' },
    {
      href: siteConfig('HEO_INFO_CARD_URL3', null, CONFIG),
      icon: 'fas fa-house',
      name: siteConfig('HEO_INFO_CARD_TEXT3', null, CONFIG) || '主页'
    }
  ].filter(link => link.href)

  return (
    <div className={`moli-info-card ${className || ''}`}>
      <Greeting greetings={greetings} />

      <div className='moli-info-avatar'>
        {siteInfo?.icon && (
          <LazyImage src={siteInfo.icon} alt={author} width={118} height={118} />
        )}
        {status && (
          <span className='moli-info-status' aria-hidden='true'>
            {/^(https?:|\/)/.test(status) ? <img src={status} alt='' /> : status}
          </span>
        )}
      </div>

      {intro.length > 0 && (
        <div className='moli-info-intro'>
          {intro.map(line => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}

      <div className='moli-info-bottom'>
        <SmartLink
          href={siteConfig('HEO_INFO_CARD_URL1', null, CONFIG) || '/'}
          className='moli-info-name'>
          <span>{author}</span>
          {siteConfig('BIO') && <small>{siteConfig('BIO')}</small>}
        </SmartLink>
        <div className='moli-info-links'>
          {links.map(link => (
            <SmartLink
              key={link.name}
              href={link.href}
              title={link.name}
              aria-label={link.name}>
              <i className={link.icon} />
            </SmartLink>
          ))}
        </div>
      </div>
    </div>
  )
}

/**
 * 问候语：点一下换一句
 */
function Greeting({ greetings }) {
  const [index, setIndex] = useState(0)
  if (greetings.length === 0) return null
  const next = () => setIndex(i => (i + 1) % greetings.length)
  return (
    <button type='button' className='moli-info-greeting' onClick={next}>
      {greetings[index]}
    </button>
  )
}
