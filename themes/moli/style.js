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

      /* 装备页：左边分类，右边方形卡片墙；产品图是透明背景，完整放在卡片中间 */
      #theme-heo .moli-shelf {
        display: grid;
        grid-template-columns: 12rem minmax(0, 1fr);
        gap: 3rem;
        padding-top: 1.5rem;
      }
      #theme-heo .moli-shelf-side {
        position: sticky;
        top: 6rem;
        align-self: start;
        display: grid;
        gap: 1.5rem;
      }
      #theme-heo .moli-shelf-heading h1 {
        font-size: 1.75rem;
        font-weight: 800;
        line-height: 1.2;
      }
      #theme-heo .moli-shelf-heading p {
        margin-top: 0.35rem;
        font-size: 0.875rem;
        color: var(--heo-color-text-secondary);
        opacity: 0.8;
      }
      #theme-heo .moli-shelf-cats {
        display: grid;
        gap: 0.125rem;
      }
      #theme-heo .moli-shelf-cats button {
        display: flex;
        align-items: baseline;
        justify-content: space-between;
        gap: 0.75rem;
        width: 100%;
        padding: 0.5rem 0.75rem;
        border-radius: 0.625rem;
        font-size: 0.9375rem;
        color: var(--heo-color-text-secondary);
        text-align: left;
        transition: background-color 0.2s, color 0.2s;
      }
      #theme-heo .moli-shelf-cats button:hover { color: var(--heo-color-text); }
      #theme-heo .moli-shelf-cats button[aria-selected='true'] {
        background: var(--heo-color-card);
        color: var(--heo-color-text);
        font-weight: 600;
        box-shadow: 0 1px 3px rgba(44, 45, 48, 0.08);
      }
      .dark #theme-heo .moli-shelf-cats button[aria-selected='true'] {
        background: var(--heo-color-card-dark);
        box-shadow: none;
      }
      #theme-heo .moli-shelf-cat-count {
        font-size: 0.75rem;
        font-variant-numeric: tabular-nums;
        opacity: 0.6;
      }

      #theme-heo .moli-shelf-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 2rem 1.25rem;
      }
      #theme-heo .moli-shelf-card {
        display: grid;
        align-content: start;
        width: 100%;
        text-align: left;
        cursor: pointer;
      }
      #theme-heo .moli-shelf-tile {
        position: relative;
        display: block;
        aspect-ratio: 1 / 1;
        margin-bottom: 0.875rem;
        border-radius: 1.25rem;
        background: var(--heo-color-card);
        box-shadow: 0 0 0 1px rgba(44, 45, 48, 0.04), 0 6px 16px -8px rgba(44, 45, 48, 0.12);
        transition: box-shadow 0.3s, transform 0.3s;
      }
      .dark #theme-heo .moli-shelf-tile {
        background: var(--heo-color-card-dark);
        box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.06);
      }
      #theme-heo .moli-shelf-tile img {
        position: absolute;
        inset: 0;
        margin: auto;
        width: 72%;
        height: 72%;
        object-fit: contain;
        filter: drop-shadow(0 10px 12px rgba(30, 35, 60, 0.12));
        transition: transform 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
      }
      .dark #theme-heo .moli-shelf-tile img { filter: drop-shadow(0 10px 14px rgba(0, 0, 0, 0.45)); }
      #theme-heo .moli-shelf-card:hover .moli-shelf-tile {
        transform: translateY(-3px);
        box-shadow: 0 0 0 1px rgba(44, 45, 48, 0.04), 0 18px 32px -16px rgba(44, 45, 48, 0.25);
      }
      #theme-heo .moli-shelf-card:hover .moli-shelf-tile img { transform: scale(1.04); }
      #theme-heo .moli-shelf-name {
        font-size: 0.9375rem;
        font-weight: 600;
        line-height: 1.4;
      }
      #theme-heo .moli-shelf-spec {
        margin-top: 0.125rem;
        font-size: 0.8125rem;
        line-height: 1.5;
        color: var(--heo-color-text-secondary);
        opacity: 0.8;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      #theme-heo .moli-shelf-enter { animation: moli-shelf-in 0.4s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
      @keyframes moli-shelf-in {
        from { opacity: 0.2; transform: translateY(10px); }
        to { opacity: 1; transform: none; }
      }

      @media (min-width: 1280px) {
        #theme-heo .moli-shelf-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      }
      @media (max-width: 1023px) {
        #theme-heo .moli-shelf { grid-template-columns: 10rem minmax(0, 1fr); gap: 2rem; }
        #theme-heo .moli-shelf-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 767px) {
        #theme-heo .moli-shelf { grid-template-columns: minmax(0, 1fr); gap: 1.25rem; padding-top: 0.5rem; }
        #theme-heo .moli-shelf-side { position: static; gap: 1rem; }
        #theme-heo .moli-shelf-heading { display: flex; align-items: baseline; gap: 0.75rem; }
        #theme-heo .moli-shelf-heading p { margin-top: 0; }
        #theme-heo .moli-shelf-cats {
          display: flex;
          gap: 0.375rem;
          overflow-x: auto;
          scrollbar-width: none;
          margin-inline: -1.25rem;
          padding-inline: 1.25rem;
        }
        #theme-heo .moli-shelf-cats::-webkit-scrollbar { display: none; }
        #theme-heo .moli-shelf-cats button {
          width: auto;
          flex: none;
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          white-space: nowrap;
        }
        #theme-heo .moli-shelf-grid { gap: 1.5rem 0.75rem; }
        #theme-heo .moli-shelf-tile { border-radius: 1rem; margin-bottom: 0.625rem; }
      }

      /* 装备详情弹窗 */
      #theme-heo .moli-shelf-dialog {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: grid;
        place-items: center;
        padding: 1rem;
      }
      #theme-heo .moli-shelf-scrim {
        position: absolute;
        inset: 0;
        background: rgba(12, 14, 24, 0.45);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        animation: moli-fade-in 0.2s both;
      }
      #theme-heo .moli-shelf-panel {
        position: relative;
        display: grid;
        grid-template-columns: 1.1fr 1fr;
        width: min(52rem, 100%);
        max-height: 100%;
        overflow: auto;
        border-radius: 1.5rem;
        background: var(--heo-color-card);
        color: var(--heo-color-text);
        box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.5);
        animation: moli-shelf-pop 0.3s cubic-bezier(0.22, 0.61, 0.36, 1) both;
      }
      .dark #theme-heo .moli-shelf-panel { background: var(--heo-color-card-dark); }
      #theme-heo .moli-shelf-panel-media {
        position: relative;
        aspect-ratio: 1 / 1;
        background: var(--heo-color-card-muted);
      }
      .dark #theme-heo .moli-shelf-panel-media { background: #2a2a2d; }
      #theme-heo .moli-shelf-panel-media img {
        position: absolute;
        inset: 0;
        margin: auto;
        width: 74%;
        height: 74%;
        object-fit: contain;
        filter: drop-shadow(0 16px 18px rgba(30, 35, 60, 0.16));
      }
      #theme-heo .moli-shelf-panel-body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 0.875rem;
        min-width: 0;
        padding: 2.25rem 2rem;
      }
      #theme-heo .moli-shelf-panel-cat {
        font-size: 0.8125rem;
        font-weight: 600;
        color: var(--heo-color-primary);
      }
      .dark #theme-heo .moli-shelf-panel-cat { color: var(--heo-color-accent); }
      #theme-heo .moli-shelf-panel-body h2 {
        font-size: 1.75rem;
        font-weight: 800;
        line-height: 1.25;
      }
      #theme-heo .moli-shelf-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      #theme-heo .moli-shelf-chips li {
        padding: 0.25rem 0.7rem;
        border-radius: 999px;
        font-size: 0.8125rem;
        background: color-mix(in srgb, var(--heo-color-primary) 10%, transparent);
        color: var(--heo-color-primary);
      }
      .dark #theme-heo .moli-shelf-chips li {
        background: color-mix(in srgb, var(--heo-color-accent) 16%, transparent);
        color: var(--heo-color-accent);
      }
      #theme-heo .moli-shelf-desc {
        font-size: 0.9375rem;
        line-height: 1.85;
        color: var(--heo-color-text-secondary);
      }
      #theme-heo .moli-shelf-close {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;
        display: grid;
        place-items: center;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 999px;
        color: var(--heo-color-text-secondary);
        transition: background-color 0.2s;
      }
      #theme-heo .moli-shelf-close:hover { background: var(--heo-color-card-muted); }
      .dark #theme-heo .moli-shelf-close:hover { background: #2c2c2e; }
      @keyframes moli-shelf-pop {
        from { opacity: 0.4; transform: translateY(14px) scale(0.98); }
        to { opacity: 1; transform: none; }
      }
      @keyframes moli-fade-in { from { opacity: 0; } to { opacity: 1; } }
      @media (max-width: 640px) {
        #theme-heo .moli-shelf-dialog { place-items: end stretch; padding: 0; }
        #theme-heo .moli-shelf-panel {
          grid-template-columns: minmax(0, 1fr);
          width: 100%;
          max-height: 92%;
          border-radius: 1.5rem 1.5rem 0 0;
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
        #theme-heo .moli-shelf-panel-media { aspect-ratio: 4 / 3; }
        #theme-heo .moli-shelf-panel-body { padding: 1.5rem 1.25rem 2rem; }
        #theme-heo .moli-shelf-panel-body h2 { font-size: 1.5rem; }
      }
      @media (prefers-reduced-motion: reduce) {
        #theme-heo .moli-shelf-enter,
        #theme-heo .moli-shelf-panel,
        #theme-heo .moli-shelf-scrim { animation: none; }
        #theme-heo .moli-shelf-tile,
        #theme-heo .moli-shelf-tile img { transition: none; }
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


      /* —— MOLI：关于页、追番页、音乐馆 —— */
      #theme-heo .moli-tab {
        display: inline-flex;
        align-items: center;
        padding: 0.35rem 1rem;
        border-radius: 999px;
        border: 1px solid #e3e8f7;
        background: var(--heo-color-card);
        font-size: 0.875rem;
        font-weight: 600;
        transition: background-color 0.3s, color 0.3s, border-color 0.3s;
      }
      .dark #theme-heo .moli-tab { background: var(--heo-color-card-dark); border-color: #3d3d3f; }
      #theme-heo .moli-tab:hover { border-color: var(--heo-color-primary); }
      #theme-heo .moli-tab.is-active {
        background: var(--heo-color-primary);
        border-color: var(--heo-color-primary);
        color: #fff;
      }
      .dark #theme-heo .moli-tab.is-active { background: var(--heo-color-accent); border-color: var(--heo-color-accent); }
      #theme-heo .moli-tab.is-light {
        background: rgba(255, 255, 255, 0.12);
        border-color: rgba(255, 255, 255, 0.25);
        color: #fff;
      }
      #theme-heo .moli-tab.is-light.is-active { background: #fff; color: #111; }

      #theme-heo .moli-bangumi-cover {
        position: relative;
        aspect-ratio: 2 / 3;
        border-radius: 0.75rem;
        overflow: hidden;
        background: var(--heo-color-card-muted);
        box-shadow: 0 8px 16px -8px rgba(0, 0, 0, 0.3);
      }
      .dark #theme-heo .moli-bangumi-cover { background: #2c2c2e; }
      #theme-heo .moli-bangumi-card:hover .moli-bangumi-cover { box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.4); }
      #theme-heo .moli-bangumi-score {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.1rem 0.45rem;
        border-radius: 999px;
        background: rgba(0, 0, 0, 0.55);
        color: #ffd166;
        font-size: 0.75rem;
        font-weight: 700;
        backdrop-filter: blur(4px);
      }

      #theme-heo .moli-music-stage {
        position: relative;
        overflow: hidden;
        border-radius: 1.5rem;
        background: #1d1f2b;
        color: #fff;
      }
      #theme-heo .moli-music-bg {
        position: absolute;
        inset: -60px;
        background-size: cover;
        background-position: center;
        filter: blur(50px) brightness(0.5) saturate(1.3);
        transform: scale(1.1);
        transition: background-image 0.8s;
      }
      #theme-heo .moli-music-cover {
        width: 15rem;
        height: 15rem;
        border-radius: 1.25rem;
        overflow: hidden;
        background: rgba(255, 255, 255, 0.08);
        box-shadow: 0 24px 48px -16px rgba(0, 0, 0, 0.6);
      }
      #theme-heo .moli-music-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.75rem;
        height: 2.75rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.14);
        transition: background-color 0.3s, transform 0.2s;
      }
      #theme-heo .moli-music-button:hover { background: rgba(255, 255, 255, 0.28); }
      #theme-heo .moli-music-button:active { transform: scale(0.94); }
      #theme-heo .moli-music-button.is-main {
        width: 3.5rem;
        height: 3.5rem;
        background: #fff;
        color: #111;
        font-size: 1.15rem;
      }
      #theme-heo .moli-lyrics {
        position: relative;
        max-height: 26rem;
        overflow-y: auto;
        scrollbar-width: none;
        padding: 8rem 0;
        text-align: center;
        mask-image: linear-gradient(transparent, #000 25%, #000 75%, transparent);
        -webkit-mask-image: linear-gradient(transparent, #000 25%, #000 75%, transparent);
      }
      #theme-heo .moli-lyrics::-webkit-scrollbar { display: none; }
      #theme-heo .moli-lyrics p {
        margin: 0.9rem 0;
        font-size: 1.05rem;
        line-height: 1.6;
        opacity: 0.45;
        transition: opacity 0.4s, transform 0.4s;
      }
      #theme-heo .moli-lyrics p.is-active {
        opacity: 1;
        font-weight: 700;
        transform: scale(1.18);
      }
      @media (min-width: 768px) {
        #theme-heo .moli-lyrics { text-align: left; }
        #theme-heo .moli-lyrics p { transform-origin: left center; }
      }
      #theme-heo .moli-music-stage .aplayer {
        margin: 0;
        border-radius: 1rem;
        background: rgba(255, 255, 255, 0.08);
        box-shadow: none;
        color: #fff;
      }
      #theme-heo .moli-music-stage .aplayer .aplayer-pic { display: none; }
      #theme-heo .moli-music-stage .aplayer .aplayer-info { margin-left: 0; border-bottom: 0; padding-left: 14px; }
      #theme-heo .moli-music-stage .aplayer .aplayer-info .aplayer-music .aplayer-title { color: #fff; }
      #theme-heo .moli-music-stage .aplayer .aplayer-info .aplayer-music .aplayer-author { color: rgba(255, 255, 255, 0.65); }
      #theme-heo .moli-music-stage .aplayer .aplayer-lrc { display: none; }
      #theme-heo .moli-music-stage .aplayer .aplayer-list ol { scrollbar-width: thin; }
      #theme-heo .moli-music-stage .aplayer .aplayer-list ol li {
        border-top-color: rgba(255, 255, 255, 0.08);
        color: rgba(255, 255, 255, 0.85);
      }
      #theme-heo .moli-music-stage .aplayer .aplayer-list ol li:hover,
      #theme-heo .moli-music-stage .aplayer .aplayer-list ol li.aplayer-list-light { background: rgba(255, 255, 255, 0.12); }
      #theme-heo .moli-music-stage .aplayer .aplayer-list ol li .aplayer-list-author,
      #theme-heo .moli-music-stage .aplayer .aplayer-list ol li .aplayer-list-index { color: rgba(255, 255, 255, 0.5); }
      #theme-heo .moli-music-stage .aplayer .aplayer-icon path { fill: rgba(255, 255, 255, 0.8); }
      #theme-heo .moli-music-stage .aplayer .aplayer-info .aplayer-controller .aplayer-time { color: rgba(255, 255, 255, 0.7); }

      #theme-heo .moli-about-avatar {
        width: 8rem;
        height: 8rem;
        border-radius: 999px;
        padding: 4px;
        background: rgba(255, 255, 255, 0.35);
        box-shadow: 0 16px 32px -12px rgba(0, 0, 0, 0.45);
      }
      #theme-heo .moli-about-tag {
        padding: 0.3rem 0.9rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        border: 1px solid rgba(255, 255, 255, 0.25);
        font-size: 0.875rem;
        font-weight: 600;
      }
      #theme-heo .moli-about-social {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.16);
        transition: background-color 0.3s, color 0.3s, transform 0.3s;
      }
      #theme-heo .moli-about-social:hover {
        background: #fff;
        color: var(--heo-color-primary);
        transform: translateY(-2px);
      }
      #theme-heo .moli-skill {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.85rem 0.25rem 0.25rem;
        border-radius: 999px;
        background: var(--heo-color-card-muted);
      }
      .dark #theme-heo .moli-skill { background: #2c2c2e; }
      #theme-heo .moli-skill-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border-radius: 999px;
      }
      #theme-heo .moli-skill-icon img { width: 1.15rem; height: 1.15rem; }
      #theme-heo .moli-more-link {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0.25rem;
        border-bottom: 1px dashed #e3e8f7;
        transition: color 0.3s;
      }
      .dark #theme-heo .moli-more-link { border-color: #3d3d3f; }
      #theme-heo .moli-more-link:last-child { border-bottom: 0; }
      #theme-heo .moli-more-link:hover { color: var(--heo-color-primary); }
      .dark #theme-heo .moli-more-link:hover { color: var(--heo-color-accent); }

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
