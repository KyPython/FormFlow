import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import App from './App.jsx'
import '@testing-library/jest-dom';

// Mock fetch for form submission
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ received: { name: 'John', email: 'john@example.com' } }),
  })
)
describe('FormFlow App', () => {
  beforeEach(() => {
    fetch.mockClear()
    window.history.pushState({}, '', '/?name=John&email=john@example.com')
  })

  it('shows an alert if backend returns an error', async () => {
    // Mock fetch to reject
    global.fetch.mockImplementationOnce(() =>
      Promise.reject(new Error('Network error'))
    )
    window.alert = jest.fn()
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    await waitFor(() =>
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('error')
      )
    )
  })

  it('does not submit if fields are empty', async () => {
    window.alert = jest.fn()
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: '' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    // You may want to check for a validation message or that fetch was not called
    expect(fetch).not.toHaveBeenCalled()
  })

  // Example for a loading state (if you implement it in App.jsx)
  it('shows loading indicator while submitting', async () => {
    // Mock fetch to delay
    global.fetch.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({
        json: () => Promise.resolve({ received: { name: 'Jane', email: 'jane@example.com' } })
      }), 100))
    )
    render(<App />)
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane' } })
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /submit/i }))
    // If you add a loading indicator, check for it here:
    // expect(screen.getByText(/loading/i)).toBeInTheDocument()
    // Wait for fetch to finish
    await waitFor(() => expect(fetch).toHaveBeenCalled())
  })
  it('renders the form fields and Typeform link', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
    expect(screen.getByText(/Fill Out Our Demo Form/i)).toBeInTheDocument()
  })

  it('auto-fills form fields from URL parameters', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Name').value).toBe('John')
    expect(screen.getByPlaceholderText('Email').value).toBe('john@example.com')
  })

  it('allows user to edit the form fields', () => {
    render(<App />)
    const nameInput = screen.getByPlaceholderText('Name')
    const emailInput = screen.getByPlaceholderText('Email')
    fireEvent.change(nameInput, { target: { value: 'Jane' } })
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } })
    expect(nameInput.value).toBe('Jane')
    expect(emailInput.value).toBe('jane@example.com')
  })

  it('submits form data to backend and shows alert', async () => {
  window.alert = jest.fn()
  // Mock a successful fetch response
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ received: { name: 'Jane', email: 'jane@example.com' } }),
    })
  )
  render(<App />)
  fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Jane' } })
  fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jane@example.com' } })
  fireEvent.click(screen.getByRole('button', { name: /submit/i }))
  await waitFor(() =>
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('"name":"Jane"')
    )
  )
  expect(fetch).toHaveBeenCalledWith(
    'http://localhost:3000/submit',
    expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Jane', email: 'jane@example.com' }),
    })
  )
})

  it('Typeform link contains correct URL and params', () => {
    render(<App />)
    const link = screen.getByText(/Fill Out Our Demo Form/i)
    expect(link).toHaveAttribute('href')
    expect(link.href).toContain('typeform.com')
    expect(link.href).toContain('first_name=Jane')
    expect(link.href).toContain('email=jane@example.com')
  })
})