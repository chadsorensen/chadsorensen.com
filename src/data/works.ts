import progyny from '@/assets/img/progyny.jpg'
import dominos from '@/assets/img/dominos.jpg'
import ondiem from '@/assets/img/ondiem.jpg'
import sage from '@/assets/img/sage.jpg'
import redington from '@/assets/img/redington.jpg'
import hydro from '@/assets/img/hydro.jpg'
import rio from '@/assets/img/rio.jpg'
import teton from '@/assets/img/teton.jpg'
import crosby from '@/assets/img/crosby.jpg'
import roundhouse from '@/assets/img/roundhouse.jpg'
import westerntitle from '@/assets/img/westerntitle.jpg'
import rhconstruction from '@/assets/img/rhconstruction.jpg'
import pongpinger from '@/assets/img/pongpinger.jpg'
import rockyriver from '@/assets/img/rockyriver.jpg'
import layerssquared from '@/assets/img/layerssquared.jpg'

/** Larger engagements on private platforms — shown without outbound links. */
export interface Engagement {
  name: string
  /** Shown in the faux browser bar above the screenshot */
  domain: string
  /** Resolved image URL (import it from src/assets/img) */
  image: string
  via: string
  what: string
  summary: string
  role: string
  stack: string[]
}

export const engagements: Engagement[] = [
  {
    name: 'Progyny',
    domain: 'progyny.com',
    image: progyny,
    via: 'via DevelopmentNow',
    what: 'Fertility and family-building benefits',
    summary:
      'Embedded on the member experience team, shipping a live chat and message center across web, iOS and Android: a real-time Five9 integration over WebSockets, rolled out behind feature flags with Mixpanel instrumentation.',
    role: 'Senior Frontend Engineer · 2024–2026',
    stack: ['React', 'React Native', 'Flutter', 'NestJS', 'WebSockets', 'Auth0', 'Playwright'],
  },
  {
    name: 'Domino’s',
    domain: 'dominos.com',
    image: dominos,
    via: 'at Bounteous',
    what: 'Flagship ordering app',
    summary:
      'At Bounteous, a global digital agency, owned technical delivery of a nationwide campaign built into Domino’s flagship app, coordinating internal teams and third-party vendors to a fixed launch date.',
    role: 'Senior Frontend Engineer · 2021–2022',
    stack: ['React', 'TypeScript', 'Localization', 'Vendor coordination'],
  },
  {
    name: 'OnDiem',
    domain: 'ondiem.com',
    image: ondiem,
    via: 'Contract → Full-time',
    what: 'Dental staffing marketplace',
    summary:
      'Architected and built the company’s entire frontend from the ground up in Vue and TypeScript, then owned it through a national launch and growth to 200k+ customers across several funding rounds.',
    role: 'Senior Frontend Engineer · 2017–2020',
    stack: ['Vue 2', 'TypeScript', 'Vuex', 'Jest', 'REST API'],
  },
]

export interface Work {
  title: string
  url: string
  /** Resolved image URL (import it from src/assets/img) */
  image: string
  /** Only shown for independent projects */
  stack?: string[]
}

/** Client work for brands and agencies, biggest names first. */
export const clientWork: Work[] = [
  { title: 'Sage Fly Fishing', url: 'https://www.sageflyfish.com/', image: sage },
  { title: 'Redington', url: 'https://www.redington.com/', image: redington },
  { title: 'Hydro Flask', url: 'https://www.hydroflask.com/', image: hydro },
  { title: 'Rio Products', url: 'https://www.rioproducts.com/', image: rio },
  { title: 'Teton Gravity', url: 'https://www.tetongravity.com/', image: teton },
  { title: 'Crosby Hop Farm', url: 'https://crosbyhops.com/', image: crosby },
  { title: 'Roundhouse', url: 'https://roundhouseagency.com/', image: roundhouse },
  { title: 'Western Title', url: 'https://westerntitle.com/', image: westerntitle },
  { title: 'RH Construction', url: 'http://rhconst.com/', image: rhconstruction },
]

/** Pro-bono and personal builds on a modern stack. */
export const sideProjects: Work[] = [
  {
    title: 'PongPinger',
    url: 'https://pongpinger.com/',
    image: pongpinger,
    stack: ['React', 'Supabase', 'Leaflet', 'Tailwind'],
  },
  {
    title: 'Rocky River Irrigation',
    url: 'https://rockyriverirrigation.com/',
    image: rockyriver,
    stack: ['Next.js', 'TypeScript', 'Tailwind'],
  },
  {
    title: 'Layers Squared',
    url: 'https://layerssquared.com/',
    image: layerssquared,
    stack: ['Shopify', 'Liquid', 'Ecomm'],
  },
]
