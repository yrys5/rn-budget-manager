import type { Budget, CategoryTypeOption, Currency } from './types';

export const categoryTypes: CategoryTypeOption[] = [
  { label: 'Jedzenie', icon: 'restaurant-outline', color: '#1D8E62' },
  { label: 'Mieszkanie/dom', icon: 'home-outline', color: '#466B8F' },
  { label: 'Transport', icon: 'car-outline', color: '#526E9E' },
  { label: 'Telekomunikacja', icon: 'call-outline', color: '#7B5FA3' },
  { label: 'Opieka zdrowotna', icon: 'medical-outline', color: '#C45A5A' },
  { label: 'Ubranie', icon: 'shirt-outline', color: '#A06B43' },
  { label: 'Higiena', icon: 'sparkles-outline', color: '#42827C' },
  { label: 'Osobiste wydatki', icon: 'person-outline', color: '#6E7681' },
  { label: 'Rozrywka', icon: 'game-controller-outline', color: '#D89D26' },
  { label: 'Budowanie oszczędności', icon: 'trending-up-outline', color: '#157348' },
  { label: 'Inne wydatki', icon: 'ellipsis-horizontal-circle-outline', color: '#66736E' },
];

export const initialBudgets: Budget[] = [
  {
    id: 'home',
    name: 'Domowy',
    balance: 4280,
    spent: 3120,
    limit: 7400,
    categories: [
      {
        id: 'food',
        name: 'Zakupy spożywcze',
        type: 'Jedzenie',
        icon: 'restaurant-outline',
        color: '#1D8E62',
      },
      {
        id: 'bills',
        name: 'Opłaty mieszkaniowe',
        type: 'Mieszkanie/dom',
        icon: 'home-outline',
        color: '#466B8F',
      },
      {
        id: 'fun',
        name: 'Weekend',
        type: 'Rozrywka',
        icon: 'game-controller-outline',
        color: '#D89D26',
      },
    ],
    limits: [
      {
        id: 'limit-food-may',
        limitAmount: 1700,
        periodYear: 2026,
        periodMonth: 5,
        createdAt: '2026-05-01T08:00:00.000Z',
        budgetId: 'home',
        categoryId: 'food',
        currency: 'PLN',
      },
      {
        id: 'limit-fun-may',
        limitAmount: 850,
        periodYear: 2026,
        periodMonth: 5,
        createdAt: '2026-05-01T08:10:00.000Z',
        budgetId: 'home',
        categoryId: 'fun',
        currency: 'PLN',
      },
    ],
  },
  {
    id: 'holidays',
    name: 'Wakacje',
    balance: 1850,
    spent: 650,
    limit: 2500,
    categories: [
      {
        id: 'travel',
        name: 'Dojazdy',
        type: 'Transport',
        icon: 'car-outline',
        color: '#526E9E',
      },
      {
        id: 'hotel',
        name: 'Apartament',
        type: 'Mieszkanie/dom',
        icon: 'home-outline',
        color: '#466B8F',
      },
    ],
    limits: [
      {
        id: 'limit-travel-may',
        limitAmount: 900,
        periodYear: 2026,
        periodMonth: 5,
        createdAt: '2026-05-02T09:00:00.000Z',
        budgetId: 'holidays',
        categoryId: 'travel',
        currency: 'PLN',
      },
    ],
  },
  {
    id: 'family',
    name: 'Rodzina',
    balance: 6120,
    spent: 2380,
    limit: 8500,
    categories: [
      {
        id: 'school',
        name: 'Kieszonkowe',
        type: 'Osobiste wydatki',
        icon: 'person-outline',
        color: '#6E7681',
      },
      {
        id: 'health',
        name: 'Lekarz i apteka',
        type: 'Opieka zdrowotna',
        icon: 'medical-outline',
        color: '#C45A5A',
      },
      {
        id: 'house',
        name: 'Dom',
        type: 'Mieszkanie/dom',
        icon: 'home-outline',
        color: '#466B8F',
      },
    ],
    limits: [
      {
        id: 'limit-health-may',
        limitAmount: 1000,
        periodYear: 2026,
        periodMonth: 5,
        createdAt: '2026-05-03T10:00:00.000Z',
        budgetId: 'family',
        categoryId: 'health',
        currency: 'PLN',
      },
    ],
  },
];

export const formatCurrency = (value: number) => `${value.toLocaleString('pl-PL')} zł`;

export const currencies: Currency[] = ['PLN', 'EUR', 'USD'];

export const months = [
  { value: 1, label: 'Styczeń' },
  { value: 2, label: 'Luty' },
  { value: 3, label: 'Marzec' },
  { value: 4, label: 'Kwiecień' },
  { value: 5, label: 'Maj' },
  { value: 6, label: 'Czerwiec' },
  { value: 7, label: 'Lipiec' },
  { value: 8, label: 'Sierpień' },
  { value: 9, label: 'Wrzesień' },
  { value: 10, label: 'Październik' },
  { value: 11, label: 'Listopad' },
  { value: 12, label: 'Grudzień' },
];

export const formatLimitCurrency = (value: number, currency: Currency) =>
  `${value.toLocaleString('pl-PL')} ${currency}`;

export const getMonthLabel = (month: number) =>
  months.find((monthOption) => monthOption.value === month)?.label ?? `${month}`;
