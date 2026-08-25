import CmsOrNotFound from '@/components/CmsOrNotFound';

/** Static export 404.html — также отдаётся nginx при отсутствии CMS-страниц. */
export default function NotFound() {
  return <CmsOrNotFound />;
}
