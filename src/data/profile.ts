export const email = 'chdsorensen@gmail.com'

export const links = {
  github: 'https://github.com/chadsorensen',
  linkedin: 'https://www.linkedin.com/in/chadsorensen/',
}

export interface StackGroup {
  label: string
  items: string[]
}

export const stackGroups: StackGroup[] = [
  { label: 'Languages', items: ['TypeScript', 'JavaScript', 'HTML / CSS'] },
  { label: 'Frameworks', items: ['React', 'React Native (Expo)', 'Vue', 'Next.js', 'NestJS'] },
  { label: 'Data & APIs', items: ['REST', 'WebSockets', 'PostgreSQL', 'Supabase', 'Auth0', 'Stripe'] },
  { label: 'Quality', items: ['Jest', 'Playwright', 'Storybook', 'Mixpanel'] },
]
