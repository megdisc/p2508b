document.addEventListener('DOMContentLoaded', function() {
    // 初期表示処理
    renderFacilityList();
    renderFinanceAggregation(); // テーブルとサマリーの両方を描画

    // イベントリスナーのセットアップ
    setupEventListeners();
});

function setupEventListeners() {
    // ログイン、ログアウト、画面遷移などの既存のイベントリスナーがあればここにまとめる
}

// 通貨フォーマット用の関数
const formatCurrency = (amount) => `¥${amount.toLocaleString()}`;

// 数値フォーマット用の関数
const formatNumber = (num, unit = '') => `${num.toLocaleString()}${unit}`;


/**
 * 各種設定 > 施設情報設定 > 事業所一覧を描画する
 */
function renderFacilityList() {
    const facilityList = document.getElementById('facility-list');
    if (!facilityList) return;

    facilityList.innerHTML = dummyData.facilities.map(facility => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${facility.officeNumber}</td>
            <td class="py-3 px-4">${facility.officeName}</td>
            <td class="py-3 px-4">${facility.status}</td>
            <td class="py-3 px-4 text-center">
                <button class="detail-button font-bold py-1 px-3 rounded text-sm">詳細</button>
            </td>
        </tr>
    `).join('');
}

/**
 * 各種設定 > スキル設定 > スキル一覧を描画する
 */
function renderSkillList() {
    const skillList = document.getElementById('skill-list');
    if (!skillList) return;

    skillList.innerHTML = dummyData.skills.map(skill => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${skill.genre}</td>
            <td class="py-3 px-4">${skill.category}</td>
            <td class="py-3 px-4">${skill.skillName}</td>
            <td class="py-3 px-4 text-center">
                <button class="detail-button font-bold py-1 px-3 rounded text-sm mr-2">編集</button>
                <button class="danger-button font-bold py-1 px-3 rounded text-sm">削除</button>
            </td>
        </tr>
    `).join('');
}


/**
 * 収支管理 > 収支集計タブの全データを描画する
 */
function renderFinanceAggregation() {
    // サマリーデータの描画
    const summary = dummyData.financialSummaries.aggregation;
    document.getElementById('aggregation-month-display').textContent = `${summary.year}年度${summary.month}月`;
    document.getElementById('aggregation-period-display').textContent = summary.period;
    document.getElementById('aggregation-income').textContent = formatCurrency(summary.income);
    document.getElementById('aggregation-costs').textContent = formatCurrency(summary.costs);
    document.getElementById('aggregation-wages').textContent = formatCurrency(summary.wages);
    document.getElementById('aggregation-reserves').textContent = formatCurrency(summary.reserves);

    // 状態に応じたボタン/ラベル表示のロジック
    const statusContainer = document.getElementById('aggregation-status-container');
    switch (summary.status) {
        case 'unconfirmed':
            statusContainer.innerHTML = '<button class="confirm-button font-bold py-2 px-4 rounded">月次確定</button>';
            break;
        case 'confirmed':
            statusContainer.innerHTML = '<button class="unconfirm-button font-bold py-2 px-4 rounded">確定済</button>';
            break;
        case 'calculating':
            statusContainer.innerHTML = '<span class="status-label-calculating">集計中/暫定値</span>';
            break;
        case 'uncalculated':
            statusContainer.innerHTML = '<span class="status-label-uncalculated">未集計</span>';
            break;
        default:
            statusContainer.innerHTML = '';
    }


    // テーブルデータの描画
    const { businessIncome, productionCosts, wages, reserves } = dummyData.incomeAndExpenditure;
    document.getElementById('business-income-list').innerHTML = businessIncome.map(item => `
        <tr class="border-b hover:bg-gray-50"><td class="py-3 px-4">${item.projectName}</td><td class="py-3 px-4">${item.clientName}</td><td class="py-3 px-4 text-right">${formatCurrency(item.amount)}</td></tr>
    `).join('');
    document.getElementById('production-costs-list').innerHTML = productionCosts.map(item => `
        <tr class="border-b hover:bg-gray-50"><td class="py-3 px-4">${item.projectName}</td><td class="py-3 px-4">${item.subcontractorName}</td><td class="py-3 px-4 text-right">${formatCurrency(item.amount)}</td></tr>
    `).join('');
    document.getElementById('wages-list').innerHTML = wages.map(item => `
        <tr class="border-b hover:bg-gray-50"><td class="py-3 px-4">${item.userName}</td><td class="py-3 px-4 text-right">${formatCurrency(item.amount)}</td></tr>
    `).join('');
    document.getElementById('reserves-list').innerHTML = reserves.map(item => `
        <tr class="border-b hover:bg-gray-50"><td class="py-3 px-4">${item.type}</td><td class="py-3 px-4 text-right">${formatCurrency(item.amount)}</td></tr>
    `).join('');
}

