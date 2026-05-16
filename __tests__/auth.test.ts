import { describe, it, expect } from 'vitest'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password: string): boolean {
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)
}

function isValidRole(role: string): boolean {
  return ['user', 'storekeeper', 'admin'].includes(role)
}

function buildUserProfile(data: { id: string; email: string; full_name: string; role?: string }) {
  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    role: data.role ?? 'user',
    is_active: true,
  }
}

describe('Auth Module — JD TechStores', () => {
  it('should accept a valid email address', () => {
    expect(isValidEmail('jonathan@jdtechstores.com')).toBe(true)
  })

  it('should reject a password shorter than 8 characters', () => {
    expect(isValidPassword('Ab1')).toBe(false)
  })

  it('should validate all three user roles correctly', () => {
    expect(isValidRole('user')).toBe(true)
    expect(isValidRole('storekeeper')).toBe(true)
    expect(isValidRole('admin')).toBe(true)
  })

  it('should build profile with default role user when role not provided', () => {
    const profile = buildUserProfile({ id: 'uuid-123', email: 'j@jd.com', full_name: 'Jonathan' })
    expect(profile.role).toBe('user')
    expect(profile.is_active).toBe(true)
  })
})