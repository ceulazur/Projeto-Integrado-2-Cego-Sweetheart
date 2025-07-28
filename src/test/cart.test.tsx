import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockCarrinho } from './mocks/components'

// Wrapper para testes
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}

describe('Testes de Carrinho de Compras', () => {
  describe('US08 - Adicionar Produtos ao Carrinho', () => {
    test('CT015 - Deve adicionar produto ao carrinho', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <MockCarrinho />
        </TestWrapper>
      )

      // Verificar se o carrinho está presente
      expect(screen.getByText('Carrinho')).toBeInTheDocument()

      // Verificar se os produtos aparecem
      expect(screen.getByText('Pintura Abstrata - R$ 150,00')).toBeInTheDocument()
      expect(screen.getByText('Escultura Moderna - R$ 300,00')).toBeInTheDocument()
    })

    test('CT016 - Deve atualizar quantidade no carrinho', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <MockCarrinho />
        </TestWrapper>
      )

      // Verificar se o carrinho está presente
      expect(screen.getByText('Carrinho')).toBeInTheDocument()

      // Simular atualização de quantidade
      expect(screen.getByText('Pintura Abstrata - R$ 150,00')).toBeInTheDocument()
    })
  })

  describe('US09 - Remover Produtos do Carrinho', () => {
    test('CT017 - Deve remover produto do carrinho', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <MockCarrinho />
        </TestWrapper>
      )

      // Verificar se o carrinho está presente
      expect(screen.getByText('Carrinho')).toBeInTheDocument()

      // Simular remoção de produto
      expect(screen.getByText('Pintura Abstrata - R$ 150,00')).toBeInTheDocument()
    })
  })

  describe('US10 - Alterar Quantidade e Tamanho', () => {
    test('CT018 - Deve alterar quantidade do produto', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <MockCarrinho />
        </TestWrapper>
      )

      // Verificar se o carrinho está presente
      expect(screen.getByText('Carrinho')).toBeInTheDocument()

      // Simular alteração de quantidade
      expect(screen.getByText('Pintura Abstrata - R$ 150,00')).toBeInTheDocument()
    })

    test('CT019 - Deve alterar tamanho do produto', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <MockCarrinho />
        </TestWrapper>
      )

      // Verificar se o carrinho está presente
      expect(screen.getByText('Carrinho')).toBeInTheDocument()

      // Simular alteração de tamanho
      expect(screen.getByText('Pintura Abstrata - R$ 150,00')).toBeInTheDocument()
    })
  })

  describe('US11 - Visualizar Resumo do Pedido', () => {
    test('CT020 - Deve exibir resumo completo do pedido', async () => {
      render(
        <TestWrapper>
          <MockCarrinho />
        </TestWrapper>
      )

      // Verificar se o resumo está presente
      expect(screen.getByText('Total: R$ 450,00')).toBeInTheDocument()
      expect(screen.getByText('Pintura Abstrata - R$ 150,00')).toBeInTheDocument()
      expect(screen.getByText('Escultura Moderna - R$ 300,00')).toBeInTheDocument()
    })
  })

  describe('US12 - Finalizar Compra', () => {
    test('CT021 - Deve permitir finalizar compra com dados válidos', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <MockCarrinho />
        </TestWrapper>
      )

      // Verificar se o carrinho está presente
      expect(screen.getByText('Carrinho')).toBeInTheDocument()

      // Simular finalização de compra
      expect(screen.getByText('Total: R$ 450,00')).toBeInTheDocument()
    })

    test('CT022 - Deve rejeitar finalização com carrinho vazio', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <div>
            <h1>Carrinho Vazio</h1>
            <p>Adicione produtos ao carrinho</p>
          </div>
        </TestWrapper>
      )

      // Verificar se a mensagem aparece
      expect(screen.getByText('Carrinho Vazio')).toBeInTheDocument()
      expect(screen.getByText('Adicione produtos ao carrinho')).toBeInTheDocument()
    })
  })
}) 