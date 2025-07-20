import axios from 'axios';

interface CepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

interface FreteClickResponse {
  success: boolean;
  data?: {
    services: {
      id: number;
      name: string;
      price: number;
      company: string;
      delivery_time: number;
      delivery_range: {
        min: number;
        max: number;
      };
    }[];
  };
  error?: string;
}

interface FreteResponse {
  cepOrigem: string;
  cepDestino: string;
  servicos: {
    codigo: string;
    nome: string;
    preco: number;
    prazo: number;
    erro?: string;
  }[];
}

export class CorreiosService {
  private static readonly VIACEP_BASE = 'https://viacep.com.br/ws';
  private static readonly FRETE_CLICK_BASE = 'https://www.freteclick.com.br/api';

  /**
   * Busca informações de um CEP usando ViaCEP
   */
  static async buscarCep(cep: string): Promise<CepResponse | null> {
    try {
      const cleanCep = cep.replace(/\D/g, '');
      const response = await axios.get(`${this.VIACEP_BASE}/${cleanCep}/json`);
      
      if (response.data.erro) {
        return null;
      }
      
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Calcula frete usando Frete Click (API gratuita)
   */
  static async calcularFrete(
    cepOrigem: string,
    cepDestino: string,
    peso: number = 1000,
    comprimento: number = 20,
    altura: number = 20,
    largura: number = 20
  ): Promise<FreteResponse> {
    try {
      // Limpar CEPs
      const cepOrigemClean = cepOrigem.replace(/\D/g, '');
      const cepDestinoClean = cepDestino.replace(/\D/g, '');

      // Buscar informações dos CEPs para validar
      const origem = await this.buscarCep(cepOrigemClean);
      const destino = await this.buscarCep(cepDestinoClean);
      
      if (!origem || !destino) {
        throw new Error('CEP de origem ou destino inválido');
      }

      // Calcular frete usando Frete Click
      const freteResponse = await this.calcularFreteClick(
        cepOrigemClean,
        cepDestinoClean,
        peso,
        comprimento,
        altura,
        largura
      );

      if (freteResponse.success && freteResponse.data?.services) {
        // Mapear serviços do Frete Click para nosso formato
        const servicos = freteResponse.data.services.map(service => ({
          codigo: service.id.toString(),
          nome: service.name,
          preco: service.price,
          prazo: service.delivery_time
        }));

        return {
          cepOrigem: cepOrigemClean,
          cepDestino: cepDestinoClean,
          servicos
        };
      } else {
        // Fallback para cálculo simulado se a API falhar
        return this.calcularFreteSimulado(origem, destino, peso);
      }
    } catch (error) {
      
      // Fallback para cálculo simulado
      try {
        const origem = await this.buscarCep(cepOrigem.replace(/\D/g, ''));
        const destino = await this.buscarCep(cepDestino.replace(/\D/g, ''));
        
        if (origem && destino) {
          return this.calcularFreteSimulado(origem, destino, peso);
        }
      } catch (fallbackError) {
        throw new Error('Não foi possível calcular o frete');
      }
      
    }
  }

  /**
   * Calcula frete usando Frete Click API
   */
  private static async calcularFreteClick(
    cepOrigem: string,
    cepDestino: string,
    peso: number,
    comprimento: number,
    altura: number,
    largura: number
  ): Promise<FreteClickResponse> {
    try {
      const response = await axios.post(`${this.FRETE_CLICK_BASE}/frete`, {
        cep_origem: cepOrigem,
        cep_destino: cepDestino,
        peso: peso / 1000, // Converter para kg
        comprimento,
        altura,
        largura,
        valor_declarado: 100 // Valor padrão para cálculo
      }, {
        timeout: 10000, // 10 segundos de timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      return {
        success: false,
        error: 'Erro na API de frete'
      };
    }
  }

  /**
   * Cálculo simulado de frete (fallback)
   */
  private static calcularFreteSimulado(
    origem: CepResponse,
    destino: CepResponse,
    peso: number
  ): FreteResponse {
    
    const distancia = this.calcularDistanciaSimulada(origem, destino);
    const pesoKg = peso / 1000;
    
    const precoPAC = this.calcularPrecoPAC(distancia, pesoKg);
    const precoSEDEX = this.calcularPrecoSEDEX(distancia, pesoKg);
    const prazoPAC = this.calcularPrazoPAC(distancia);
    const prazoSEDEX = this.calcularPrazoSEDEX(distancia);
    
    const servicos = [
      {
        codigo: '04510',
        nome: 'PAC',
        preco: precoPAC,
        prazo: prazoPAC
      },
      {
        codigo: '04014',
        nome: 'SEDEX',
        preco: precoSEDEX,
        prazo: prazoSEDEX
      }
    ];

    return {
      cepOrigem: origem.cep,
      cepDestino: destino.cep,
      servicos
    };
  }

  /**
   * Simula cálculo de distância entre CEPs (determinístico)
   */
  private static calcularDistanciaSimulada(origem: CepResponse, destino: CepResponse): number {
    // Função hash simples para gerar valor determinístico baseado nos CEPs
    const hash = (str: string) => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };
    
    // Gerar valor determinístico baseado nos CEPs
    const cepCombo = origem.cep + destino.cep;
    const hashValue = hash(cepCombo);
    
    // Simulação baseada no estado e hash
    if (origem.uf === destino.uf) {
      // Mesmo estado: 50-250km
      return 50 + (hashValue % 200);
    } else {
      // Estados diferentes: 500-2000km
      return 500 + (hashValue % 1500);
    }
  }

  /**
   * Calcula preço do PAC
   */
  private static calcularPrecoPAC(distancia: number, peso: number): number {
    const precoBase = 15.50;
    const precoPorKm = 0.08;
    const precoPorKg = 2.50;
    
    return Math.round((precoBase + (distancia * precoPorKm) + (peso * precoPorKg)) * 100) / 100;
  }

  /**
   * Calcula preço do SEDEX
   */
  private static calcularPrecoSEDEX(distancia: number, peso: number): number {
    const precoBase = 25.00;
    const precoPorKm = 0.12;
    const precoPorKg = 4.00;
    
    return Math.round((precoBase + (distancia * precoPorKm) + (peso * precoPorKg)) * 100) / 100;
  }

  /**
   * Calcula prazo do PAC
   */
  private static calcularPrazoPAC(distancia: number): number {
    if (distancia <= 200) return 3;
    if (distancia <= 500) return 5;
    if (distancia <= 1000) return 7;
    return 10;
  }

  /**
   * Calcula prazo do SEDEX
   */
  private static calcularPrazoSEDEX(distancia: number): number {
    if (distancia <= 200) return 1;
    if (distancia <= 500) return 2;
    if (distancia <= 1000) return 3;
    return 5;
  }

  /**
   * Valida formato do CEP
   */
  static validarCep(cep: string): boolean {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.length === 8;
  }

  /**
   * Formata CEP para exibição
   */
  static formatarCep(cep: string): string {
    const cleanCep = cep.replace(/\D/g, '');
    return cleanCep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
} 