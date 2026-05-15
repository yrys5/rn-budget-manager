import { fireEvent, render, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import LoginScreen from '@/features/auth/screens/LoginScreen';

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: ReactNode }) => children,
  useRouter: () => ({ replace: mockReplace }),
}));

describe('login UI flow', () => {
  beforeEach(() => {
    mockReplace.mockClear();
  });

  it('shows validation errors before API login', async () => {
    const screen = render(<LoginScreen />);

    fireEvent.press(screen.getByText('Zaloguj się'));

    expect(await screen.findByText('Podaj poprawny adres email.')).toBeTruthy();
    expect(screen.getByText('Hasło jest wymagane.')).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it('logs in through the auth API adapter', async () => {
    const screen = render(<LoginScreen />);

    fireEvent.changeText(screen.getByPlaceholderText('twoj@email.com'), 'marek@example.com');
    fireEvent.changeText(screen.getByPlaceholderText('Wpisz hasło'), 'password');
    fireEvent.press(screen.getByText('Zaloguj się'));

    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/dashboard'));
  });
});
