'use client'

import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ArticleProps {
  title: string
  summary: string
  link: string
  image?: string
}

interface EmailDigestProps {
  logoUrl?: string
  articles: ArticleProps[]
  footerLinks: { label: string; url: string }[]
  primaryColor: string
  darkMode: boolean
  showImages: boolean
}

const BASE_WIDTH = 600
const MAX_WIDTH = 800
const MIN_WIDTH = 320

function getInlineStyles(
  darkMode: boolean,
  primaryColor: string,
): Record<string, string> {
  const isDark = darkMode ? '#1a1a2e' : '#ffffff'
  const isDarkBg = darkMode ? '#0f0f1a' : '#f8fafc'
  const textPrimary = darkMode ? '#f5f5f7' : '#1e1b43'
  const textSecondary = darkMode ? '#94a3b8' : '#64748b'
  const borderLight = darkMode ? '#2d2d44' : '#e2e8f0'
  const accent = primaryColor

  return {
    '--bg': isDarkBg,
    '--surface': darkMode ? '#1a1a2e' : '#ffffff',
    '--text-primary': textPrimary,
    '--text-secondary': textSecondary,
    '--border': borderLight,
    '--accent': accent,
    '--radius': '8px',
  }
}

function buildStyleString(
  styles: Record<string, string>,
): string {
  let result = ''
  for (const [key, value] of Object.entries(styles)) {
    if (key.startsWith('--')) {
      result += `${key}: ${value}; `
    } else {
      result += `${key}: ${value} !important; `
    }
  }
  return result.trim()
}

function createContainer(
  children: ReactNode,
  width: number = BASE_WIDTH,
): string {
  const maxWidth = Math.min(width, MAX_WIDTH)
  const minWidth = Math.max(width - 40, MIN_WIDTH)
  
  return `
    <table role="presentation" class="${width}px" style="max-width: ${maxWidth}px; min-width: ${minWidth}px; width: 100%; margin: 0 auto;">
      <tr>
        <td>${children}</td>
      </tr>
    </table>
  `
}

function createSection(
  children: ReactNode,
  padding: string = '24px',
  background: string = 'surface',
): string {
  return `
    <div style="padding: ${padding}; background-color: var(--${background});">
      ${children}
    </div>
  `
}

function createRow(
  children: ReactNode,
  paddingVertical: string = '16px',
): string {
  return `
    <tr style="padding: 0; vertical-align: top;">
      <td style="padding: ${paddingVertical};">
        ${children}
      </td>
    </tr>
  `
}

function createImage(
  src: string,
  alt: string = '',
  width: number = 120,
): string {
  return `
    <img 
      src="${src}" 
      alt="${alt}" 
      style="display: block; max-width: ${width}px; width: 100%; height: auto; border-radius: var(--radius); object-fit: cover;"
    />
  `
}

function createButton(
  children: ReactNode,
  href: string,
  padding: string = '12px 24px',
): string {
  return `
    <a 
      href="${href}" 
      style="display: inline-block; background-color: var(--accent); color: #ffffff !important; text-decoration: none; padding: ${padding}; border-radius: var(--radius); font-weight: 600; line-height: 1.25; transition: transform 0.1s ease;"
      onmouseover="this.style.transform='translateY(-2px)'"
      onmouseout="this.style.transform='translateY(0)'">
      ${children}
    </a>
  `
}

function createText(
  children: ReactNode,
  size: 'small' | 'medium' | 'large' = 'medium',
  color: string = 'primary',
): string {
  const sizes: Record<string, string> = {
    small: '12px',
    medium: '14px',
    large: '16px',
  }

  const colors: Record<string, string> = {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    muted: 'var(--text-secondary)',
  }

  return `
    <span style="font-size: ${sizes[size]}; color: var(${color}); line-height: 1.5;">
      ${children}
    </span>
  `
}

function createDivider(): string {
  return `
    <div role="separator" style="height: 1px; background-color: var(--border); margin: 24px 0;"></div>
  `
}

export default function EmailDigest({
  logoUrl,
  articles,
  footerLinks,
  primaryColor = '#7c3aed',
  darkMode = false,
  showImages = true,
}: EmailDigestProps) {
  const styles = getInlineStyles(darkMode, primaryColor)

  return createContainer(BASE_WIDTH, `
    <table role="presentation" style="${buildStyleString(styles)}">
      <tr>
        <td>
          ${createSection(
            '',
            '32px',
            'bg'
          )}
          
          <!-- Header -->
          ${logoUrl ? createImage(logoUrl, 'Syntheon Logo', 180) : ''}
          
          ${createRow('', '24px')}
          
          <div style="text-align: center;">
            <h1 style="font-size: 24px; font-weight: 700; color: var(--text-primary); margin: 0 0 8px 0; letter-spacing: -0.5px;">
              Weekly Digest
            </h1>
            <p style="font-size: 13px; color: var(--text-secondary); margin: 0;">
              Curated insights for your week ahead
            </p>
          </div>

          ${createDivider()}

          <!-- Articles -->
          ${createRow('', '24px')}
          
          <table role="presentation" style="width: 100%;">
            <tr>
              <td>
                ${articles.map((article, index) => {
                  const imageHtml = showImages ? createImage(article.image!, article.title) : ''
                  
                  return `
                    <div 
                      role="listitem" 
                      style="padding: 20px; border-bottom: 1px solid var(--border); transition: background-color 0.15s ease;"
                      onmouseover="this.style.backgroundColor='var(--surface)'"
                      onmouseout="this.style.backgroundColor=''">
                      
                      ${imageHtml}

                      <h3 style="font-size: 16px; font-weight: 600; color: var(--text-primary); margin: 0 0 8px 0;">
                        ${article.title}
                      </h3>

                      <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6; margin: 0 0 12px 0;">
                        ${article.summary}
                      </p>

                      <a 
                        href="${article.link}" 
                        style="display: inline-flex; align-items: center; gap: 4px; font-size: 13px; color: var(--accent); text-decoration: none; font-weight: 500;"
                        onmouseover="this.style.color='var(--text-primary)'"
                        onmouseout="this.style.color='var(--accent)'">
                        Read more &rarr;
                      </a>

                    </div>
                  `
                }).join('')}
              </td>
            </tr>
          </table>

          ${createDivider()}

          <!-- Footer -->
          ${createRow('', '32px')}
          
          <div style="text-align: center; padding-bottom: 24px;">
            ${footerLinks.map(link => 
              createButton(link.label, link.url)
            ).join('')}
          </div>

          <p style="font-size: 12px; color: var(--text-secondary); margin: 0 0 8px 0;">
            &copy; ${new Date().getFullYear()} Syntheon. All rights reserved.
          </p>

          <p style="font-size: 12px; color: var(--text-secondary); margin: 0;">
            <a href="${footerLinks[0]?.url || '#'}" style="color: var(--accent); text-decoration: none;" onmouseover="this.style.textDecoration='underline'">Unsubscribe</a> | 
            <a href="${footerLinks[1]?.url || '#'}" style="color: var(--accent); text-decoration: none;" onmouseover="this.style.textDecoration='underline'">View in browser</a>
          </p>

        </td>
      </tr>
    </table>
  `)
}
