import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import { LanguageProvider } from '../i18n/LanguageContext';
import BookingForm from '../components/BookingForm';

const renderForm = () =>
  render(
    <MemoryRouter initialEntries={['/en']}>
      <Routes>
        <Route path="/:lang" element={<LanguageProvider><BookingForm /></LanguageProvider>} />
      </Routes>
    </MemoryRouter>
  );

describe('BookingForm', () => {
  it('requires name, email, and date before it can submit', () => {
    renderForm();
    const submit = screen.getByRole('button', { name: /request consultation/i });
    fireEvent.click(submit);
    expect(screen.getByLabelText(/full name/i)).toBeRequired();
    expect(screen.getByLabelText(/email address/i)).toBeRequired();
    expect(screen.getByLabelText(/preferred date/i)).toBeRequired();
  });

  it('shows a success message after a valid submission (mock API)', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByLabelText(/preferred date/i), { target: { value: '2026-09-01' } });
    fireEvent.click(screen.getByRole('button', { name: /request consultation/i }));

    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument(), { timeout: 2000 });
    expect(screen.getByText(/jane@example.com/)).toBeInTheDocument();
  });
});
