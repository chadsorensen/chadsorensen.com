export const sections = ['work', 'about', 'contact'] as const

export type SectionId = (typeof sections)[number]
