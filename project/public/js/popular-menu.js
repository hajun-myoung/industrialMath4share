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
    const menuStats = [...createMenuStats(normalizedOrders).values()];

    renderSalesSummary(normalizedOrders);
    renderSalesCharts(normalizedOrders);
    renderOrderTimeCharts(normalizedOrders);
    renderTopMenuStats(menuStats);
    renderMenuStats(normalizedOrders, menuStats);
    renderUpdatedAt();

    message.textContent =
      normalizedOrders.length > 0
        ? '주문 데이터가 최신 상태입니다.'
        : '아직 집계할 주문 데이터가 없습니다.';
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
  const monthSales = sumRevenue(
    orderDetails,
    monthStart,
    new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1),
  );
  const previousMonthSales = sumRevenue(orderDetails, previousMonthStart, monthStart);

  document.getElementById('todaySales').textContent = formatMoney(todaySales);
  document.getElementById('weekSales').textContent = formatMoney(weekSales);
  document.getElementById('monthSales').textContent = formatMoney(monthSales);

  renderTrend(document.getElementById('weekTrend'), '전주 대비', weekSales, previousWeekSales);
  renderTrend(document.getElementById('monthTrend'), '전월 대비', monthSales, previousMonthSales);
}

function renderSalesCharts(orderDetails) {
  const now = new Date();
  const dailyTrend = createDailyRevenueTrend(orderDetails, now);
  const monthlyTrend = createMonthlyRevenueTrend(orderDetails, now);

  renderBarChart(document.getElementById('dailySalesChart'), dailyTrend);
  renderBarChart(document.getElementById('monthlySalesChart'), monthlyTrend);
}

function renderOrderTimeCharts(orderDetails) {
  const hourlyOrders = createHourlyOrderCountTrend(orderDetails);
  const weekdaySales = createWeekdayRevenueTrend(orderDetails);

  renderBarChart(document.getElementById('hourlyOrderChart'), hourlyOrders, formatCount);
  renderBarChart(document.getElementById('weekdaySalesChart'), weekdaySales);
}

function renderTopMenuStats(menuStats) {
  const quantityTopMenus = [...menuStats].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
  const revenueTopMenus = [...menuStats].sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  renderRankList(document.getElementById('quantityTopList'), quantityTopMenus, 'quantity');
  renderRankList(document.getElementById('revenueTopList'), revenueTopMenus, 'revenue');
}

function renderMenuStats(orderDetails, menuStats) {
  const sortedMenuStats = [...menuStats].sort((a, b) => b.revenue - a.revenue);
  const quantityTopMenuNames = new Set(
    [...menuStats]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map((menu) => menu.name),
  );
  const menuStatsList = document.getElementById('menuStatsList');
  const orderDetailCount = document.getElementById('orderDetailCount');

  orderDetailCount.textContent = `${numberFormatter.format(orderDetails.length)}건`;
  menuStatsList.innerHTML = '';

  if (sortedMenuStats.length === 0) {
    const emptyRow = document.createElement('div');
    emptyRow.className = 'analytics-empty-row';
    emptyRow.textContent = '표시할 메뉴별 통계가 없습니다.';
    menuStatsList.appendChild(emptyRow);
    return;
  }

  sortedMenuStats.forEach((menu) => {
    const row = document.createElement('div');
    const nameCell = document.createElement('div');
    const nameText = document.createElement('span');
    const quantityCell = document.createElement('div');
    const revenueCell = document.createElement('div');

    row.className = 'analytics-table-row';
    nameCell.className = 'analytics-menu-name';
    nameText.textContent = menu.name;
    quantityCell.textContent = `${numberFormatter.format(menu.quantity)}개`;
    revenueCell.textContent = formatMoney(menu.revenue);

    nameCell.appendChild(nameText);

    if (quantityTopMenuNames.has(menu.name)) {
      const topBadge = document.createElement('span');
      topBadge.className = 'top-menu-badge';
      topBadge.textContent = 'TOP 5';
      nameCell.appendChild(topBadge);
    }

    row.appendChild(nameCell);
    row.appendChild(quantityCell);
    row.appendChild(revenueCell);
    menuStatsList.appendChild(row);
  });
}

