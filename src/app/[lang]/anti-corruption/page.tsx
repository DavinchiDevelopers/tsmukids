import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  Phone,
  Mail,
  Send,
  Building2,
  Lock,
  UserCheck,
  Scale,
  FileCheck2,
  HeartHandshake,
  CheckCircle2,
} from 'lucide-react';
import { Lang } from '@/types';
import { getT } from '@/i18n';
import { buildPageMetadata } from '@/lib/metadata';
import { getPageSeo } from '@/lib/seo-pages';
import PageBackButton from '@/components/ui/PageBackButton';

interface AntiCorruptionPageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: AntiCorruptionPageProps): Promise<Metadata> {
  const { lang } = await params;
  const seo = getPageSeo('anti-corruption', lang as Lang);
  return buildPageMetadata({ lang: lang as Lang, ...seo });
}

export default async function AntiCorruptionPage({ params }: AntiCorruptionPageProps) {
  const { lang: langStr } = await params;
  const lang = langStr as Lang;
  const t = getT(lang);
  const a = t.antiCorruption;

  const principleIcons = [
    HeartHandshake,
    UserCheck,
    FileCheck2,
    Scale,
    ShieldCheck,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white py-14 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <PageBackButton
            href={`/${lang}`}
            label={a.backHome}
            className="mb-6 text-blue-200 hover:text-white"
          />
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
            <ShieldAlert size={16} className="text-amber-400" />
            <span>{a.badge}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-balance max-w-4xl">
            {a.title}
          </h1>
          <p className="text-blue-200 text-sm sm:text-base max-w-3xl leading-relaxed">
            {a.lawBasis}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 sm:py-14 space-y-10 max-w-5xl">
        {/* Appeal Intro Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-sm relative">
          <div className="inline-block px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            {lang === 'ru' ? 'Обращение руководителя' : 'Rahbar murojaatnomasi'}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 leading-snug">
            {a.greeting}
          </h2>
          <div className="space-y-4 text-gray-700 leading-relaxed sm:text-lg">
            <p className="indent-4 sm:indent-6">{a.intro1}</p>
            <p className="indent-4 sm:indent-6">{a.intro2}</p>
          </div>
        </div>

        {/* 5 Principles Grid */}
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {a.principlesTitle}
            </h2>
          </div>
          <div className="grid gap-4 sm:gap-6">
            {a.principles.map((item, idx) => {
              const Icon = principleIcons[idx] || ShieldCheck;
              return (
                <div
                  key={item.number}
                  className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all flex flex-col sm:flex-row gap-5 items-start"
                >
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:justify-center shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                      <Icon size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-400 font-mono">
                      {item.number}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Colleagues & Citizens Appeals */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50/40 rounded-3xl p-6 sm:p-8 border border-blue-100 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                <HeartHandshake size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {lang === 'ru' ? 'Обращение к коллегам' : 'Hamkasblarga murojaat'}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {a.appealColleagues}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/40 rounded-3xl p-6 sm:p-8 border border-amber-200 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-4">
                <Lock size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                {lang === 'ru' ? 'Обращение к гражданам' : 'Fuqarolarga murojaat'}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {a.appealPublic}
              </p>
            </div>
          </div>
        </div>

        {/* Hotlines & Official Contacts */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Phone size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {a.hotlinesTitle}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {lang === 'ru'
                  ? 'Сообщите о любых признаках коррупции или нарушений'
                  : 'Har qanday noqonuniy holatlar bo‘yicha xabar bering'}
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Clinic hotlines */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <Building2 size={15} className="text-blue-600" />
                {a.hotlineClinic}
              </div>
              <div className="space-y-1">
                {a.hotlineClinicNumbers.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                    className="block font-bold text-gray-900 text-base sm:text-lg hover:text-blue-600 transition-colors"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            </div>

            {/* Compliance control */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 border border-blue-100 hover:border-blue-300 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-2">
                <ShieldCheck size={15} className="text-blue-600" />
                {a.complianceTitle}
              </div>
              <a
                href={`tel:${a.compliancePhone.replace(/[^+\d]/g, '')}`}
                className="block font-bold text-blue-900 text-base sm:text-lg hover:text-blue-600 transition-colors"
              >
                {a.compliancePhone}
              </a>
              <span className="text-xs text-gray-500 block mt-1">
                {lang === 'ru' ? 'Прямой контакт комплаенс-офицера' : 'Komplaens-ofitser to‘g‘ridan-to‘g‘ri aloqasi'}
              </span>
            </div>

            {/* Email */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <Mail size={15} className="text-blue-600" />
                {a.emailTitle}
              </div>
              <a
                href={`mailto:${a.email}?subject=${encodeURIComponent(
                  lang === 'ru' ? 'Обращение по вопросам противодействия коррупции' : 'Korrupsiyaga qarshi kurash bo‘yicha murojaat'
                )}`}
                className="block font-bold text-gray-900 text-sm sm:text-base hover:text-blue-600 transition-colors break-all"
              >
                {a.email}
              </a>
              <span className="text-xs text-gray-500 block mt-1">
                {lang === 'ru' ? 'Официальная электронная почта' : 'Rasmiy elektron pochta'}
              </span>
            </div>

            {/* Telegram Bot */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <Send size={15} className="text-blue-500" />
                {a.telegramTitle}
              </div>
              <div className="space-y-1">
                <a
                  href={a.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold text-blue-600 hover:underline text-base"
                >
                  {a.telegramBot}
                </a>
                <div className="text-xs text-gray-500">
                  <a
                    href="https://tsmukids.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {a.website}
                  </a>
                </div>
              </div>
            </div>

            {/* Ministry hotline */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <Building2 size={15} className="text-blue-600" />
                {a.ministryTitle}
              </div>
              <a
                href={`tel:${a.ministryPhone}`}
                className="block font-extrabold text-2xl text-gray-900 hover:text-blue-600 transition-colors"
              >
                {a.ministryPhone}
              </a>
              <span className="text-xs text-gray-500 block mt-1">
                {lang === 'ru' ? 'Круглосуточный телефон доверия' : 'Kun-u tun ishonch telefoni'}
              </span>
            </div>

            {/* Anti-Corruption Agency */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                <Scale size={15} className="text-blue-600" />
                {a.agencyTitle}
              </div>
              <a
                href={`tel:${a.agencyPhone}`}
                className="block font-extrabold text-2xl text-gray-900 hover:text-blue-600 transition-colors"
              >
                {a.agencyPhone}
              </a>
              <span className="text-xs text-gray-500 block mt-1">
                {lang === 'ru' ? 'Единый колл-центр агентства' : 'Agentlikning yagona call-markazi'}
              </span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-emerald-900 text-sm font-medium leading-relaxed">
              {a.guarantee}
            </p>
          </div>
        </div>

        {/* Signature Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
              {lang === 'ru' ? 'С уважением' : 'Hurmat bilan'}
            </p>
            <p className="text-sm sm:text-base text-gray-700 leading-snug">
              {a.signaturePost}
            </p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 mt-2">
              {a.signatureName}
            </p>
          </div>
          <div className="shrink-0 text-xs sm:text-sm font-medium text-gray-500 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
            {a.signatureYear}
          </div>
        </div>

        {/* Original Text Accordion / Card */}
        <details className="group bg-white rounded-2xl border border-gray-200 p-5 transition-all">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-blue-600 flex items-center justify-between">
            <span>{a.viewOriginal}</span>
            <span className="text-xs text-gray-400 group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-4 pt-4 border-t border-gray-100 text-xs sm:text-sm text-gray-700 leading-relaxed font-sans space-y-3 whitespace-pre-line bg-gray-50/60 p-4 rounded-xl">
            <p className="font-bold text-gray-900">
              ТОШКЕНТ ДАВЛАТ ТИББИЁТ УНИВЕРСИТЕТИНИНГ БОЛАЛАР КЎП ТАРМОҚЛИ КЛИНИКАСИ РАҲБАРИНИНГ КОРРУПЦИЯ ВА ҚОНУНБУЗАРЛИКЛАРГА НИСБАТАН «МУРОСАСИЗЛИК» СИЁСАТИ ТЎҒРИСИДАГИ МУРОЖААТНОМАСИ
            </p>
            <p className="font-semibold">
              Ҳурматли шифокорлар, тиббиёт ходимлари, беморлар, ота-оналар ва ҳамкорлар!
            </p>
            <p>
              Инсон саломатлигини асраш ва ёш авлодга сифатли тиббий ёрдам кўрсатиш энг шарафли ва масъулиятли вазифадир. Бугунги кунда мамлакатимизда очиқлик, шаффофлик ва қонун устуворлигини таъминлаш, айниқса тиббиёт соҳасида коррупциявий омилларга барҳам бериш давлат сиёсатининг устувор йўналишига айланган. Ўзбекистон Республикаси Президентининг 2022 йил 12 январдаги ПҚ-81-сон қарори ҳамда “Коррупцияга қарши курашиш тўғрисида”ги Қонун ижроси доирасида Тошкент давлат тиббиёт университетининг болалар кўп тармоқли Клиникаси тизимида коррупциянинг ҳар қандай кўринишига нисбатан «муросасиз муносабат» сиёсати қатъий жорий этилган.
            </p>
            <p>
              Клиникамиз раҳбарияти шифокорлик қасамёдига содиқлик, ҳалоллик, адолат ва бемор манфаатларини устун қўйиш тамойилларига амал қилишни олий мақсад деб билади. Шу муносабат билан мен клиника раҳбари сифатида барча тиббиёт ва хўжалик ходимлари, беморлар ҳамда контрагентларга қуйидаги қатъий позициямизни маълум қиламан:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li><strong>Тиббий хизмат кўрсатиш ва даволаш жараёнларида ҳалоллик.</strong> Клиникамизда бемор болаларни қабул қилиш, диагностика қилиш, стационар ва амбулатор даволаш, шунингдек, ордерлар (йўлланмалар) асосида имтиёзли тиббий ёрдам кўрсатиш жараёнларида тамагирлик, ноқонуний пул йиғимлари ёки сунъий навбатлар яратишга мутлақо йўл қўйилмайди. Ҳар бир пуллик ва бепул хизмат тури белгиланган тартиб ва очиқ тарифлар асосида амалга оширилади.</li>
              <li><strong>Ходимларни рағбатлантириш ва кадрлар сиёсатида адолат.</strong> Тиббиёт ходимларини ишга қабул қилиш, лавозимга тайинлаш, малака оширишга юбориш ҳамда моддий рағбатлантириш (устамалар ва мукофот пулларини тайинлаш) фақатгина ходимнинг билим даражаси, меҳнат унумдорлиги ва KPI кўрсаткичлари асосида холисона баҳоланади. Таниш-билишчилик ва манфаатлар тўқнашувига қатъий чек қўйилади.</li>
              <li><strong>Дори-дармон, тиббий жиҳозлар ва давлат харидларида шаффофлик.</strong> Клиника эҳтиёжлари учун дори воситалари, тиббий буюмлар, озиқ-овқат маҳсулотлари ва жиҳозларни харид қилиш жараёнлари қонунчиликда белгиланган электрон тендер ва танловлар орқали тўлиқ шаффоф тарзда ўтказилади. Дори-дармонларни беморларга тақсимлаш устидан қатъий назорат ўрнатилган.</li>
              <li><strong>Жавобгарликнинг муқаррарлиги.</strong> Коррупциявий ҳуқуқбузарлик содир этган ҳар қандай ходим эгаллаб турган лавозими, илмий даражаси ва иш стажидан қатъи назар, қонун олдида муқаррар жавобгарликка тортилади.</li>
              <li><strong>Хабар берувчиларни ҳимоя қилиш.</strong> Қонунбузарлик ва коррупция ҳолатлари ҳақида хабар берган беморлар, ота-оналар ва клиника ходимларининг шахси сир сақланиши ҳамда уларнинг ҳуқуқлари ҳимоя қилиниши раҳбарият томонидан тўлиқ кафолатланади.</li>
            </ol>
            <p>
              Азиз ҳамкасблар! Ҳар бир бемор боланинг соғайиб кетиши ва ота-оналарнинг розилиги бизнинг энг катта ютуғимиздир. Касбимизга садоқат билан ёндашиб, клиникамизни коррупциядан холи, намунали тиббиёт муассасасига айлантирайлик.
            </p>
            <p>
              Ҳурматли ота-оналар, беморлар ва ҳамкорлар! Агар Сиз клиникамизда даволаниш, тиббий хизматлардан фойдаланиш ёки бошқа жараёнларда тамагирлик, ноқонуний тўлов талаб қилиш ёки хизмат ваколатини суиистеъмол қилиш ҳолатларига дуч келсангиз, қуйидаги расмий алоқа каналлари орқали дарҳол хабар беришингизни сўраймиз:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Клиника ишонч телефони: +998 (90) 916-89-99, +998 (71) 260-31-16</li>
              <li>Комплаенс-назорат бўлими телефони: +998 (91) 607-89-77</li>
              <li>Электрон почта: alibek.berdiqulov@mail.ru</li>
              <li>Расмий веб-сайт ва Telegram-бот: www.Tsmukids.uz | @clinica07_bot</li>
              <li>Соғлиқни сақлаш вазирлиги ишонч телефони: 1003</li>
              <li>Коррупцияга қарши курашиш агентлиги Call-маркази: 1253</li>
            </ul>
            <p>
              Сизнинг ҳар бир мурожаатингиз махфийлик асосида тезкор ва холисона ўрганиб чиқилади. Соғлом келажакни ҳалоллик билан қурайлик!
            </p>
            <p className="pt-2 font-medium">
              Ҳурмат билан, Тошкент давлат тиббиёт университетининг болалар кўп тармоқли Клиникаси бош шифокори А.А.Джалилов (2026 йил)
            </p>
          </div>
        </details>

        <div className="pt-4 text-center">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            {a.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
