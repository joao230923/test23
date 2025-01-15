// Configuração dos horários de funcionamento
const openHour = 9; // Horário de abertura (9h)
const closeHour = 23; // Horário de fechamento (23h)
const warningStartHour = 18; // Início do horário de aviso (18h)

// Elementos do DOM
const finalizeButton = checkoutBtn; // Checkout Button já definido
const message = document.getElementById("message"); // Você pode criar um elemento para exibir mensagens
const cartModal = document.getElementById("cart-modal"); // Modal do carrinho já existente

// Função para verificar o horário atual
function isWithinOperatingHours() {
    const currentHour = new Date().getHours();
    return currentHour >= openHour && currentHour < closeHour;
}

// Atualiza o botão e a interface com base no horário
function updateInterface() {
    const currentHour = new Date().getHours();

    if (currentHour >= openHour && currentHour < warningStartHour) {
        finalizeButton.className = 'button open';
        message.textContent = 'Estamos abertos! Pode finalizar seu pedido.';
    } else if (currentHour >= warningStartHour && currentHour < closeHour) {
        finalizeButton.className = 'button outside-hours';
        message.textContent = 'Estamos próximos do horário de fechamento. Finalize seu pedido em breve!';
    } else {
        finalizeButton.className = 'button closed';
        message.textContent = 'Estamos fechados. Por favor, volte dentro do horário de funcionamento.';
    }
}

// Atualiza a interface ao carregar a página
updateInterface();

// Evento ao clicar no botão de finalizar pedido
checkoutBtn.addEventListener("click", async function () {
    const currentHour = new Date().getHours();

    if (!isWithinOperatingHours()) {
        alert('Não é possível finalizar o pedido. Estamos fora do horário de funcionamento.');
        return;
    }

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

// Chama a atualização da interface ao abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateInterface();
    cartModal.style.display = "flex";
    renderCartItems();
});
