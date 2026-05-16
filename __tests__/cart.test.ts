import { describe, it, expect } from 'vitest'

function calculateTotal(items: { price: number; quantity: number }[]): number {
  return parseFloat(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2))
}

function applyDiscount(total: number, discountPct: number): number {
  return parseFloat((total * (1 - discountPct / 100)).toFixed(2))
}

function validateCoupon(coupon: { is_active: boolean; valid_to: string; used_count: number; usage_limit: number }): boolean {
  return coupon.is_active && new Date(coupon.valid_to) > new Date() && coupon.used_count < coupon.usage_limit
}

function getItemSubtotal(price: number, quantity: number): number {
  return parseFloat((price * quantity).toFixed(2))
}

describe('Cart Module — JD TechStores', () => {
  it('should calculate total correctly for multiple items', () => {
    const items = [{ price: 89999.99, quantity: 1 }, { price: 2500.00, quantity: 2 }]
    expect(calculateTotal(items)).toBe(94999.99)
  })

  it('should return zero total for empty cart', () => {
    expect(calculateTotal([])).toBe(0)
  })

  it('should apply 10% discount correctly', () => {
    expect(applyDiscount(100000, 10)).toBe(90000)
  })

  it('should reject an expired coupon', () => {
    const coupon = { is_active: true, valid_to: '2024-01-01T00:00:00Z', used_count: 0, usage_limit: 100 }
    expect(validateCoupon(coupon)).toBe(false)
  })
})