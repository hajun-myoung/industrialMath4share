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

  renderLineChart(document.getElementById('hourlyOrderChart'), hourlyOrders, formatCount);
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
  const revenueTopMenuNames = new Set(
    [...menuStats]
      .sort((a, b) => b.revenue - a.revenue)
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
      nameCell.appendChild(createStatBadge('주문 TOP', 'order'));
    }

    if (revenueTopMenuNames.has(menu.name)) {
      nameCell.appendChild(createStatBadge('매출 TOP', 'revenue'));
    }

    row.appendChild(nameCell);
    row.appendChild(quantityCell);
    row.appendChild(revenueCell);
    menuStatsList.appendChild(row);
  });
}

function createStatBadge(label, type) {
  const badge = document.createElement('span');
  badge.className = `top-menu-badge is-${type}`;
  badge.textContent = label;
  return badge;
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
      label: `${String(hour)}`,
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

function renderLineChart(chartElement, chartData, valueFormatter = formatCompactMoney) {
  const width = 720;
  const height = 508;
  const padding = { top: 18, right: 18, bottom: 28, left: 18 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const actualMaxValue = Math.max(...chartData.map((item) => item.value));
  const maxValue = Math.max(actualMaxValue, 1);
  const positiveValues = chartData.map((item) => item.value).filter((value) => value > 0);
  const minPositiveValue = positiveValues.length > 0 ? Math.min(...positiveValues) : null;
  const points = chartData.map((item, index) => {
    const x = padding.left + (innerWidth / (chartData.length - 1)) * index;
    const y = padding.top + innerHeight - (item.value / maxValue) * innerHeight;
    return { ...item, x, y };
  });
  const highestPoint = points.find((point) => point.value === actualMaxValue);
  const lowestPoint =
    minPositiveValue === null ? null : points.find((point) => point.value === minPositiveValue);

  chartElement.innerHTML = '';

  const svg = createSvgElement('svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', '시간대별 주문 건수 선그래프');

  const baseline = createSvgElement('line');
  baseline.setAttribute('class', 'line-chart-baseline');
  baseline.setAttribute('x1', String(padding.left));
  baseline.setAttribute('x2', String(width - padding.right));
  baseline.setAttribute('y1', String(height - padding.bottom));
  baseline.setAttribute('y2', String(height - padding.bottom));
  svg.appendChild(baseline);

  const area = createSvgElement('path');
  area.setAttribute('class', 'line-chart-area');
  area.setAttribute('d', createAreaPath(points, height - padding.bottom));
  svg.appendChild(area);

  const path = createSvgElement('path');
  path.setAttribute('class', 'line-chart-line');
  path.setAttribute('d', createSmoothPath(points));
  svg.appendChild(path);

  points.forEach((point, index) => {
    if (index % 3 !== 0 && index !== points.length - 1) return;

    const label = createSvgElement('text');
    label.setAttribute('class', 'line-chart-axis-label');
    label.setAttribute('x', String(point.x));
    label.setAttribute('y', String(height + 10));
    label.textContent = point.label;
    svg.appendChild(label);
  });

  const highlightPoints =
    highestPoint === lowestPoint || !lowestPoint ? [highestPoint] : [lowestPoint, highestPoint];

  highlightPoints.forEach((point) => {
    if (!point || point.value === 0) return;

    const marker = createSvgElement('circle');
    const label = createSvgElement('text');

    marker.setAttribute(
      'class',
      point === highestPoint ? 'line-chart-marker is-high' : 'line-chart-marker is-low',
    );
    marker.setAttribute('cx', String(point.x));
    marker.setAttribute('cy', String(point.y));
    marker.setAttribute('r', '5');

    label.setAttribute(
      'class',
      point === highestPoint ? 'line-chart-point-label is-high' : 'line-chart-point-label is-low',
    );
    label.setAttribute('x', String(point.x));
    label.setAttribute('y', String(point.y + (point.y < 42 ? 24 : -14)));
    label.textContent = valueFormatter(point.value);

    svg.appendChild(marker);
    svg.appendChild(label);
  });

  chartElement.appendChild(svg);
}

function createSmoothPath(points) {
  return points.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;

    const previousPoint = points[index - 1];
    const controlX = (previousPoint.x + point.x) / 2;
    return `${path} C ${controlX} ${previousPoint.y}, ${controlX} ${point.y}, ${point.x} ${point.y}`;
  }, '');
}

function createAreaPath(points, baselineY) {
  const linePath = createSmoothPath(points);
  const firstPoint = points[0];
  const lastPoint = points[points.length - 1];

  return `${linePath} L ${lastPoint.x} ${baselineY} L ${firstPoint.x} ${baselineY} Z`;
}

function createSvgElement(tagName) {
  return document.createElementNS('http://www.w3.org/2000/svg', tagName);
}

function renderBarChart(chartElement, chartData, valueFormatter = formatCompactMoney) {
  const maxValue = Math.max(...chartData.map((item) => item.value), 1);
  const columnWidth = chartElement.classList.contains('compact-bar-chart')
    ? 'minmax(36px, 1fr)'
    : 'minmax(0, 1fr)';

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