/**
 * 収支管理 > 収支一覧タブの全データを描画する
 */
function renderFinancialSummary() {
    // サマリーデータの描画
    const summary = dummyData.financialSummaries.summary;
    document.getElementById('summary-year-display').textContent = `${summary.year}年度`;
    document.getElementById('summary-period-display').textContent = summary.period;
    document.getElementById('summary-income').textContent = formatCurrency(summary.income);
    document.getElementById('summary-costs').textContent = formatCurrency(summary.costs);
    document.getElementById('summary-wages').textContent = formatCurrency(summary.wages);
    document.getElementById('summary-reserves').textContent = formatCurrency(summary.reserves);

    // テーブルデータの描画
    const list = document.getElementById('financial-summary-list');
    list.innerHTML = dummyData.financialSummary.map(item => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${item.month}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.income)}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.costs)}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.wages)}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.reserves)}</td>
            <td class="py-3 px-4 text-center"><button onclick="showIncomeExpenditureDetail(true)" class="detail-button font-bold py-1 px-3 rounded text-sm">詳細</button></td>
        </tr>
    `).join('');
}

/**
 * 収支管理 > 平均工賃一覧タブの全データを描画する
 */
function renderAverageWages() {
    // サマリーデータの描画
    const summary = dummyData.financialSummaries.averageWage;
    document.getElementById('avg-wage-year-display').textContent = `${summary.year}年度`;
    document.getElementById('avg-wage-period-display').textContent = summary.period;
    document.getElementById('avg-wage-average').textContent = formatCurrency(summary.average);
    document.getElementById('avg-wage-total-wages').textContent = formatCurrency(summary.totalWages);
    document.getElementById('avg-wage-avg-users').textContent = formatNumber(summary.avgUsers, '人');
    document.getElementById('avg-wage-total-users').textContent = formatNumber(summary.totalUsers, '人');
    document.getElementById('avg-wage-open-days').textContent = formatNumber(summary.openDays, '日');

    // テーブルデータの描画
    const list = document.getElementById('average-wage-list');
    list.innerHTML = dummyData.averageWages.map(item => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${item.month}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.average)}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.totalWages)}</td>
            <td class="py-3 px-4 text-right">${formatNumber(item.avgUsers, '人')}</td>
            <td class="py-3 px-4 text-right">${formatNumber(item.totalUsers, '人')}</td>
            <td class="py-3 px-4 text-right">${formatNumber(item.openDays, '日')}</td>
            <td class="py-3 px-4 text-center"><button onclick="showAverageWageDetail(true)" class="detail-button font-bold py-1 px-3 rounded text-sm">詳細</button></td>
        </tr>
    `).join('');
}

/**
 * 収支管理 > 支払い工賃一覧タブの全データを描画する
 */
