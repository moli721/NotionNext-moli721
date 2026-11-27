import AlbumPage from './AlbumPage'
import EquipmentPage from './EquipmentPage'
import EssayPage from './EssayPage'
import LinksPage from './LinksPage'

/**
 * 专属页面：文章库里 type=Page 的页面，slug 是下面这几个时，用专门的版式显示页面里的数据库
 */
const SPECIAL_PAGES = {
  equipment: EquipmentPage,
  essay: EssayPage,
  links: LinksPage,
  album: AlbumPage
}

export const ESSAY_SLUG = 'essay'

export const getSpecialPage = post => {
  if (!post || post.type !== 'Page') return null
  const slug = post.slug?.split('/').pop()
  return SPECIAL_PAGES[slug] || null
}
