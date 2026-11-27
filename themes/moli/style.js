/* eslint-disable react/no-unknown-property */
import CONFIG from './config'
import { siteConfig } from '@/lib/config'
import { themeConsoleStyle } from '@/lib/themeConsoleStyle'
import { useEffect } from 'react'
/**
 * 此处样式只对当前主题生效
 * 此处不支持tailwindCSS的 @apply 语法
 * @returns
 */
const Style = () => {
  const bgColor = siteConfig('HEO_COLOR_BG', CONFIG.HEO_COLOR_BG, CONFIG)
  const bgDarkColor = siteConfig(
    'HEO_COLOR_BG_DARK',
    CONFIG.HEO_COLOR_BG_DARK,
    CONFIG
  )

  useEffect(() => {
    const rootStyle = document.documentElement.style
    const previous = ['--heo-color-bg', '--heo-color-bg-dark'].map(name => ({
      name,
      value: rootStyle.getPropertyValue(name),
      priority: rootStyle.getPropertyPriority(name)
    }))
    // Keep previews after closing the palette, but reset them on theme changes.
    return () => {
      previous.forEach(({ name, value, priority }) => {
        if (value) rootStyle.setProperty(name, value, priority)
        else rootStyle.removeProperty(name)
      })
    }
  }, [])

  return (
    <style jsx global>{`
      #theme-heo {
        --heo-color-primary: #4f65f0;
        --heo-color-primary-hover: #4f46e5;
        --heo-color-primary-text: #ffffff;
        --heo-color-accent: #ca8a04;
        --heo-color-bg: ${bgColor};
        --heo-color-bg-dark: ${bgDarkColor};
        --heo-color-card: #ffffff;
        --heo-color-card-dark: #1e1e1e;
        --heo-color-card-muted: #f1f3f8;
        --heo-color-border: #4f46e5;
        --heo-color-border-dark: #ca8a04;
        --heo-color-text-light: #000000;
        --heo-color-text-secondary-light: #4b5563;
        --heo-color-text-dark: #f3f4f6;
        --heo-color-text-secondary-dark: #d1d5db;
        --heo-color-text: var(--heo-color-text-light);
        --heo-color-text-secondary: var(--heo-color-text-secondary-light);
        background-color: var(--heo-color-bg);
        color: var(--heo-color-text);
      }

      .dark #theme-heo {
        --heo-color-text: var(--heo-color-text-dark);
        --heo-color-text-secondary: var(--heo-color-text-secondary-dark);
        background-color: var(--heo-color-bg-dark);
      }

      html:not(.dark) #theme-heo .bg-white {
        background-color: var(--heo-color-card);
      }

      .dark #theme-heo .dark\:bg-\[\#18171d\] {
        background-color: var(--heo-color-bg-dark);
      }

      .dark #theme-heo .dark\:bg-\[\#1e1e1e\] {
        background-color: var(--heo-color-card-dark);
      }

      #theme-heo .bg-\[\#4f65f0\] {
        background-color: var(--heo-color-primary);
      }

      #theme-heo .bg-\[\#f1f3f8\] {
        background-color: var(--heo-color-card-muted);
      }

      #theme-heo .bg-indigo-600,
      #theme-heo .hover\:bg-indigo-600:hover {
        background-color: var(--heo-color-primary-hover);
      }

      .dark #theme-heo .dark\:bg-yellow-600,
      .dark #theme-heo .dark\:hover\:bg-yellow-600:hover {
        background-color: var(--heo-color-accent);
      }

      #theme-heo .text-white {
        color: var(--heo-color-primary-text);
      }

      html:not(.dark) #theme-heo .text-black {
        color: var(--heo-color-text);
      }

      html:not(.dark) #theme-heo .text-gray-600 {
        color: var(--heo-color-text-secondary);
      }

      #theme-heo .hover\:text-indigo-600:hover,
      #theme-heo .group:hover .group-hover\:text-indigo-600 {
        color: var(--heo-color-primary-hover);
      }

      #theme-heo .hover\:border-indigo-600:hover {
        border-color: var(--heo-color-border);
      }

      .dark #theme-heo .dark\:hover\:border-yellow-600:hover {
        border-color: var(--heo-color-border-dark);
      }

      .dark #theme-heo #notion-article .notion-external-block,
      #theme-heo.dark #notion-article .notion-external-block {
        background: var(--heo-color-card-dark) !important;
        border-color: var(--heo-color-border-dark) !important;
      }

      .dark #theme-heo #notion-article .notion-external-title,
      #theme-heo.dark #notion-article .notion-external-title {
        color: var(--heo-color-text-dark) !important;
      }

      .dark #theme-heo #notion-article .notion-external-subtitle,
      .dark #theme-heo #notion-article .notion-external-block-desc,
      #theme-heo.dark #notion-article .notion-external-subtitle,
      #theme-heo.dark #notion-article .notion-external-block-desc {
        color: var(--heo-color-text-secondary-dark) !important;
      }


      /* —— MOLI：专属页面（装备、说说、友链、相册）和首页说说条 —— */
      #theme-heo .moli-card {
        background: var(--heo-color-card);
        border: 1px solid #e3e8f7;
        border-radius: 1rem;
        box-shadow: 0 8px 16px -4px rgba(44, 45, 48, 0.05);
      }
      .dark #theme-heo .moli-card {
        background: var(--heo-color-card-dark);
        border-color: #3d3d3f;
      }
      #theme-heo .moli-card-hover {
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      #theme-heo .moli-card-hover:hover {
        border-color: var(--heo-color-primary);
        box-shadow: 0 8px 16px -4px color-mix(in srgb, var(--heo-color-primary) 25%, transparent);
      }
      .dark #theme-heo .moli-card-hover:hover {
        border-color: var(--heo-color-accent);
        box-shadow: none;
      }

      #theme-heo .moli-banner {
        background:
          radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.28), transparent 45%),
          radial-gradient(circle at 10% 110%, rgba(255, 255, 255, 0.18), transparent 40%),
          linear-gradient(135deg, var(--heo-color-primary), var(--heo-color-primary-hover));
      }
      .dark #theme-heo .moli-banner {
        background:
          radial-gradient(circle at 85% 15%, rgba(255, 255, 255, 0.12), transparent 45%),
          linear-gradient(
            135deg,
            color-mix(in srgb, var(--heo-color-primary) 55%, #000),
            color-mix(in srgb, var(--heo-color-primary-hover) 40%, #000)
          );
      }
      #theme-heo .moli-banner.has-cover::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(90deg, rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.1));
      }
      #theme-heo .moli-banner-images {
        gap: 1.25rem;
        padding-right: 0.5rem;
      }
      #theme-heo .moli-banner-image {
        width: 9rem;
        height: 9rem;
        border-radius: 1.5rem;
        overflow: hidden;
        background: #f4f5f7;
        box-shadow: 0 16px 30px -12px rgba(0, 0, 0, 0.4);
        transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
      }
      #theme-heo .moli-banner-image:nth-child(1) { transform: rotate(-6deg) translateY(8px); }
      #theme-heo .moli-banner-image:nth-child(2) { transform: rotate(4deg) translateY(-10px); }
      #theme-heo .moli-banner-image:nth-child(3) { transform: rotate(-3deg) translateY(6px); }
      #theme-heo .moli-banner:hover .moli-banner-image { transform: none; }
      #theme-heo .moli-banner-avatar {
        display: block;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 999px;
        border: 2px solid rgba(255, 255, 255, 0.75);
        overflow: hidden;
        transition: transform 0.2s;
      }
      #theme-heo .moli-banner-avatar:hover { transform: translateY(-2px) scale(1.1); }

      #theme-heo .moli-pill-button {
        display: inline-flex;
        align-items: center;
        padding: 0.35rem 1rem;
        border-radius: 999px;
        background: var(--heo-color-card-muted);
        font-size: 0.875rem;
        font-weight: 600;
        transition: background-color 0.3s, color 0.3s;
      }
      .dark #theme-heo .moli-pill-button { background: #2c2c2e; }
      #theme-heo .moli-pill-button:hover {
        background: var(--heo-color-primary);
        color: #fff;
      }
      .dark #theme-heo .moli-pill-button:hover { background: var(--heo-color-accent); }

      #theme-heo .moli-divider {
        border-top: 1px dashed #e3e8f7;
      }
      .dark #theme-heo .moli-divider { border-color: #3d3d3f; }
      #theme-heo .moli-notes .notion-page {
        padding-top: 0 !important;
        padding-bottom: 0 !important;
      }
      #theme-heo .moli-notes .notion-page > :first-child { margin-top: 0 !important; }

      #theme-heo .moli-photo img,
      #theme-heo .moli-essay-images img {
        border-radius: 0.75rem !important;
      }

      #theme-heo .moli-equipment-cover {
        height: 200px;
        background: #f4f5f7;
      }

      #theme-heo .moli-link-card {
        transition: background-color 0.3s, border-color 0.3s, color 0.3s, transform 0.3s;
      }
      #theme-heo .moli-link-card:hover {
        background: var(--heo-color-primary);
        border-color: var(--heo-color-primary);
        color: #fff;
        transform: translateY(-2px);
      }
      .dark #theme-heo .moli-link-card:hover {
        background: var(--heo-color-accent);
        border-color: var(--heo-color-accent);
      }
      #theme-heo .moli-link-desc {
        color: var(--heo-color-text-secondary);
        transition: color 0.3s;
      }
      #theme-heo .moli-link-card:hover .moli-link-desc { color: rgba(255, 255, 255, 0.85); }
      #theme-heo .moli-link-avatar {
        width: 3.5rem;
        height: 3.5rem;
        transition: transform 0.3s;
      }
      #theme-heo .moli-link-card:hover .moli-link-avatar { transform: scale(1.08); }

      #theme-heo .moli-album-card {
        position: relative;
        display: block;
        width: 100%;
        aspect-ratio: 4 / 3;
        border-radius: 1.25rem;
        overflow: hidden;
        background: var(--heo-color-card-muted);
        color: #fff;
      }
      #theme-heo .moli-album-card-info {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 3rem 1.25rem 1.25rem;
        background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      }

      #theme-heo .moli-essay-bar-item {
        opacity: 0;
        transform: translateY(60%);
        transition: opacity 0.5s, transform 0.5s;
      }
      #theme-heo .moli-essay-bar-item.is-prev { transform: translateY(-60%); }
      #theme-heo .moli-essay-bar-item.is-active {
        opacity: 1;
        transform: none;
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-heo .moli-essay-bar-item,
        #theme-heo .moli-banner-image { transition: none; }
      }

      body {
        background-color: var(--heo-color-bg, ${bgColor});
      }

      html.dark body {
        background-color: var(--heo-color-bg-dark, ${bgDarkColor});
      }

      // 公告栏中的字体固定白色
      #theme-heo #announcement-content .notion {
        color: white;
      }

      ::-webkit-scrollbar-thumb {
        background: rgba(60, 60, 67, 0.4);
        border-radius: 8px;
        cursor: pointer;
      }

      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      #more {
        white-space: nowrap;
      }

      .today-card-cover {
        -webkit-mask-image: linear-gradient(to top, transparent 5%, black 70%);
        mask-image: linear-gradient(to top, transparent 5%, black 70%);
      }

      .recent-top-post-group::-webkit-scrollbar {
        display: none;
      }

      .scroll-hidden::-webkit-scrollbar {
        display: none;
      }

      * {
        box-sizing: border-box;
      }

      // 标签滚动动画
      .tags-group-wrapper {
        animation: rowup 60s linear infinite;
      }

      @keyframes rowup {
        0% {
          transform: translateX(0%);
        }
        100% {
          transform: translateX(-50%);
        }
      }

      ${themeConsoleStyle('heo', CONFIG)}
  `}</style>
  )
}

export { Style }
