const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("card-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

// Exibir modal do carrinho
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
});

// Fechar modal ao clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// Fechar modal ao clicar no botão de fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// Adicionar itens ao carrinho
menu.addEventListener("click", function (event) {
  const parentButton = event.target.closest(".add-to-cart-btn");

  if (parentButton) {
    const itemName = parentButton.getAttribute("data-nome");
    const itemPrice = parseFloat(parentButton.getAttribute("data-price"));

    if (itemName && itemPrice) {
      addItemToCart(itemName, itemPrice);
    }
  }
});

let cart = []; // Armazena os itens no carrinho

function addItemToCart(name, price) {
  // Adiciona o item ao array do carrinho
  cart.push({ name, price });

  // Atualiza o contador do carrinho
  cartCounter.textContent = cart.length;

  // Atualiza a exibição dos itens no modal
  renderCartItems();
}

function renderCartItems() {
  // Limpa a lista atual de itens
  cartItemsContainer.innerHTML = "";

  let total = 0;

  // Gera os itens dinamicamente no modal
  cart.forEach((item, index) => {
    total += item.price;

    const cartItem = document.createElement("div");
    cartItem.className = "flex justify-between border-b p-2";

    cartItem.innerHTML = `
      <span>${item.name}</span>
      <span>R$ ${item.price.toFixed(2)}</span>
      <button class="text-red-500 remove-item-btn" data-index="${index}">Remover</button>
    `;

    cartItemsContainer.appendChild(cartItem);
  });

  // Atualiza o total no carrinho
  cartTotal.textContent = total.toFixed(2);

  // Adiciona evento de remoção para cada botão de remover
  const removeButtons = document.querySelectorAll(".remove-item-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      removeItemFromCart(index);
    });
  });
}

function removeItemFromCart(index) {
  // Remove o item do carrinho
  cart.splice(index, 1);

  // Atualiza o contador
  cartCounter.textContent = cart.length;

  // Re-renderiza os itens
  renderCartItems();
}

// Finalizar pedido e enviar ao WhatsApp
checkoutBtn.addEventListener("click", function () {
  const address = addressInput.value.trim();

  if (address === "") {
    addressWarn.style.display = "block";
    return;
  }

  addressWarn.style.display = "none";

  // Calcula o valor total do pedido
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Montando a mensagem para envio via WhatsApp
  const itemsList = cart.map(item => `${item.name} - R$ ${item.price.toFixed(2)}`).join("\n");
  const message = `Pedido Finalizado:\nEndereço de entrega: ${address}\nItens:\n${itemsList}\nValor Total: R$ ${total.toFixed(2)}`;
  
  // Codifica a mensagem para envio via URL
  const encodedMessage = encodeURIComponent(message);

  // Substitua pelo número desejado de WhatsApp (em formato internacional, sem espaços, nem caracteres extras)
  const whatsappNumber = "5548999701033"; // Número fictício de exemplo. Substitua com o número real
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  // Abre o WhatsApp no navegador
  window.open(whatsappUrl, "_blank");

  console.log("Pedido finalizado:");
  console.log("Endereço de entrega:", address);
  console.log("Itens no carrinho:", cart);
  console.log("Valor total: R$", total.toFixed(2));

  // Limpa o carrinho e fecha o modal
  cart = [];
  renderCartItems();
  cartModal.style.display = "none";
});
