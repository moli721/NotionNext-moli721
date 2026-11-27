import AboutPage from './AboutPage'
import AlbumPage from './AlbumPage'
import BangumiPage from './BangumiPage'
import EquipmentPage from './EquipmentPage'
import EssayPage from './EssayPage'
import LinksPage from './LinksPage'
import MusicPage from './MusicPage'

/**
 * 专属页面：文章库里 type=Page 的页面，slug 是下面这几个时，用专门的版式显示
 * 装备、说说、友链、相册、音乐馆读页面里的数据库；关于页读配置和正文；追番读 Bangumi
 */
const SPECIAL_PAGES = {
  equipment: EquipmentPage,
  essay: EssayPage,
  links: LinksPage,
  album: AlbumPage,
  about: AboutPage,
  music: MusicPage,
  bangumi: BangumiPage
}

export const ESSAY_SLUG = 'essay'

export const getSpecialPage = post => {
  if (!post || post.type !== 'Page') return null
  const slug = post.slug?.split('/').pop()
  return SPECIAL_PAGES[slug] || null
}
