import { render, screen } from '@testing-library/react';
import Layout from '../components/Layout';

jest.mock('next/router', () => ({
  useRouter: () => ({ pathname: '/' }),
}));

describe('Layout', () => {
  it('renders the navigation shell and page content', () => {
    render(
      <Layout title="Dashboard">
        <div>Test content</div>
      </Layout>
    );

    expect(screen.getByRole('link', { name: /PSTourism/i })).toBeInTheDocument();
    expect(screen.getAllByText(/Dashboard/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Test content/i)).toBeInTheDocument();
  });
});
