import React from 'react'

// Componente mockado para CadastrarVendedor
export const MockCadastrarVendedor = () => (
  <div>
    <h1>Cadastrar Novo Vendedor</h1>
    <form>
      <div>
        <label htmlFor="firstName">Nome *</label>
        <input id="firstName" type="text" name="firstName" />
      </div>
      <div>
        <label htmlFor="lastName">Sobrenome *</label>
        <input id="lastName" type="text" name="lastName" />
      </div>
      <div>
        <label htmlFor="email">Email *</label>
        <input id="email" type="email" name="email" />
      </div>
      <div>
        <label htmlFor="handle">Handle *</label>
        <input id="handle" type="text" name="handle" />
      </div>
      <div>
        <label htmlFor="senha">Senha *</label>
        <input id="senha" type="password" name="senha" />
      </div>
      <button type="submit">Cadastrar</button>
    </form>
  </div>
)

// Componente mockado para Vendedores
export const MockVendedores = () => (
  <div>
    <h1>Vendedores</h1>
    <div>
      <div>João Artista</div>
      <div>Maria Pintora</div>
    </div>
  </div>
)

// Componente mockado para Reembolsos
export const MockReembolsos = () => (
  <div>
    <h1>Reembolsos</h1>
    <div>
      <div>João Silva</div>
      <div>Maria Santos</div>
    </div>
  </div>
)

// Componente mockado para Login
export const MockLogin = () => (
  <div>
    <h1>Login</h1>
    <form>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Senha" />
      <button type="submit">Entrar</button>
    </form>
  </div>
)

// Componente mockado para Register
export const MockRegister = () => (
  <div>
    <h1>Cadastro</h1>
    <form>
      <input type="text" placeholder="Nome" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Senha" />
      <button type="submit">Cadastrar</button>
    </form>
  </div>
)

// Componente mockado para Catalogo
export const MockCatalogo = () => (
  <div>
    <h1>Catálogo</h1>
    <div>
      <div>Pintura Abstrata</div>
      <div>Escultura Moderna</div>
    </div>
  </div>
)

// Componente mockado para VerProduto
export const MockVerProduto = () => (
  <div>
    <h1>Pintura Abstrata</h1>
    <div>João Artista</div>
    <div>R$ 150,00</div>
  </div>
)

// Componente mockado para Carrinho
export const MockCarrinho = () => (
  <div>
    <h1>Carrinho</h1>
    <div>
      <div>Pintura Abstrata - R$ 150,00</div>
      <div>Escultura Moderna - R$ 300,00</div>
    </div>
    <div>Total: R$ 450,00</div>
  </div>
)

// Componente mockado para Pedidos
export const MockPedidos = () => (
  <div>
    <h1>Pedidos</h1>
    <div>
      <div>Pedido #1 - João Silva</div>
      <div>Pedido #2 - Maria Santos</div>
    </div>
  </div>
) 