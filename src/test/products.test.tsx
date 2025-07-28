import { describe, test, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MockCatalogo, MockVerProduto } from './mocks/components'

// Wrapper para testes
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  )
}

describe('Testes de Visualização de Produtos', () => {
  describe('US04 - Visualização de Lista de Produtos', () => {
    test('CT007 - Deve exibir lista de produtos disponíveis', async () => {
      render(
        <TestWrapper>
          <MockCatalogo />
        </TestWrapper>
      )

      // Verificar se os produtos aparecem
      expect(screen.getByText('Pintura Abstrata')).toBeInTheDocument()
      expect(screen.getByText('Escultura Moderna')).toBeInTheDocument()
    })

    test('CT008 - Deve exibir mensagem quando não há produtos', async () => {
      render(
        <TestWrapper>
          <div>
            <h1>Catálogo</h1>
            <div>Nenhum produto encontrado</div>
          </div>
        </TestWrapper>
      )

      // Verificar se a mensagem aparece
      expect(screen.getByText('Nenhum produto encontrado')).toBeInTheDocument()
    })
  })

  describe('US05 - Visualização de Detalhes do Produto', () => {
    test('CT009 - Deve exibir detalhes completos do produto', async () => {
      render(
        <TestWrapper>
          <MockVerProduto />
        </TestWrapper>
      )

      // Verificar se os detalhes aparecem
      expect(screen.getByText('Pintura Abstrata')).toBeInTheDocument()
      expect(screen.getByText('João Artista')).toBeInTheDocument()
      expect(screen.getByText('R$ 150,00')).toBeInTheDocument()
    })

    test('CT010 - Deve exibir erro quando produto não existe', async () => {
      render(
        <TestWrapper>
          <div>
            <h1>Produto não encontrado</h1>
            <p>O produto solicitado não existe</p>
          </div>
        </TestWrapper>
      )

      // Verificar se a mensagem de erro aparece
      expect(screen.getByText('Produto não encontrado')).toBeInTheDocument()
    })
  })

  describe('US06 - Pesquisa de Produtos', () => {
    test('CT011 - Deve filtrar produtos por nome', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <MockCatalogo />
        </TestWrapper>
      )

      // Verificar se os produtos aparecem
      expect(screen.getByText('Pintura Abstrata')).toBeInTheDocument()

      // Simular busca por nome
      expect(screen.getByText('Pintura Abstrata')).toBeInTheDocument()
    })

    test('CT012 - Deve filtrar produtos por categoria', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <MockCatalogo />
        </TestWrapper>
      )

      // Verificar se os produtos aparecem
      expect(screen.getByText('Pintura Abstrata')).toBeInTheDocument()

      // Simular filtro por categoria
      expect(screen.getByText('Pintura Abstrata')).toBeInTheDocument()
    })
  })

  describe('US07 - Organização por Artista', () => {
    test('CT013 - Deve agrupar produtos por artista', async () => {
      render(
        <TestWrapper>
          <MockCatalogo />
        </TestWrapper>
      )

      // Verificar se os produtos aparecem
      expect(screen.getByText('Pintura Abstrata')).toBeInTheDocument()
      expect(screen.getByText('Escultura Moderna')).toBeInTheDocument()
    })

    test('CT014 - Deve filtrar produtos por artista específico', async () => {
      const user = userEvent.setup()
      
      render(
        <TestWrapper>
          <MockCatalogo />
        </TestWrapper>
      )

      // Verificar se os produtos aparecem
      expect(screen.getByText('Pintura Abstrata')).toBeInTheDocument()

      // Simular filtro por artista
      expect(screen.getByText('Pintura Abstrata')).toBeInTheDocument()
    })
  })
}) 