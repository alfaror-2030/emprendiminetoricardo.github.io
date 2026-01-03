// Configuración general 
const CELULAR = "593989358710";       //Número de WhatsApp en formato internacional
const PRECIO_BAGUETTE = 2.00;
const PRECIO_INTEGRAL = 2.00;
const COSTO_RECOGIDA = 0.75;         // Costo de recoger en Minimarket
const COSTO_ENTREGA = 1.00;          // costo de entregar al cliente

//Estado del pedido
const state = { baguette: 0, integral: 0 };
//Función para obetener elementos por ID
function q(id){ return document.getElementById(id); }

// Actualizar cantidades y resumen del pedido
function updateUI(){
  q('baguette').innerText = state.baguette;
  q('integral').innerText = state.integral;

  const items = state.baguette + state.integral;
  const subtotal = +(state.baguette * PRECIO_BAGUETTE + state.integral * PRECIO_INTEGRAL);
  const pickup = items > 0 ? COSTO_RECOGIDA : 0;
  const delivery = items > 0 ? COSTO_ENTREGA : 0;
  const total = +(subtotal + pickup + delivery);

  q('items-count').innerText = items;
  q('subtotal').innerText = formatMoney(subtotal);
  q('pickup-fee').innerText = formatMoney(pickup);
  q('delivery-fee').innerText = formatMoney(delivery);
  q('total').innerText = formatMoney(total);
}

//Fomato de dinero
function formatMoney(n){ return '$' + n.toFixed(2); }

// Eventos de botones + y -
document.addEventListener('click', function(e){
  const plus = e.target.closest('.qty-plus');
  const minus = e.target.closest('.qty-minus');
  if(plus){
    const key = plus.dataset.key;
    state[key] = state[key] + 1;
    updateUI();
  } else if(minus){
    const key = minus.dataset.key;
    state[key] = Math.max(0, state[key] - 1);
    updateUI();
  }
});

// Enviar pedidos por WhatsApp 
document.getElementById('send-btn').addEventListener('click', function(){
  const nombre = q('cliente-nombre').value.trim();
  const direccion = q('cliente-direccion').value.trim();
  const ref = q('cliente-ref').value.trim();

  if(!nombre || !direccion){
    alert('Por favor ingresa tu nombre y dirección.');
    return;
  }
  if(state.baguette === 0 && state.integral === 0){
    alert('Selecciona al menos un producto para enviar el pedido.');
    return;
  }

  // Calcular totales//
  const subtotal = +(state.baguette * PRECIO_BAGUETTE + state.integral * PRECIO_INTEGRAL);
  const pickup = COSTO_RECOGIDA;
  const delivery = COSTO_ENTREGA;
  const total = +(subtotal + pickup + delivery);

  // Construir mensaje bonito//
  let msg = `*Pedido desde Delivery Express - Lago Agrio*%0A%0A`;
  msg += `*Productos:*%0A`;
  if(state.baguette>0) msg += `- ${state.baguette} x Sánduche Baguette + Cola = ${formatMoney(state.baguette*PRECIO_BAGUETTE)}%0A`;
  if(state.integral>0) msg += `- ${state.integral} x Sánduche Integral + Cola = ${formatMoney(state.integral*PRECIO_INTEGRAL)}%0A`;
  msg += `%0A*Sub-total:* ${formatMoney(subtotal)}%0A`;
  msg += `*Recogida:* ${formatMoney(pickup)}%0A`;
  msg += `*Entrega:* ${formatMoney(delivery)}%0A`;
  msg += `*TOTAL a pagar:* ${formatMoney(total)}%0A%0A`;
  msg += `*Cliente:* ${encodeURIComponent(nombre)}%0A`;
  msg += `*Dirección:* ${encodeURIComponent(direccion)}%0A`;
  if(ref) msg += `*Observaciones:* ${encodeURIComponent(ref)}%0A`;

  // abrir wa.me es para abrir automáticamente un chat con el número del negocio
  const url = `https://wa.me/${CELULAR}?text=${msg}`;
  window.open(url, '_blank');
});

// Inicialiar la página
updateUI();