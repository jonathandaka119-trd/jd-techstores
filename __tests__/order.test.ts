import { describe, it, expect } from 'vitest'

type OrderStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING:    ['PAID', 'CANCELLED'],
  PAID:       ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED'],
  SHIPPED:    ['DELIVERED'],
  DELIVERED:  [],
  CANCELLED:  [],
}

function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to)
}

function generateOrderNumber(seq: number): string {
  const year = new Date().getFullYear()
  return `JD-${year}-${String(seq).padStart(6, '0')}`
}

function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Ожидает оплаты', PAID: 'Оплачен', PROCESSING: 'В обработке',
    SHIPPED: 'Отправлен', DELIVERED: 'Доставлен', CANCELLED: 'Отменён',
  }
  return labels[status]
}

describe('Order Module — JD TechStores', () => {
  it('should allow PENDING → PAID transition', () => {
    expect(canTransition('PENDING', 'PAID')).toBe(true)
  })

  it('should reject DELIVERED → PENDING transition', () => {
    expect(canTransition('DELIVERED', 'PENDING')).toBe(false)
  })

  it('should generate correct order number format', () => {
    expect(generateOrderNumber(1)).toMatch(/^JD-\d{4}-000001$/)
  })
})