function renderPaymentList() {
    // サマリーデータの描画
    const summary = dummyData.financialSummaries.payment;
    document.getElementById('payment-month-display').textContent = `${summary.year}年度${summary.month}月`;
    document.getElementById('payment-period-display').textContent = summary.period;
    document.getElementById('payment-total-payment').textContent = formatCurrency(summary.totalPayment);
    document.getElementById('payment-total-wages').textContent = formatCurrency(summary.totalWages);
    document.getElementById('payment-total-deduction').textContent = formatCurrency(summary.totalDeduction);

    // テーブルデータの描画
    const list = document.getElementById('payment-list');
    list.innerHTML = dummyData.paymentList.map(item => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${item.userName}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.payment)}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.wages)}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.deduction)}</td>
            <td class="py-3 px-4 text-center"><button onclick="showPayrollStatement(true)" class="detail-button font-bold py-1 px-3 rounded text-sm">詳細</button></td>
        </tr>
    `).join('');
}

/**
 * 収支管理 > 平均工賃詳細画面のテーブルを描画する
 */
function renderAverageWageDetails() {
    const list = document.getElementById('average-wage-detail-list');
    if(!list) return;

    list.innerHTML = dummyData.averageWageDetails.map(item => `
         <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${item.date}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.average)}</td>
            <td class="py-3 px-4 text-right">${formatCurrency(item.wages)}</td>
            <td class="py-3 px-4 text-right">${formatNumber(item.users, '人')}</td>
            <td class="py-3 px-4 text-center">${item.isOpen}</td>
        </tr>
    `).join('');
}

/**
 * 収支管理 > 収支詳細画面のテーブルを描画する
 */
function renderIncomeExpenditureDetail() {
    const { businessIncome, productionCosts, wages, reserves } = dummyData.incomeAndExpenditure;
    document.getElementById('detail-business-income-list').innerHTML = businessIncome.map(item => `
        <tr class="border-b hover:bg-gray-50"><td class="py-3 px-4">${item.projectName}</td><td class="py-3 px-4">${item.clientName}</td><td class="py-3 px-4 text-right">${formatCurrency(item.amount)}</td></tr>
    `).join('');
    document.getElementById('detail-production-costs-list').innerHTML = productionCosts.map(item => `
        <tr class="border-b hover:bg-gray-50"><td class="py-3 px-4">${item.projectName}</td><td class="py-3 px-4">${item.subcontractorName}</td><td class="py-3 px-4 text-right">${formatCurrency(item.amount)}</td></tr>
    `).join('');
    document.getElementById('detail-wages-list').innerHTML = wages.map(item => `
        <tr class="border-b hover:bg-gray-50"><td class="py-3 px-4">${item.userName}</td><td class="py-3 px-4 text-right">${formatCurrency(item.amount)}</td></tr>
    `).join('');
    document.getElementById('detail-reserves-list').innerHTML = reserves.map(item => `
        <tr class="border-b hover:bg-gray-50"><td class="py-3 px-4">${item.type}</td><td class="py-3 px-4 text-right">${formatCurrency(item.amount)}</td></tr>
    `).join('');
}


// --- 以下、画面遷移などの制御関数 ---

function login() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-wrapper').classList.remove('hidden');
    showScreen('dashboard-screen', document.querySelector('#main-nav a'));
}

function logout() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-wrapper').classList.add('hidden');
}

function showScreen(screenId, navLink, isFinance = false) {
    document.querySelectorAll('.screen-content').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');
    document.querySelectorAll('#main-nav .nav-link').forEach(link => link.classList.remove('active'));
    navLink.classList.add('active');
    if (isFinance) {
        showFinanceTab('finance-aggregation-wrapper', document.querySelector('#finance-sub-nav a'));
    }
}

function showSettingsTab(tabId, navLink) {
    document.querySelectorAll('.settings-tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('#settings-sub-nav .sub-nav-link').forEach(link => link.classList.remove('active'));
    navLink.classList.add('active');

    // スキル設定タブが選択されたときに関数を呼び出す
    if (tabId === 'settings-skills') {
        renderSkillList();
    }
}

function showFinanceTab(tabId, navLink) {
    document.querySelectorAll('.finance-tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('#finance-sub-nav .sub-nav-link').forEach(link => link.classList.remove('active'));
    navLink.classList.add('active');

    switch(tabId) {
        case 'finance-aggregation-wrapper':
            renderFinanceAggregation();
            break;
        case 'finance-summary-wrapper':
            renderFinancialSummary();
            break;
        case 'finance-average-wage-wrapper':
            renderAverageWages();
            break;
        case 'finance-payment-list-wrapper':
            renderPaymentList();
            break;
    }
}

function showIncomeExpenditureDetail(show) {
    if (show) {
        renderIncomeExpenditureDetail();
        document.getElementById('finance-summary').classList.add('hidden');
        document.getElementById('finance-income-expenditure-detail').classList.remove('hidden');
    } else {
        document.getElementById('finance-summary').classList.remove('hidden');
        document.getElementById('finance-income-expenditure-detail').classList.add('hidden');
    }
}

function showAverageWageDetail(show) {
    if (show) {
        renderAverageWageDetails();
        document.getElementById('finance-average-wage-list').classList.add('hidden');
        document.getElementById('finance-average-wage-detail').classList.remove('hidden');
    } else {
        document.getElementById('finance-average-wage-list').classList.remove('hidden');
        document.getElementById('finance-average-wage-detail').classList.add('hidden');
    }
}

function showPayrollStatement(show) {
    if (show) {
        document.getElementById('finance-payment-list').classList.add('hidden');
        document.getElementById('finance-payroll-statement').classList.remove('hidden');
    } else {
        document.getElementById('finance-payment-list').classList.remove('hidden');
        document.getElementById('finance-payroll-statement').classList.add('hidden');
    }
}


function changeMonth(offset) {
    const summary = dummyData.financialSummaries.aggregation;
    const date = new Date(summary.year, summary.month - 1, 1);
    date.setMonth(date.getMonth() + offset);
    
    summary.year = date.getFullYear();
    summary.month = date.getMonth() + 1;
    const startDate = new Date(summary.year, summary.month - 1, 1);
    const endDate = new Date(summary.year, summary.month, 0);
    summary.period = `${startDate.toLocaleDateString('ja-JP')}～${endDate.toLocaleDateString('ja-JP')}`;

    // 例：過去の月は 'confirmed', それ以外は 'unconfirmed' にする
    const now = new Date();
    if (date.getFullYear() < now.getFullYear() || (date.getFullYear() === now.getFullYear() && date.getMonth() < now.getMonth())) {
        summary.status = 'confirmed';
    } else {
        summary.status = 'unconfirmed';
    }

    renderFinanceAggregation();
}