import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export type CategoryType =
  | 'Jedzenie'
  | 'Mieszkanie/dom'
  | 'Transport'
  | 'Telekomunikacja'
  | 'Opieka zdrowotna'
  | 'Ubranie'
  | 'Higiena'
  | 'Osobiste wydatki'
  | 'Rozrywka'
  | 'Budowanie oszczędności'
  | 'Inne wydatki';

export type Category = {
  id: string;
  name: string;
  type: CategoryType;
  amount: number;
  icon: IconName;
  color: string;
};

export type CategoryTypeOption = {
  label: CategoryType;
  icon: IconName;
  color: string;
};

export type CategoryScreenMode = 'create' | 'edit' | null;

export type Budget = {
  id: string;
  name: string;
  balance: number;
  spent: number;
  limit: number;
  categories: Category[];
};