function renderRankList(listElement, menus, valueType) {
  listElement.innerHTML = '';

  if (menus.length === 0) {
    const emptyItem = document.createElement('div');
    emptyItem.className = 'rank-empty';
    emptyItem.textContent = '표시할 메뉴가 없습니다.';
    listElement.appendChild(emptyItem);
    return;
  }

  const maxValue = Math.max(...menus.map((menu) => getRankValue(menu, valueType)), 1);

  menus.forEach((menu, index) => {
    const item = document.createElement('div');
    const rank = document.createElement('div');
    const content = document.createElement('div');
    const header = document.createElement('div');
    const name = document.createElement('div');
    const value = document.createElement('div');
    const track = document.createElement('div');
    const fill = document.createElement('div');
    const currentValue = getRankValue(menu, valueType);

    item.className = 'rank-item';
    rank.className = 'rank-number';
    content.className = 'rank-content';
    header.className = 'rank-header';
    name.className = 'rank-name';
    value.className = 'rank-value';
    track.className = 'rank-track';
    fill.className = 'rank-fill';

    rank.textContent = String(index + 1);
    name.textContent = menu.name;
    value.textContent =
      valueType === 'quantity'
        ? `${numberFormatter.format(menu.quantity)}개`
        : formatMoney(menu.revenue);
    fill.style.width = `${Math.max((currentValue / maxValue) * 100, currentValue > 0 ? 6 : 0)}%`;

    header.appendChild(name);
    header.appendChild(value);
    track.appendChild(fill);
    content.appendChild(header);
    content.appendChild(track);
    item.appendChild(rank);
    item.appendChild(content);
    listElement.appendChild(item);
  });
}

function getRankValue(menu, valueType) {
  return valueType === 'quantity' ? menu.quantity : menu.revenue;
}

function createDailyRevenueTrend(orderDetails, now) {
  return Array.from({ length: 7 }, (_, index) => {
    const dayStart = addDays(startOfDay(now), index - 6);
    const nextDayStart = addDays(dayStart, 1);
    const label = new Intl.DateTimeFormat('ko-KR', {
      weekday: 'short',
    }).format(dayStart);

    return {
      label,
      value: sumRevenue(orderDetails, dayStart, nextDayStart),
    };
  });
}

function createMonthlyRevenueTrend(orderDetails, now) {
  return Array.from({ length: 6 }, (_, index) => {
    const monthStart = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const nextMonthStart = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);

    return {
      label: `${monthStart.getMonth() + 1}월`,
      value: sumRevenue(orderDetails, monthStart, nextMonthStart),
    };
  });
}

function createHourlyOrderCountTrend(orderDetails) {
  return Array.from({ length: 24 }, (_, hour) => {
    const orderCount = orderDetails.reduce((count, orderDetail) => {
      const orderHour = new Date(orderDetail.createdAt).getHours();
      return orderHour === hour ? count + 1 : count;
    }, 0);

    return {
      label: `${String(hour).padStart(2, '0')}시`,
      value: orderCount,
    };
  });
}

function createWeekdayRevenueTrend(orderDetails) {
  const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return weekdayLabels.map((label, weekdayIndex) => {
    const revenue = orderDetails.reduce((total, orderDetail) => {
      const orderWeekday = new Date(orderDetail.createdAt).getDay();
      return orderWeekday === weekdayIndex ? total + orderDetail.revenue : total;
    }, 0);

    return {
      label,
      value: revenue,
    };
  });
}

function renderBarChart(chartElement, chartData, valueFormatter = formatCompactMoney) {
  const maxValue = Math.max(...chartData.map((item) => item.value), 1);
  const columnWidth = chartElement.classList.contains('compact-bar-chart') ? 'minmax(36px, 1fr)' : 'minmax(0, 1fr)';

  chartElement.innerHTML = '';
  chartElement.style.gridTemplateColumns = `repeat(${chartData.length}, ${columnWidth})`;

  chartData.forEach((item) => {
    const barItem = document.createElement('div');
    const barValue = document.createElement('div');
    const barTrack = document.createElement('div');
    const barFill = document.createElement('div');
    const barLabel = document.createElement('div');

    barItem.className = 'bar-chart-item';
    barValue.className = 'bar-chart-value';
    barTrack.className = 'bar-chart-track';
    barFill.className = 'bar-chart-fill';
    barLabel.className = 'bar-chart-label';

    barFill.style.height = `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 8 : 0)}%`;
    barValue.textContent = valueFormatter(item.value);
    barLabel.textContent = item.label;

    barTrack.appendChild(barFill);
    barItem.appendChild(barValue);
    barItem.appendChild(barTrack);
    barItem.appendChild(barLabel);
    chartElement.appendChild(barItem);
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

function formatCompactMoney(value) {
  if (value >= 10_000) return `${numberFormatter.format(Math.round(value / 10_000))}만`;
  return `${numberFormatter.format(value)}`;
}

function formatCount(value) {
  return `${numberFormatter.format(value)}건`;
}
