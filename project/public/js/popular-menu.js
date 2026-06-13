const moneyFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'KRW',
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('ko-KR');

document.addEventListener('DOMContentLoaded', async () => {
  const message = document.getElementById('analyticsMessage');

  try {
    const orderDetails = await fetchOrderDetails();
    const normalizedOrders = orderDetails.map(normalizeOrderDetail).filter(Boolean);

    renderSalesSummary(normalizedOrders);
    renderMenuStats(normalizedOrders);
    renderUpdatedAt();

    message.textContent =
      normalizedOrders.length > 0 ? '주문 데이터가 최신 상태입니다.' : '아직 집계할 주문 데이터가 없습니다.';
    message.classList.toggle('is-empty', normalizedOrders.length === 0);
  } catch (error) {
    console.error(error);
    message.textContent = '주문 데이터를 불러오지 못했습니다.';
    message.classList.add('is-error');
  }
});

async function fetchOrderDetails() {
  const response = await fetch('/api/orders');

  if (!response.ok) {
    throw new Error(`Failed to load order details: ${response.status}`);
  }

  return response.json();
}

function normalizeOrderDetail(orderDetail) {
  const createdAt = normalizeTimestamp(orderDetail.created_at ?? orderDetail.createdAt);
  const price = Number(orderDetail.price);
  const quantity = Number(orderDetail.quantity);

  if (!createdAt || Number.isNaN(price) || Number.isNaN(quantity)) {
    return null;
  }

  return {
    id: orderDetail.id ?? orderDetail.orderDetailId,
    menuName: getKoreanMenuName(orderDetail.menu_name ?? orderDetail.name),
    price,
    quantity,
    revenue: price * quantity,
    createdAt,
  };
}

function normalizeTimestamp(timestamp) {
  const numericTimestamp = Number(timestamp);

  if (Number.isNaN(numericTimestamp)) return null;

  return numericTimestamp < 1_000_000_000_000 ? numericTimestamp * 1000 : numericTimestamp;
}

function getKoreanMenuName(rawName) {
  let parsedName = rawName;

  for (let i = 0; i < 2; i += 1) {
    if (typeof parsedName !== 'string') break;

    try {
      parsedName = JSON.parse(parsedName);
    } catch {
      break;
    }
  }

  if (typeof parsedName === 'string') return parsedName;
  if (parsedName?.kor) return parsedName.kor;
  if (parsedName?.menuname?.kor) return parsedName.menuname.kor;

  return '이름 없음';
}

function renderSalesSummary(orderDetails) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const weekStart = startOfWeek(now);
  const previousWeekStart = addDays(weekStart, -7);
  const monthStart = startOfMonth(now);
  const previousMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() - 1, 1);

  const todaySales = sumRevenue(orderDetails, todayStart, tomorrowStart);
  const weekSales = sumRevenue(orderDetails, weekStart, addDays(weekStart, 7));
  const previousWeekSales = sumRevenue(orderDetails, previousWeekStart, weekStart);
  const monthSales = sumRevenue(orderDetails, monthStart, new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1));
  const previousMonthSales = sumRevenue(orderDetails, previousMonthStart, monthStart);

  document.getElementById('todaySales').textContent = formatMoney(todaySales);
  document.getElementById('weekSales').textContent = formatMoney(weekSales);
  document.getElementById('monthSales').textContent = formatMoney(monthSales);

  renderTrend(document.getElementById('weekTrend'), '전주 대비', weekSales, previousWeekSales);
  renderTrend(document.getElementById('monthTrend'), '전월 대비', monthSales, previousMonthSales);
}

function renderMenuStats(orderDetails) {
  const menuStats = [...createMenuStats(orderDetails).values()].sort((a, b) => b.revenue - a.revenue);
  const menuStatsList = document.getElementById('menuStatsList');
  const orderDetailCount = document.getElementById('orderDetailCount');

  orderDetailCount.textContent = `${numberFormatter.format(orderDetails.length)}건`;
  menuStatsList.innerHTML = '';

  if (menuStats.length === 0) {
    const emptyRow = document.createElement('div');
    emptyRow.className = 'analytics-empty-row';
    emptyRow.textContent = '표시할 메뉴별 통계가 없습니다.';
    menuStatsList.appendChild(emptyRow);
    return;
  }

  menuStats.forEach((menu) => {
    const row = document.createElement('div');
    const nameCell = document.createElement('div');
    const quantityCell = document.createElement('div');
    const revenueCell = document.createElement('div');

    row.className = 'analytics-table-row';
    nameCell.className = 'analytics-menu-name';
    nameCell.textContent = menu.name;
    quantityCell.textContent = `${numberFormatter.format(menu.quantity)}개`;
    revenueCell.textContent = formatMoney(menu.revenue);

    row.appendChild(nameCell);
    row.appendChild(quantityCell);
    row.appendChild(revenueCell);
    menuStatsList.appendChild(row);
  });
}

function createMenuStats(orderDetails) {
  return orderDetails.reduce((stats, orderDetail) => {
    const previousStat = stats.get(orderDetail.menuName) ?? {
      name: orderDetail.menuName,
      quantity: 0,
      revenue: 0,
    };

    previousStat.quantity += orderDetail.quantity;
    previousStat.revenue += orderDetail.revenue;
    stats.set(orderDetail.menuName, previousStat);

    return stats;
  }, new Map());
}

function renderUpdatedAt() {
  const updatedAt = document.getElementById('analyticsUpdatedAt');
  const formattedDate = new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());

  updatedAt.textContent = `${formattedDate} 기준`;
}

function renderTrend(element, label, currentValue, previousValue) {
  element.classList.remove('is-up', 'is-down', 'is-flat');

  if (previousValue === 0) {
    element.textContent = currentValue > 0 ? `${label} 신규 매출` : `${label} 0%`;
    element.classList.add(currentValue > 0 ? 'is-up' : 'is-flat');
    return;
  }

  const changeRate = ((currentValue - previousValue) / previousValue) * 100;
  const roundedRate = Math.abs(changeRate).toFixed(1);

  if (changeRate > 0) {
    element.textContent = `${label} +${roundedRate}%`;
    element.classList.add('is-up');
  } else if (changeRate < 0) {
    element.textContent = `${label} -${roundedRate}%`;
    element.classList.add('is-down');
  } else {
    element.textContent = `${label} 0%`;
    element.classList.add('is-flat');
  }
}

function sumRevenue(orderDetails, startDate, endDate) {
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();

  return orderDetails.reduce((total, orderDetail) => {
    if (orderDetail.createdAt < startTime || orderDetail.createdAt >= endTime) return total;
    return total + orderDetail.revenue;
  }, 0);
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfWeek(date) {
  const dayIndexFromMonday = (date.getDay() + 6) % 7;
  return addDays(startOfDay(date), -dayIndexFromMonday);
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatMoney(value) {
  return moneyFormatter.format(value);
}
