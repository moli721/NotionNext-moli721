import { siteConfig } from '@/lib/config'
import { loadExternalResource } from '@/lib/utils'
import { useEffect, useMemo, useRef, useState } from 'react'
import { getPageCollection } from '../../lib/notionCollection'
import { EmptyState, PageNotes } from './Shared'

const APLAYER_CSS =
  'https://cdnjs.cloudflare.com/ajax/libs/aplayer/1.10.1/APlayer.min.css'

/**
 * 从歌单链接里认出平台和编号：网易云、QQ 音乐的歌单 / 专辑 / 单曲
 */
export const parseMusicLink = link => {
  if (!link) return null
  const netease = link.match(
    /music\.163\.com.*?(playlist|album|song|artist)\b.*?[?&]id=(\d+)/
  )
  if (netease) return { server: 'netease', type: netease[1], id: netease[2] }
  const qq = link.match(/y\.qq\.com.*?(playlist|album|songDetail)\/(\w+)/)
  if (qq) {
    const type = qq[1] === 'songDetail' ? 'song' : qq[1]
    return { server: 'tencent', type, id: qq[2] }
  }
  const qqShare = link.match(/y\.qq\.com.*?taoge\.html\?.*?id=(\d+)/)
  if (qqShare) return { server: 'tencent', type: 'playlist', id: qqShare[1] }
  return null
}

const metingUrl = ({ server, type, id }) =>
  siteConfig(
    'MUSIC_PLAYER_METING_API',
    'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r'
  )
    .replace(':server', server)
    .replace(':type', type)
    .replace(':id', id)
    .replace(':r', Math.random())

/**
 * 音乐馆：页面里的数据库每行一个歌单（名称、链接、排序），播放器只在这一页加载
 */
