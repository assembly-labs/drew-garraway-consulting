import { render, screen } from '@testing-library/react'
import LandingPage from '../page'

// Mock the useAuth hook
jest.mock('@/lib/auth-context', () => ({
  useAuth: () => ({
    user: null
  })
}))

describe('Landing Page', () => {
  it('renders the main heading', () => {
    render(<LandingPage />)

    expect(screen.getByText('Championship')).toBeInTheDocument()
    expect(screen.getByText('Athletic')).toBeInTheDocument()
    expect(screen.getByText('Prospects')).toBeInTheDocument()
  })

  it('renders the tagline', () => {
    render(<LandingPage />)

    expect(screen.getByText(/Turn phone photos into professional trading cards/)).toBeInTheDocument()
  })

  it('renders sign up and sign in buttons when not authenticated', () => {
    render(<LandingPage />)

    expect(screen.getByText('Create Your First Card')).toBeInTheDocument()
    // There are multiple Sign In buttons on the page
    const signInButtons = screen.getAllByText('Sign In')
    expect(signInButtons.length).toBeGreaterThan(0)
  })
})