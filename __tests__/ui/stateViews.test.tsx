import { render } from '@testing-library/react-native';

import { EmptyState, ErrorState, LoadingState } from '@/shared/ui';

describe('state UI components', () => {
  it('renders empty, error, and loading states', () => {
    const empty = render(<EmptyState title="Brak danych" message="Dodaj pierwszy element." />);
    expect(empty.toJSON()).toMatchSnapshot();

    const error = render(<ErrorState title="Błąd" message="Nie udało się pobrać danych." />);
    expect(error.getByText('Błąd')).toBeTruthy();

    const loading = render(<LoadingState title="Ładowanie" />);
    expect(loading.getByText('Ładowanie')).toBeTruthy();
  });
});
