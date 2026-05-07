import { Equipment } from '@/types';

export const equipment: Equipment[] = [
  {
    id: 'mri',
    nameRu: 'МРТ 3 Тесла',
    nameUz: 'MRT 3 Tesla',
    descriptionRu: 'Магнитно-резонансный томограф последнего поколения мощностью 3 Тесла. Обеспечивает изображения высочайшего разрешения для точной диагностики патологий головного мозга, позвоночника, суставов и внутренних органов.',
    descriptionUz: '3 Tesla quvvatli so\'nggi avlod magnit-rezonans tomografi. Miya, umurtqa pog\'onasi, bo\'g\'imlar va ichki organlar patologiyalarini aniq diagnostika qilish uchun eng yuqori aniqlikdagi tasvirlarni ta\'minlaydi.',
    image: '/images/equipment/mri.jpg',
  },
  {
    id: 'ct',
    nameRu: '64-срезовый КТ',
    nameUz: '64 qismli KT',
    descriptionRu: 'Мультисрезовый компьютерный томограф с 64 детекторами. Позволяет выполнять исследования с минимальной дозой облучения и максимальной скоростью, включая КТ-ангиографию.',
    descriptionUz: '64 detektor bilan ko\'p qismli kompyuter tomografi. Minimal nurlanish dozasi va maksimal tezlik bilan tekshiruvlarni, jumladan KT-angiografiyani o\'tkazish imkonini beradi.',
    image: '/images/equipment/ct.jpg',
  },
  {
    id: 'ultrasound',
    nameRu: 'УЗИ экспертного класса',
    nameUz: 'Ekspert sinfli UZI',
    descriptionRu: 'Ультразвуковые аппараты экспертного класса с функцией 3D/4D и допплерографией. Применяется для диагностики органов брюшной полости, сердца, сосудов, щитовидной железы.',
    descriptionUz: '3D/4D funksiyasi va dopplerografiya bilan ekspert sinfli ultratovush qurilmalari. Qorin bo\'shlig\'i, yurak, qon tomir va qalqonsimon bez organlarini diagnostika qilish uchun ishlatiladi.',
    image: '/images/equipment/ultrasound.jpg',
  },
  {
    id: 'endoscopy',
    nameRu: 'Эндоскопический комплекс',
    nameUz: 'Endoskopik kompleks',
    descriptionRu: 'Современный эндоскопический комплекс для проведения ФГДС, колоноскопии, бронхоскопии. Видеоэндоскопы высокого разрешения с возможностью биопсии.',
    descriptionUz: 'FGDS, kolonoskopiya, bronxoskopiya o\'tkazish uchun zamonaviy endoskopik kompleks. Biopsiya imkoniyati bilan yuqori aniqlikdagi video-endoskoplar.',
    image: '/images/equipment/endoscopy.jpg',
  },
  {
    id: 'xray',
    nameRu: 'Цифровой рентген',
    nameUz: 'Raqamli rentgen',
    descriptionRu: 'Цифровой рентгеновский аппарат с минимальной дозой облучения и мгновенным получением результата. Полный спектр рентгенологических исследований.',
    descriptionUz: 'Minimal nurlanish dozasi va darhol natija olish imkoniyatiga ega raqamli rentgen apparati. Rentgenologik tekshiruvlarning to\'liq spektri.',
    image: '/images/equipment/xray.jpg',
  },
  {
    id: 'lab',
    nameRu: 'Лаборатория',
    nameUz: 'Laboratoriya',
    descriptionRu: 'Собственная клинико-диагностическая лаборатория с полным спектром анализов. Результаты в день обращения. Автоматические анализаторы мирового класса.',
    descriptionUz: 'Tahlillarning to\'liq spektri bilan o\'zimizning klinik-diagnostik laboratoriya. Murojaat kunida natijalar. Jahon sinfidagi avtomatik analizatorlar.',
    image: '/images/equipment/lab.jpg',
  },
];
