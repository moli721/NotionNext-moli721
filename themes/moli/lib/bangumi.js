/**
 * 读取 Bangumi 番组计划（bgm.tv）上公开的收藏：动画、书籍、游戏等
 * 接口允许网页直接跨域读取，不需要密钥；同一次浏览里只请求一次
 */

export const SUBJECT_TYPES = [
  { id: 2, name: '动画', verb: '看' },
  { id: 1, name: '书籍', verb: '读' },
  { id: 4, name: '游戏', verb: '玩' },
  { id: 3, name: '音乐', verb: '听' },
  { id: 6, name: '三次元', verb: '看' }
]

// 收藏状态在 Bangumi 里的编号：1 想看 2 看过 3 在看 4 搁置 5 抛弃；按这个顺序显示
const STATUS_ORDER = [3, 2, 1, 4, 5]

export const statusName = (status, verb = '看') =>
  ({ 1: `想${verb}`, 2: `${verb}过`, 3: `在${verb}`, 4: '搁置', 5: '抛弃' })[
    status
  ]

const cache = new Map()

export const fetchBangumi = user => {
  if (!user) return Promise.resolve([])
  if (!cache.has(user)) {
    const load = async () => {
      const items = []
      for (let offset = 0; offset < 1000; offset += 100) {
        const res = await fetch(
          `https://api.bgm.tv/v0/users/${encodeURIComponent(user)}/collections?limit=100&offset=${offset}`
        )
        if (!res.ok) throw new Error(`Bangumi ${res.status}`)
        const data = await res.json()
        items.push(...(data.data || []))
        if (items.length >= data.total || !data.data?.length) break
      }
      return items.map(item => {
        const s = item.subject || {}
        return {
          id: s.id,
          name: s.name_cn || s.name,
          originalName: s.name,
          cover: s.images?.common || s.images?.medium || s.images?.large,
          date: s.date,
          score: s.score,
          eps: s.eps,
          summary: s.short_summary,
          epStatus: item.ep_status,
          rate: item.rate,
          status: item.type,
          subjectType: item.subject_type,
          updated: Date.parse(item.updated_at) || 0
        }
      })
    }
    // 失败时清掉缓存，下次打开页面再试
    cache.set(
      user,
      load().catch(err => {
        cache.delete(user)
        throw err
      })
    )
  }
  return cache.get(user)
}

/**
 * 按类别、状态分组：[{ type, statuses: [{ status, name, items }] }]
 */
export const groupBangumi = items =>
  SUBJECT_TYPES.map(type => {
    const ofType = items.filter(i => i.subjectType === type.id)
    return {
      ...type,
      count: ofType.length,
      statuses: STATUS_ORDER.map(status => ({
        status,
        name: statusName(status, type.verb),
        items: ofType
          .filter(i => i.status === status)
          .sort((a, b) => b.updated - a.updated)
      })).filter(s => s.items.length > 0)
    }
  }).filter(type => type.count > 0)
