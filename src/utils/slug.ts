export const toSlug = (name: string): string =>
  name
    .toLowerCase()
    .replace(/š/g, 's').replace(/č/g, 'c').replace(/ć/g, 'c')
    .replace(/ž/g, 'z').replace(/đ/g, 'dj')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

export const fromSlug = (slug: string): string =>
  slug.replace(/-/g, ' ')
