import { render, screen, fireEvent } from '@testing-library/react';
import SignupForm from '../SignupForm';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

// mock the useAuth hook
vi.mock('../../../context/AuthContext', () => ({
  useAuth: vi.fn(),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    // reset mock implementation
    useAuth.mockReturnValue({
      signup: vi.fn().mockResolvedValue({}),
      loginWithGoogle: vi.fn().mockResolvedValue({}),
      loginWithGithub: vi.fn().mockResolvedValue({}),
    });
  });

  it('renders form fields and submit button', () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/At least 6 characters/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Re-enter your password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors when fields are empty and submitted', async () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    expect(await screen.findAllByText(/is required/i)).toHaveLength(2);
  });
});
