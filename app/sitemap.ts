import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const BASE = 'https://www.alhambra-web.com'
const NOW    = '2026-05-19'
const RECENT = '2026-05-19'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Homepage ──────────────────────────────────────────────────────────
    {
      url: `${BASE}/`,
      lastModified: NOW,
      changeFrequency: 'weekly',
      priority: 1.0,
    },

    // ── Portfolio gallery ─────────────────────────────────────────────────
    {
      url: `${BASE}/project/`,
      lastModified: NOW,
      changeFrequency: 'monthly',
      priority: 0.9,
    },

    // ── Project showcase pages ────────────────────────────────────────────
    {
      url: `${BASE}/project/lumiere/`,
      lastModified: RECENT,
      changeFrequency: 'yearly',
      priority: 0.85,
    },
    {
      url: `${BASE}/project/haven/`,
      lastModified: RECENT,
      changeFrequency: 'yearly',
      priority: 0.85,
    },
    {
      url: `${BASE}/project/nexus/`,
      lastModified: RECENT,
      changeFrequency: 'yearly',
      priority: 0.85,
    },
    {
      url: `${BASE}/project/volta/`,
      lastModified: RECENT,
      changeFrequency: 'yearly',
      priority: 0.85,
    },
    {
      url: `${BASE}/project/seren/`,
      lastModified: RECENT,
      changeFrequency: 'yearly',
      priority: 0.85,
    },
    {
      url: `${BASE}/project/zenith/`,
      lastModified: RECENT,
      changeFrequency: 'yearly',
      priority: 0.85,
    },
  ]
}
