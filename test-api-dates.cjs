const http = require('http');

console.log('🧪 Testando API de pedidos...');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/pedidos',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const pedidos = JSON.parse(data);
      console.log(`\n📊 Total de pedidos retornados: ${pedidos.length}`);
      
      pedidos.forEach(pedido => {
        console.log(`   - ID ${pedido.id}: ${pedido.produtoNome}`);
        console.log(`     Status: ${pedido.status}`);
        console.log(`     Data: "${pedido.data}"`);
        console.log(`     Created_at: "${pedido.created_at}"`);
        console.log('');
      });
    } catch (error) {
      console.error('❌ Erro ao parsear resposta:', error);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Erro na requisição:', error);
});

req.end(); 