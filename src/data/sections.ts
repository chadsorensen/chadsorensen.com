export const sections = ['hello', 'work', 'about', 'contact'] as const

export type SectionId = (typeof sections)[number]
