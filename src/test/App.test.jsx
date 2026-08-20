import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

beforeEach(() => {
  window.history.pushState({}, '', '/');
});

describe('routing + i18n', () => {
  it('redirects "/" to the default language and renders the hero heading', async () => {
    render(<App />);
    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading.textContent).toMatch(/Global Sourcing/i);
    expect(window.location.pathname).toBe('/en');
  });

  it('switches nav copy when the language selector changes', async () => {
    render(<App />);
    await screen.findByRole('heading', { level: 1 });

    const [langSelect] = screen.getAllByRole('combobox');
    fireEvent.change(langSelect, { target: { value: 'fr' } });

    expect(await screen.findByText('Accueil')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/fr');
  });

  it('renders a 404 page for an unknown path within a language', async () => {
    window.history.pushState({}, '', '/en/nonexistent-page');
    render(<App />);
    expect(await screen.findByText(/404/)).toBeInTheDocument();
  });
});
