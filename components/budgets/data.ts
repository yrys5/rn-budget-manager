import type { Budget, CategoryTypeOption } from './types';

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
        amount: 1240,
        icon: 'restaurant-outline',
        color: '#1D8E62',
      },
      {
        id: 'bills',
        name: 'Opłaty mieszkaniowe',
        type: 'Mieszkanie/dom',
        amount: 980,
        icon: 'home-outline',
        color: '#466B8F',
      },
      {
        id: 'fun',
        name: 'Weekend',
        type: 'Rozrywka',
        amount: 420,
        icon: 'game-controller-outline',
        color: '#D89D26',
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
        amount: 320,
        icon: 'car-outline',
        color: '#526E9E',
      },
      {
        id: 'hotel',
        name: 'Apartament',
        type: 'Mieszkanie/dom',
        amount: 330,
        icon: 'home-outline',
        color: '#466B8F',
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
        amount: 760,
        icon: 'person-outline',
        color: '#6E7681',
      },
      {
        id: 'health',
        name: 'Lekarz i apteka',
        type: 'Opieka zdrowotna',
        amount: 540,
        icon: 'medical-outline',
        color: '#C45A5A',
      },
      {
        id: 'house',
        name: 'Dom',
        type: 'Mieszkanie/dom',
        amount: 1080,
        icon: 'home-outline',
        color: '#466B8F',
      },
    ],
  },
];

export const formatCurrency = (value: number) => `${value.toLocaleString('pl-PL')} zł`;
