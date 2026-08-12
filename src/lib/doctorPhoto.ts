/** Public doctor photo helpers. */
export function doctorPhotoThumb(photo: string | undefined | null): string {
  if (!photo) return '';
  if (!photo.startsWith('/images/doctors/') || photo.includes('/thumbs/')) return photo;
  const file = photo.split('/').pop();
  if (!file) return photo;
  return `/images/doctors/thumbs/${file}`;
}
