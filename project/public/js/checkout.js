import { createOrder } from './utils.js';

const CHECKOUT_DRAFT_KEY = 'checkoutDraft';

const paymentLabels = {
  cash: '현금',
  card: '신용카드',
  'apple-pay': 'Apple Pay',
};

let checkoutDraft = null;
let selectedPaymentMethod = 'cash';
let isSubmitting = false;

function formatPrice(price) {
  return `₩${Number(price).toLocaleString()}`;
}

function getCartCount(items) {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function readCheckoutDraft() {
  const rawDraft = sessionStorage.getItem(CHECKOUT_DRAFT_KEY);

  if (!rawDraft) return null;

  try {
    const parsedDraft = JSON.parse(rawDraft);
    const items = Array.isArray(parsedDraft.items) ? parsedDraft.items : [];

    if (items.length === 0) return null;

    return {
      ...parsedDraft,
      items,
      total: Number(parsedDraft.total) || getCartTotal(items),
    };
  } catch {
    return null;
  }
}

function renderReceipt(draft) {
  const summaryTotal = document.getElementById('summary-total');
  const receiptTotal = document.getElementById('receipt-total');
  const receiptList = document.getElementById('receipt-list');

  if (!summaryTotal || !receiptTotal || !receiptList) return;

  summaryTotal.innerText = formatPrice(draft.total);
  receiptTotal.innerText = formatPrice(draft.total);
  receiptList.innerHTML = '';

  draft.items.forEach((item) => {
    const receiptItem = document.createElement('div');
    receiptItem.className = 'receipt-item';
    receiptItem.innerHTML = `
      <div class="receipt-item-info">
        <strong>${item.name}</strong>
        <span>${formatPrice(item.price)} × ${item.quantity}</span>
      </div>
      <strong class="receipt-item-price">${formatPrice(item.price * item.quantity)}</strong>
    `;
    receiptList.appendChild(receiptItem);
  });
}

function toggleReceipt() {
  const toggleButton = document.getElementById('order-detail-toggle');
  const receipt = document.getElementById('order-receipt');

  if (!toggleButton || !receipt) return;

  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  toggleButton.setAttribute('aria-expanded', String(!isExpanded));
  receipt.hidden = isExpanded;
}

function renderPaymentSelection() {
  document.querySelectorAll('.payment-card').forEach((card) => {
    const isSelected = card.dataset.method === selectedPaymentMethod;
    card.classList.toggle('is-selected', isSelected);
    card.setAttribute('aria-checked', String(isSelected));
  });
}

function setMessage(message, type = 'default') {
  const messageElement = document.getElementById('checkout-message');

  if (!messageElement) return;

  messageElement.innerText = message;
  messageElement.dataset.type = type;
}

function setSubmitting(nextSubmitting) {
  const payButton = document.getElementById('pay-button');

  isSubmitting = nextSubmitting;

  if (!payButton) return;

  payButton.disabled = nextSubmitting;
  payButton.innerText = nextSubmitting ? '결제 처리 중' : '결제하기';
}

function resetCheckoutSession() {
  sessionStorage.removeItem(CHECKOUT_DRAFT_KEY);
}

async function submitOrder() {
  if (!checkoutDraft || isSubmitting) return;

  const orderPayload = checkoutDraft.items.map((item) => ({
    menu_id: item.id,
    quantity: item.quantity,
  }));

  setSubmitting(true);
  setMessage(`${paymentLabels[selectedPaymentMethod]} 결제를 진행합니다.`);

  try {
    const response = await createOrder(orderPayload);

    if (!response.ok) {
      throw new Error('주문 전송 실패');
    }

    resetCheckoutSession();
    window.location.href = './checkout-complete.html';
  } catch {
    setMessage('결제 요청에 실패했습니다. 잠시 후 다시 시도해 주세요.', 'error');
    setSubmitting(false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkoutDraft = readCheckoutDraft();

  document.getElementById('backButton')?.addEventListener('click', () => {
    window.location.href = './order.html';
  });

  if (!checkoutDraft) {
    setMessage('주문 정보가 없습니다. 메뉴를 먼저 선택해 주세요.', 'error');
    document.getElementById('pay-button')?.setAttribute('disabled', 'true');
    setTimeout(() => {
      window.location.href = './order.html';
    }, 1200);
    return;
  }

  const itemCount = getCartCount(checkoutDraft.items);
  const summaryTitle = document.getElementById('order-summary-title');

  if (summaryTitle) {
    summaryTitle.innerText = `주문 상세보기`;
  }

  renderReceipt(checkoutDraft);
  setMessage(`${itemCount}개 메뉴를 확인하고 결제수단을 선택해 주세요.`);

  document.getElementById('order-detail-toggle')?.addEventListener('click', toggleReceipt);
  document.getElementById('payment-methods')?.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target.closest('.payment-card') : null;

    if (!target) return;

    selectedPaymentMethod = target.dataset.method;
    renderPaymentSelection();
  });
  document.getElementById('pay-button')?.addEventListener('click', submitOrder);

  renderPaymentSelection();
});