const MusicPage = ({ post }) => {
  const playlists = useMemo(
    () =>
      (getPageCollection(post)?.rows || [])
        .map(row => ({
          id: row.id,
          name: row.title,
          source: parseMusicLink(row.props['链接'])
        }))
        .filter(p => p.source),
    [post]
  )
  const [listId, setListId] = useState(null)
  const playlist = playlists.find(p => p.id === listId) || playlists[0]

  const playerRef = useRef(null)
  const apRef = useRef(null)
  const lyricsRef = useRef(null)
  const [song, setSong] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [lyrics, setLyrics] = useState({ lines: [], index: 0 })
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!playlist) return
    let ap = null
    let timer = null
    let alive = true
    setFailed(false)
    setSong(null)
    setLyrics({ lines: [], index: 0 })

    const start = async () => {
      loadExternalResource(APLAYER_CSS, 'css')
      await loadExternalResource(siteConfig('MUSIC_PLAYER_CDN_URL'), 'js')
      const res = await fetch(metingUrl(playlist.source))
      const list = await res.json()
      if (!alive) return
      if (!window.APlayer || !Array.isArray(list) || list.length === 0) {
        setFailed(true)
        return
      }
      // 网易云的播放地址用官方外链：公共接口的服务器在国外，拿不到国内能播的地址
      const songUrl = s => {
        const id = s.url?.match(/[?&]id=(\d+)/)?.[1]
        return playlist.source.server === 'netease' && id
          ? `https://music.163.com/song/media/outer/url?id=${id}.mp3`
          : s.url
      }
      const audio = list.map(s => ({
        name: s.title || s.name,
        artist: s.author || s.artist,
        url: songUrl(s),
        cover: s.pic || s.cover,
        lrc: s.lrc
      }))
      ap = new window.APlayer({
        container: playerRef.current,
        audio,
        lrcType: 3,
        listFolded: false,
        listMaxHeight: '320px',
        order: siteConfig('MUSIC_PLAYER_ORDER') || 'list',
        theme: '#ffffff',
        preload: 'none'
      })
      const sync = () => {
        const index = ap.list.index
        setSong(audio[index])
        setLyrics(prev => {
          const lines = ap.lrc?.current || []
          const lineIndex = ap.lrc?.index || 0
          return prev.lines === lines && prev.index === lineIndex
            ? prev
            : { lines, index: lineIndex }
        })
      }
      apRef.current = ap
      ap.on('listswitch', () => setTimeout(sync, 0))
      ap.on('timeupdate', sync)
      ap.on('play', () => setPlaying(true))
      ap.on('pause', () => setPlaying(false))
      // 歌词是播放器在后台下载的，下载完没有通知，定时同步一次
      timer = setInterval(sync, 1000)
      sync()
    }
    start().catch(() => alive && setFailed(true))

    return () => {
      alive = false
      clearInterval(timer)
      apRef.current = null
      setPlaying(false)
      ap?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlist?.id])

  // 当前歌词行滚到中间
  useEffect(() => {
    const box = lyricsRef.current
    const line = box?.querySelector('.is-active')
    if (box && line) {
      box.scrollTo({
        top: line.offsetTop - box.clientHeight / 2 + line.clientHeight / 2,
        behavior: 'smooth'
      })
    }
  }, [lyrics.index, lyrics.lines])

  if (!playlist) {
    return (
      <div id='moli-music'>
        <EmptyState text='还没有添加歌单' />
        <PageNotes post={post} />
      </div>
    )
  }

  return (
    <div id='moli-music'>
      <section className='moli-music-stage wow fadeInUp'>
        {song?.cover && (
          <div
            className='moli-music-bg'
            style={{ backgroundImage: `url("${song.cover}")` }}
          />
        )}
        <div className='relative z-10 grid gap-8 p-6 md:p-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]'>
          <div className='flex flex-col items-center md:items-start'>
            <div className='text-sm font-semibold tracking-wider opacity-80'>
              {post?.title}
            </div>
            {playlists.length > 1 ? (
              <div className='mt-3 flex flex-wrap gap-2'>
                {playlists.map(p => (
                  <button
                    key={p.id}
                    type='button'
                    onClick={() => setListId(p.id)}
                    className={`moli-tab is-light ${p.id === playlist.id ? 'is-active' : ''}`}>
                    {p.name}
                  </button>
                ))}
              </div>
            ) : (
              <h1 className='mt-2 text-2xl md:text-3xl font-extrabold'>
                {playlist.name}
              </h1>
            )}
            <div className='moli-music-cover mt-6'>
              {song?.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={song.cover} alt={song.name} className='w-full h-full object-cover' />
              )}
            </div>
            <div className='mt-5 text-center md:text-left'>
              <div className='text-xl font-bold'>{song?.name || '加载中…'}</div>
              <div className='mt-1 opacity-75'>{song?.artist}</div>
            </div>
            <div className='mt-5 flex items-center gap-4'>
              <button
                type='button'
                title='上一首'
                onClick={() => apRef.current?.skipBack()}
                className='moli-music-button'>
                <i className='fas fa-backward-step' />
              </button>
              <button
                type='button'
                title={playing ? '暂停' : '播放'}
                onClick={() => apRef.current?.toggle()}
                className='moli-music-button is-main'>
                <i className={`fas ${playing ? 'fa-pause' : 'fa-play'}`} />
              </button>
              <button
                type='button'
                title='下一首'
                onClick={() => apRef.current?.skipForward()}
                className='moli-music-button'>
                <i className='fas fa-forward-step' />
              </button>
            </div>
          </div>

          <div ref={lyricsRef} className='moli-lyrics'>
            {failed && <p className='opacity-80'>歌单暂时读不到，稍后刷新再试</p>}
            {!failed && lyrics.lines.length === 0 && (
              <p className='opacity-60'>{song ? '暂无歌词' : ''}</p>
            )}
            {lyrics.lines.map(([, text], i) => (
              <p
                key={i}
                className={i === lyrics.index ? 'is-active' : ''}>
                {text || '·'}
              </p>
            ))}
          </div>
        </div>
        <div className='relative z-10 px-3 pb-3 md:px-6 md:pb-6'>
          <div ref={playerRef} />
        </div>
      </section>

      <PageNotes post={post} />
    </div>
  )
}

export default MusicPage
