import sage from '@/assets/img/sage.jpg'
import roundhouse from '@/assets/img/roundhouse.jpg'
import crosby from '@/assets/img/crosby.jpg'
import teton from '@/assets/img/teton.jpg'
import hydro from '@/assets/img/hydro.jpg'
import redington from '@/assets/img/redington.jpg'
import rio from '@/assets/img/rio.jpg'
import fishpeople from '@/assets/img/fishpeople.jpg'
import runbase from '@/assets/img/runbase.jpg'
import frestcoast from '@/assets/img/frestcoast.jpg'
import rhconstruction from '@/assets/img/rhconstruction.jpg'
import westerntitle from '@/assets/img/westerntitle.jpg'

export interface Work {
  title: string
  url: string
  /** Resolved image URL (import it from src/assets/img) */
  image: string
  skills: string[]
}

export const works: Work[] = [
  {
    title: 'Sage Fly Fishing',
    url: 'https://www.sageflyfish.com/',
    image: sage,
    skills: ['Twig', 'Backbone', 'Ecomm', 'Responsive'],
  },
  {
    title: 'Roundhouse',
    url: 'https://roundhouseagency.com/',
    image: roundhouse,
    skills: ['Craft CMS', 'Responsive'],
  },
  {
    title: 'Crosby Hop Farm',
    url: 'https://crosbyhops.com/',
    image: crosby,
    skills: ['Craft CMS', 'JavaScript', 'Ecomm'],
  },
  {
    title: 'Teton Gravity',
    url: 'https://www.tetongravity.com/',
    image: teton,
    skills: ['ExpressionEngine', 'Responsive'],
  },
  {
    title: 'Hydro Flask',
    url: 'https://www.hydroflask.com/',
    image: hydro,
    skills: ['Magento', 'Ecomm', 'Mobile First'],
  },
  {
    title: 'Redington',
    url: 'https://www.redington.com/',
    image: redington,
    skills: ['Twig', 'Backbone', 'Ecomm', 'Responsive'],
  },
  {
    title: 'Rio Fly Fishing',
    url: 'https://www.rioproducts.com/',
    image: rio,
    skills: ['Twig', 'Backbone', 'Ecomm', 'Responsive'],
  },
  {
    title: 'Fishpeople',
    url: 'https://www.fishpeopleseafood.com/',
    image: fishpeople,
    skills: ['Shopify', 'Ecomm', 'Responsive'],
  },
  {
    title: 'Adidas Runbase',
    url: 'http://bostonrunbase.com/',
    image: runbase,
    skills: ['Craft CMS', 'Eventbrite', 'Responsive'],
  },
  {
    title: 'Frest Coast',
    url: 'http://frestcoast.com/',
    image: frestcoast,
    skills: ['Squarespace', 'Ecomm', 'Responsive'],
  },
  {
    title: 'RH Construction',
    url: 'http://rhconst.com/',
    image: rhconstruction,
    skills: ['WordPress', 'Plugins', 'Responsive'],
  },
  {
    title: 'Western Title',
    url: 'https://westerntitle.com/',
    image: westerntitle,
    skills: ['Drupal', 'Responsive'],
  },
]
