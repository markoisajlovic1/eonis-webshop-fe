export const getAdminSection = (pathname: string): string => {
  const parts = pathname.split('/').filter(Boolean); 
  // ["admin", "products", "new"]

  const adminIndex = parts.indexOf('admin');

  if (adminIndex === -1 || adminIndex === parts.length - 1) {
    return '';
  }

  return parts[adminIndex + 1];
};