import axios from 'axios'
import { vi } from 'vitest'
import { mockProducts, mockUsers, mockOrders, mockRefunds, mockCart } from './data'

// Mock das respostas da API
vi.mocked(axios.get).mockImplementation((url) => {
  if (url.includes('/products')) {
    return Promise.resolve({ data: mockProducts })
  }
  if (url.includes('/users')) {
    return Promise.resolve({ data: mockUsers })
  }
  if (url.includes('/orders')) {
    return Promise.resolve({ data: mockOrders })
  }
  if (url.includes('/refunds')) {
    return Promise.resolve({ data: mockRefunds })
  }
  if (url.includes('/cart')) {
    return Promise.resolve({ data: mockCart })
  }
  if (url.includes('/artists')) {
    return Promise.resolve({ data: mockUsers.filter(user => user.role === 'artist') })
  }
  return Promise.resolve({ data: [] })
})

vi.mocked(axios.post).mockImplementation((url, data) => {
  if (url.includes('/register')) {
    const registerData = data as any
    return Promise.resolve({ 
      data: { 
        success: true, 
        user: { 
          id: 999, 
          name: registerData.firstName + ' ' + registerData.lastName,
          email: registerData.email 
        } 
      } 
    })
  }
  if (url.includes('/login')) {
    return Promise.resolve({ 
      data: { 
        success: true, 
        token: 'mock-token-123',
        user: mockUsers[0]
      } 
    })
  }
  if (url.includes('/cart/add')) {
    return Promise.resolve({ data: { success: true } })
  }
  if (url.includes('/orders')) {
    return Promise.resolve({ 
      data: { 
        success: true, 
        orderId: 999 
      } 
    })
  }
  if (url.includes('/refunds')) {
    return Promise.resolve({ 
      data: { 
        success: true, 
        refundId: 999 
      } 
    })
  }
  return Promise.resolve({ data: { success: true } })
})

vi.mocked(axios.put).mockImplementation((url, data) => {
  if (url.includes('/users')) {
    const userData = data as any
    return Promise.resolve({ 
      data: { 
        success: true, 
        user: { ...mockUsers[0], ...userData }
      } 
    })
  }
  if (url.includes('/orders')) {
    return Promise.resolve({ data: { success: true } })
  }
  if (url.includes('/refunds')) {
    return Promise.resolve({ data: { success: true } })
  }
  return Promise.resolve({ data: { success: true } })
})

vi.mocked(axios.delete).mockImplementation((url) => {
  if (url.includes('/cart')) {
    return Promise.resolve({ data: { success: true } })
  }
  if (url.includes('/orders')) {
    return Promise.resolve({ data: { success: true } })
  }
  if (url.includes('/users')) {
    return Promise.resolve({ data: { success: true } })
  }
  return Promise.resolve({ data: { success: true } })
}) 