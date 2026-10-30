import clsx from 'clsx';
import { Lang } from '@/types';
import { resolveMapEmbedUrl, yandexMapsExternalUrl } from '@/lib/map';

interface MapEmbedProps {
  src?: string | null;
  label?: string;
  lang: Lang;
  className?: string;
  heightClass?: string;
}

export default function MapEmbed({
  src,
  label,
  lang,
  className,
  heightClass = 'h-[400px] sm:h-[450px] lg:h-[500px]',
}: MapEmbedProps) {
  const embedSrc = resolveMapEmbedUrl(src);
  const mapTitle = label || (lang === 'uz' ? 'Klinika xaritasi' : 'Карта клиники');

  return (
    <div className={clsx('flex flex-col gap-2 min-w-0', className)}>
      <div
        className={clsx(
          'bg-white rounded-2xl overflow-hidden border border-gray-100 w-full',
          heightClass,
        )}
      >
        <iframe
          title={mapTitle}
          src={embedSrc}
          className="block w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={yandexMapsExternalUrl(lang)}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:text-blue-700 hover:underline self-start"
      >
        {lang === 'uz' ? 'Xaritada ochish' : 'Открыть на карте'}
      </a>
    </div>
  );
}
