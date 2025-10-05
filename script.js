// Store the last active screen to return to it
let lastActiveScreenId = 'dashboard-screen';

// --- 収支集計関連のスクリプト ---
let currentDate = new Date(2025, 9, 1); // 2025年10月を初期値とする (月は0から始まるため9を指定)

function renderAggregationPage() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);

    document.getElementById('aggregation-month-display').textContent = `${year}年度${month}月`;
    document.getElementById('aggregation-period-display').textContent = `${year}年${month}月${firstDay.getDate()}日～${year}年${month}月${lastDay.getDate()}日`;
    
    const confirmButton = document.getElementById('aggregation-confirm-button');
    const now = new Date(2025, 9, 1);
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    let statusText = '';
    let isClickable = false;

    if (currentDate > currentMonthStart) {
        statusText = '未集計';
        isClickable = false;
    } else if (currentDate.getTime() === currentMonthStart.getTime()) {
        statusText = '集計中/暫定値';
        isClickable = false;
    } else {
        if (currentDate.getFullYear() === 2025 && currentDate.getMonth() === 8) { // 2025年9月
            statusText = '月次確定';
            isClickable = true;
        } else { // 2025年8月以前
            statusText = '確定済';
            isClickable = false;
        }
    }
    
    confirmButton.textContent = statusText;
    confirmButton.disabled = !isClickable;

    confirmButton.classList.remove('danger-button', 'disabled-button');

    if (isClickable) {
        confirmButton.classList.add('danger-button');
    } else {
        confirmButton.classList.add('disabled-button');
    }
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderAggregationPage();
}
// --- ここまで ---

function showScreen(screenId, navElement, isFinanceScreen = false) {
    document.querySelectorAll('.screen-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(screenId).classList.remove('hidden');

    if (navElement) {
        document.querySelectorAll('#main-nav .nav-link').forEach(el => el.classList.remove('active'));
        navElement.classList.add('active');
        if (!screenId.includes('-detail-')) {
           lastActiveScreenId = screenId;
        }
    }
    
    if (screenId === 'settings-screen') {
         const firstSettingsTab = document.querySelector('#settings-sub-nav a');
         showSettingsTab('settings-facility', firstSettingsTab);
    }

    if (isFinanceScreen) {
         const financeAggregationTab = document.querySelector('#finance-sub-nav a');
         showFinanceTab('finance-aggregation-wrapper', financeAggregationTab, true);
    }
}

function login() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-wrapper').classList.remove('hidden');
    showScreen(lastActiveScreenId, document.querySelector('#main-nav .nav-link.active'));
}

function logout() {
    document.getElementById('app-wrapper').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
}

function showSettingsTab(tabId, navElement) {
    document.querySelectorAll('.settings-tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('#settings-sub-nav .sub-nav-link').forEach(el => el.classList.remove('active'));
    navElement.classList.add('active');
}


function showFinanceTab(tabId, navElement, forceReset = false) {
    document.querySelectorAll('.finance-tab-content').forEach(el => el.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');

    document.querySelectorAll('#finance-sub-nav .sub-nav-link').forEach(el => el.classList.remove('active'));
    navElement.classList.add('active');
    
    if ((navElement && navElement.textContent === '収支集計') || forceReset) {
        currentDate = new Date(2025, 9, 1);
        renderAggregationPage();
    }

    showPayrollStatement(false);
    showIncomeExpenditureDetail(false);
    showAverageWageDetail(false);
}

function showPayrollStatement(show) {
    const list = document.getElementById('finance-payment-list');
    const statement = document.getElementById('finance-payroll-statement');
    list.classList.toggle('hidden', show);
    statement.classList.toggle('hidden', !show);
}

function showIncomeExpenditureDetail(show) {
    const summary = document.getElementById('finance-summary');
    const detail = document.getElementById('finance-income-expenditure-detail');
    summary.classList.toggle('hidden', show);
    detail.classList.toggle('hidden', !show);
}

function showAverageWageDetail(show) {
    const list = document.getElementById('finance-average-wage-list');
    const detail = document.getElementById('finance-average-wage-detail');
    list.classList.toggle('hidden', show);
    detail.classList.toggle('hidden', !show);
}


// Initial state
document.addEventListener('DOMContentLoaded', () => {
     document.getElementById('app-wrapper').classList.add('hidden');
     document.getElementById('login-screen').classList.remove('hidden');
     renderAggregationPage();
});