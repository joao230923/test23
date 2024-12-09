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
const discountInput = document.getElementById("discount-code");
const discountWarn = document.getElementById("discount-warn");

// Exibir modal do carrinho
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";
  renderCartItems();
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

let cart = JSON.parse(localStorage.getItem("cart")) || []; // Carrega carrinho do localStorage ou inicializa vazio

function addItemToCart(name, price) {
  cart.push({ name, price });
  saveCartToLocalStorage();
  cartCounter.textContent = cart.length;
  renderCartItems();
}

function renderCartItems() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

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

  cartTotal.textContent = total.toFixed(2);
  addRemoveListeners();
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll(".remove-item-btn");
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"));
      removeItemFromCart(index);
    });
  });
}

function removeItemFromCart(index) {
  cart.splice(index, 1);
  saveCartToLocalStorage();
  cartCounter.textContent = cart.length;
  renderCartItems();
}

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Finalizar pedido e enviar ao WhatsApp
checkoutBtn.addEventListener("click", async function () {
  const address = addressInput.value.trim();
  const discountCode = discountInput.value.trim();
  const validDiscount = "DISCOUNT10";

  if (address === "") {
    addressWarn.style.display = "block";
    return;
  }

  addressWarn.style.display = "none";

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  // Verifica e aplica o desconto
  let discountApplied = 0;
  if (discountCode === validDiscount) {
    discountApplied = total * 0.1; // 10% de desconto
  }

  const finalAmount = total - discountApplied;

  // Simulação da taxa de entrega
  const deliveryFee = await calculateDeliveryFee(address);

  const finalTotal = finalAmount + deliveryFee;

  const itemsList = cart.map(item => `${item.name} - R$ ${item.price.toFixed(2)}`).join("\n");
  const message = `Pedido Finalizado com sucesso:\nEndereço de entrega: ${address}\nItens:\n${itemsList}\nSubtotal: R$ ${total.toFixed(2)}\nDesconto: -R$ ${discountApplied.toFixed(2)}\nTaxa de entrega: +R$ ${deliveryFee.toFixed(2)}\nValor total: R$ ${finalTotal.toFixed(2)}`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappNumber = "5548999701033";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappUrl, "_blank");

  console.log("Pedido enviado com sucesso!");
  console.log("Endereço de entrega:", address);
  console.log("Itens no carrinho:", cart);
  console.log("Valor total: R$", finalTotal);

  cart = [];
  saveCartToLocalStorage();
  renderCartItems();
  cartModal.style.display = "none";
});

async function calculateDeliveryFee(address) {
  // Simulação de uma chamada para API externa para cálculo da taxa de entrega.
  return Math.random() * 10; // Taxa entre 0 e 10 reais (simulado).
}

// Atualizar o desconto ao digitar código
discountInput.addEventListener("input", function () {
  if (discountInput.value.trim() !== "") {
    discountWarn.style.display = "none";
  }
});
