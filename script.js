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
                <button onclick="showFacilityDetailScreen(true)" class="detail-button font-bold py-1 px-3 rounded text-sm">詳細</button>
            </td>
        </tr>
    `).join('');
}

/**
 * 各種設定 > アカウント設定タブのテーブルを描画する
 */
function renderAccountList() {
    const accountList = document.getElementById('account-list');
    if (!accountList) return;

    accountList.innerHTML = dummyData.accounts.map(account => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${account.role}</td>
            <td class="py-3 px-4">${account.userName}</td>
            <td class="py-3 px-4">${account.email}</td>
            <td class="py-3 px-4 text-center">
                <button class="detail-button font-bold py-1 px-3 rounded text-sm mr-2 edit-account-btn" data-email="${account.email}">編集</button>
                <button class="danger-button font-bold py-1 px-3 rounded text-sm mr-2 password-reset-btn" data-email="${account.email}">ﾊﾟｽﾜｰﾄﾞﾘｾｯﾄ</button>
                <button class="danger-button font-bold py-1 px-3 rounded text-sm delete-account-btn" data-email="${account.email}">削除</button>
            </td>
        </tr>
    `).join('');
}

/**
 * =================================================================
 * スキル設定 機能
 * * 担当ファイル： script.js
 * 概要：
 * スキル設定タブ内のUIをアコーディオン形式で動的に生成し、
 * ユーザーによるジャンル、カテゴリ、スキルの追加、編集、削除
 * といった操作を可能にするためのすべてのロジックを記述します。
 * =================================================================
 */

/**
 * ユーティリティ関数：スキルデータを階層構造に変換する
 * @param {Array} skills - フラットなスキルの配列
 * @returns {Object} - ジャンル > カテゴリ > スキルリスト の階層にグループ化されたオブジェクト
 * * 元のデータ: [{ genre: "A", category: "B", skillName: "C" }, ...]
 * 変換後のデータ: { "A": { "B": ["C", ...] } }
 */
function groupSkills(skills) {
    return skills.reduce((acc, skill) => {
        const { genre, category, skillName } = skill;
        if (!acc[genre]) {
            acc[genre] = {};
        }
        if (!acc[genre][category]) {
            acc[genre][category] = [];
        }
        acc[genre][category].push(skillName);
        return acc;
    }, {});
}

/**
 * メイン描画関数：スキル一覧のUIを構築する
 * * 処理の流れ：
 * 1. `dummyData.skills`からスキルデータを取得
 * 2. `groupSkills`関数を使い、データを扱いやすい階層構造に変換
 * 3. 階層構造を元に、各ジャンルのアコーディオンHTMLを生成 (`createGenreAccordion`を呼び出す)
 * 4. 生成したHTMLを`#skill-accordion-container`に挿入して画面に表示する
 */
function renderSkillList() {
    const container = document.getElementById('skill-accordion-container');
    if (!container) return;

    const groupedSkills = groupSkills(dummyData.skills);
    let html = '';

    for (const genre in groupedSkills) {
        html += createGenreAccordion(genre, groupedSkills[genre]);
    }
    container.innerHTML = html;
}

/**
 * HTML生成関数：ジャンルのアコーディオン部分を作成
 * @param {string} genre - ジャンル名
 * @param {Object} categories - そのジャンルに属するカテゴリとスキルのオブジェクト
 * @returns {string} - ジャンル一つ分のHTML文字列
 */
function createGenreAccordion(genre, categories) {
    let categoryHtml = '';
    for (const category in categories) {
        categoryHtml += createCategoryAccordion(category, categories[category]);
    }

    return `
        <div class="genre-item border rounded" data-genre="${genre}">
            <div class="accordion-header bg-[var(--main-color)] text-white p-3 flex justify-between items-center">
                <div class="flex-grow flex items-center">
                    <span class="cursor-pointer accordion-toggle mr-2">▼</span>
                    <input type="text" value="${genre}" class="font-bold text-lg text-white bg-transparent border-b border-transparent focus:border-gray-400 outline-none w-full">
                </div>
                <button class="text-xs p-1 rounded delete-genre-btn border border-white text-white hover:bg-white hover:text-[var(--main-color)] transition-colors">ジャンル削除</button>
            </div>
            <div class="accordion-content hidden p-3 pl-6 space-y-2">
                ${categoryHtml}
                <div class="text-center mt-2">
                    <button class="secondary-button-outline text-xs py-1 px-2 rounded add-category-btn">+ カテゴリ追加</button>
                </div>
            </div>
        </div>
    `;
}

/**
 * HTML生成関数：カテゴリのアコーディオン部分を作成
 * @param {string} category - カテゴリ名
 * @param {Array} skills - そのカテゴリに属するスキルの配列
 * @returns {string} - カテゴリ一つ分のHTML文字列
 */
function createCategoryAccordion(category, skills) {
    let skillHtml = '<ul class="list-disc pl-4 space-y-2 skill-list">';
    skills.forEach(skillName => {
        skillHtml += createSkillItem(skillName);
    });
    // ★変更点：「スキル追加」ボタンをdivで囲み、中央配置
    skillHtml += '</ul><div class="text-center mt-2"><button class="secondary-button-outline text-xs py-1 px-2 rounded add-skill-btn">+ スキル追加</button></div>';

    return `
        <div class="category-item border rounded" data-category="${category}">
            <div class="accordion-header bg-gray-50 p-3 flex justify-between items-center">
                <div class="flex-grow flex items-center">
                    <span class="cursor-pointer accordion-toggle mr-2">▼</span>
                    <input type="text" value="${category}" class="font-semibold text-md bg-transparent border-b border-transparent focus:border-gray-400 outline-none w-full">
                </div>
                <button class="danger-button-outline text-xs p-1 rounded delete-category-btn">カテゴリ削除</button>
            </div>
            <div class="accordion-content hidden p-3 pl-6">
                ${skillHtml}
            </div>
        </div>
    `;
}

/**
 * HTML生成関数：スキル項目（li要素）を作成
 * @param {string} skillName - スキル名
 * @returns {string} - スキル一つ分のHTML文字列
 */
function createSkillItem(skillName) {
    return `
        <li class="skill-item flex justify-between items-center">
            <input type="text" value="${skillName}" class="bg-transparent border-b border-transparent focus:border-gray-400 outline-none w-full">
            <button class="danger-button-outline text-xs p-1 rounded delete-skill-btn">スキル削除</button>
        </li>
    `;
}

/**
 * イベントリスナー設定関数
 * * 概要：
 * スキル設定タブ内でのすべてのクリックイベントを管理します。
 * 「イベント委譲」という手法を使い、親要素(#settings-skills)にのみ
 * イベントリスナーを設定し、クリックされた要素のクラス名を見て処理を分岐させます。
 * これにより、動的に追加された要素にもイベントが適用されます。
 */
function setupSkillSettingsEventListeners() {
    const container = document.getElementById('settings-skills');
    if (!container) return;

    // 「ジャンル追加」ボタンの処理
    const addGenreBtn = document.getElementById('add-genre-btn');
    if(addGenreBtn) {
        addGenreBtn.addEventListener('click', () => {
            const newGenreHtml = createGenreAccordion('新しいジャンル', {});
            document.getElementById('skill-accordion-container').insertAdjacentHTML('beforeend', newGenreHtml);
        });
    }

    // アコーディオンコンテナ内のクリックイベントを監視
    container.addEventListener('click', function(event) {
        const target = event.target; // クリックされた要素を取得

        // 分岐処理：クリックされた要素のクラス名に応じて処理を実行
        
        // アコーディオン開閉
        if (target.classList.contains('accordion-toggle')) {
            const header = target.closest('.accordion-header');
            const content = header.nextElementSibling;
            content.classList.toggle('hidden');
            target.textContent = content.classList.contains('hidden') ? '▼' : '▲';
            return; 
        }

        // 各種削除ボタン
        if (target.classList.contains('delete-genre-btn')) {
            target.closest('.genre-item').remove();
        }
        if (target.classList.contains('delete-category-btn')) {
            target.closest('.category-item').remove();
        }
        if (target.classList.contains('delete-skill-btn')) {
            target.closest('.skill-item').remove();
        }

        // 各種追加ボタン
        if (target.classList.contains('add-category-btn')) {
            const newCategoryHtml = createCategoryAccordion('新しいカテゴリ', []);
            // ★変更なし：ボタンの親divの前に挿入
            target.closest('div').insertAdjacentHTML('beforebegin', newCategoryHtml);
        }
        
        // ★★★★★ ここからが修正箇所です ★★★★★
        if (target.classList.contains('add-skill-btn')) {
            const newSkillHtml = createSkillItem('新しいスキル');
            // 修正前： target.previousElementSibling;
            // 修正後： クリックしたボタンの親(div)の、さらに前の要素(ul)を探す
            const skillList = target.closest('div').previousElementSibling;

            if (skillList && skillList.classList.contains('skill-list')) {
                skillList.insertAdjacentHTML('beforeend', newSkillHtml);
            }
        }
        // ★★★★★ ここまでが修正箇所です ★★★★★
    });
}

/**
 * 初期化処理
 * Webページが読み込まれた後に、スキル設定タブの描画と
 * イベントリスナーの設定を実行します。
 */
document.addEventListener('DOMContentLoaded', function() {
    // ... (ファイル内の他の既存の初期化処理はそのまま残してください) ...

    // スキル設定タブの初期化処理
    const skillTabContainer = document.getElementById('settings-skills');
    if(skillTabContainer) {
        renderSkillList(); // 初回のアコーディオン描画
        setupSkillSettingsEventListeners(); // イベントリスナーの設定
    }
});

// 既存のDOMContentLoadedイベントリスナーに関数を追加
document.addEventListener('DOMContentLoaded', function() {
    // （...既存の処理...）
    setupAccordionEventListeners(); // この行を追加
});

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

/**
 * =================================================================
 * ▼▼▼▼▼ ここから追加 ▼▼▼▼▼
 * 事業所情報設定タブ内の画面表示を切り替える
 * =================================================================
 */
function showFacilityDetailScreen(show) {
    const listWrapper = document.getElementById('facility-list-wrapper');
    const detailWrapper = document.getElementById('facility-detail-wrapper');

    if (show) {
        listWrapper.classList.add('hidden');
        detailWrapper.classList.remove('hidden');
    } else {
        listWrapper.classList.remove('hidden');
        detailWrapper.classList.add('hidden');
    }
}
/**
 * ▲▲▲▲▲ ここまで追加 ▲▲▲▲▲
 * =================================================================
 */

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
    
    // ▼▼▼▼▼ ここから変更 ▼▼▼▼▼
    if (tabId === 'settings-facility') {
        showFacilityDetailScreen(false); // 事業所一覧をデフォルトで表示
    }
    // ▲▲▲▲▲ ここまで変更 ▲▲▲▲▲
    if (tabId === 'settings-skills') {
        renderSkillList();
    }
    if (tabId === 'settings-accounts') {
        renderAccountList();
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

// =================================================================
// アカウント設定モーダル機能
// =================================================================

/**
 * アカウント編集モーダルを開く
 * @param {object | null} account - 編集するアカウントオブジェクト。新規作成時はnull
 */
function openAccountModal(account = null) {
    const modal = document.getElementById('account-modal');
    const modalTitle = document.getElementById('account-modal-title');
    const form = document.getElementById('account-form');
    
    form.reset(); // フォームをリセット
    document.getElementById('account-id').value = '';

    if (account) {
        // 編集の場合
        modalTitle.textContent = 'アカウント編集';
        document.getElementById('account-id').value = account.email; // emailをIDとして使用
        document.getElementById('account-role').value = account.role;
        document.getElementById('account-username').value = account.userName;
        document.getElementById('account-email').value = account.email;
        document.getElementById('account-email').readOnly = true; // メールアドレスは変更不可
    } else {
        // 新規作成の場合
        modalTitle.textContent = 'アカウント新規作成';
        document.getElementById('account-email').readOnly = false;
    }
    
    modal.classList.remove('hidden');
}

/**
 * アカウント編集モーダルを閉じる
 */
function closeAccountModal() {
    const modal = document.getElementById('account-modal');
    modal.classList.add('hidden');
}

/**
 * アカウント設定関連のイベントリスナーをセットアップする
 */
function setupAccountSettingsEventListeners() {
    // 「新規作成」ボタン
    document.getElementById('open-account-modal-btn').addEventListener('click', () => {
        openAccountModal();
    });

    // モーダルを閉じるボタン
    document.getElementById('close-account-modal-btn').addEventListener('click', closeAccountModal);
    document.getElementById('cancel-account-modal-btn').addEventListener('click', closeAccountModal);

    // テーブル内のボタン（イベント委譲）
    const accountList = document.getElementById('account-list');
    if (accountList) {
        accountList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-account-btn')) {
                const email = e.target.dataset.email;
                const accountToEdit = dummyData.accounts.find(acc => acc.email === email);
                if (accountToEdit) {
                    openAccountModal(accountToEdit);
                }
            }

            if (e.target.classList.contains('delete-account-btn')) {
                // ToDo: 削除処理を実装
                alert('削除機能は未実装です。');
            }
        });
    }

    // フォームの送信処理
    document.getElementById('account-form').addEventListener('submit', (e) => {
        e.preventDefault();
        // ToDo: 保存処理を実装
        alert('保存機能は未実装です。');
        closeAccountModal();
    });
}


// 既存のDOMContentLoadedイベントリスナーにアカウント設定のイベントリスナーセットアップを追加
document.addEventListener('DOMContentLoaded', function() {
    setupAccountSettingsEventListeners();
});

/**
 * =================================================================
 * 差引工賃設定 機能
 * =================================================================
 */

/**
 * 差引工賃設定タブのイベントリスナーをセットアップする
 */
function setupPaymentWageSettingsEventListeners() {
    const container = document.getElementById('settings-payment-wage');
    if (!container) return;

    // ベース単価テーブルの新しい行HTML
    const createBasePriceRowHtml = () => `
        <tr>
            <td class="py-2 px-2"><input type="text" class="border rounded w-full px-2 py-1"></td>
            <td class="py-2 px-2"><input type="number" class="border rounded w-full px-2 py-1"></td>
            <td class="py-2 px-2"><input type="text" class="border rounded w-full px-2 py-1"></td>
            <td class="py-2 px-2 text-center">
                <button class="danger-button font-bold py-1 px-3 rounded text-sm delete-row-btn">削除</button>
            </td>
        </tr>
    `;

    // 加算・控除テーブルの新しい行HTML
    const createAdditionDeductionRowHtml = () => `
        <tr>
            <td class="py-2 px-2"><input type="text" class="border rounded w-full px-2 py-1"></td>
            <td class="py-2 px-2"><input type="number" class="border rounded w-full px-2 py-1"></td>
            <td class="py-2 px-2"><input type="text" class="border rounded w-full px-2 py-1"></td>
            <td class="py-2 px-2 text-center">
                <button class="danger-button font-bold py-1 px-3 rounded text-sm delete-row-btn">削除</button>
            </td>
        </tr>
    `;

    // 「ベース単価」の行追加
    const addBasePriceBtn = document.getElementById('add-base-price-row-btn');
    const basePriceTableBody = document.getElementById('base-price-table-body');
    if (addBasePriceBtn && basePriceTableBody) {
        addBasePriceBtn.addEventListener('click', () => {
            basePriceTableBody.insertAdjacentHTML('beforeend', createBasePriceRowHtml());
        });
    }

    // イベント委譲で追加・削除ボタンを処理
    container.addEventListener('click', (e) => {
        const target = e.target;

        // 行削除ボタン
        if (target.classList.contains('delete-row-btn')) {
            target.closest('tr').remove();
            return;
        }

        // 行追加ボタン（加算・控除）
        if (target.classList.contains('add-row-btn')) {
            const targetTableId = target.dataset.targetTable;
            const tableBody = document.getElementById(targetTableId);
            if (tableBody) {
                tableBody.insertAdjacentHTML('beforeend', createAdditionDeductionRowHtml());
            }
            return;
        }
    });
}

// 既存のDOMContentLoadedイベントリスナーにセットアップ関数を追加
document.addEventListener('DOMContentLoaded', function() {
    // ... (他の既存のセットアップ関数はそのまま) ...
    setupPaymentWageSettingsEventListeners();
});

/**
 * =================================================================
 * 事業所カレンダー編集モーダル機能
 * =================================================================
 */

/**
 * カレンダー編集モーダルを開く
 * @param {string} day - 選択された日付
 */
function openCalendarModal(day) {
    const modal = document.getElementById('calendar-modal');
    const modalTitle = document.getElementById('calendar-modal-title');
    const dateInput = document.getElementById('calendar-date');
    
    // モーダルのタイトルと隠しフィールドに日付を設定
    modalTitle.textContent = `日付設定（10月${day}日）`; // 仮で月を固定
    dateInput.value = day;
    
    // TODO: 選択した日付の現在の状態（開所/閉所、時間）をフォームに反映する処理をここに追加
    
    modal.classList.remove('hidden');
}

/**
 * カレンダー編集モーダルを閉じる
 */
function closeCalendarModal() {
    const modal = document.getElementById('calendar-modal');
    modal.classList.add('hidden');
}

/**
 * 開所/閉所の選択に応じて時刻ピッカーの表示/非表示を切り替える
 * @param {boolean} show - trueなら表示、falseなら非表示
 */
function toggleTimePicker(show) {
    const timePickerWrapper = document.getElementById('time-picker-wrapper');
    if (show) {
        timePickerWrapper.classList.remove('hidden');
    } else {
        timePickerWrapper.classList.add('hidden');
    }
}

// フォームの送信イベント（ダミー）
document.addEventListener('DOMContentLoaded', function() {
    const calendarForm = document.getElementById('calendar-form');
    if(calendarForm) {
        calendarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: 保存処理を実装
            alert('保存機能は未実装です。');
            closeCalendarModal();
        });
    }
});

/**
 * =================================================================
 * 事業所カレンダー 月変更機能
 * =================================================================
 */

// 現在表示しているカレンダーの年月を保持する変数
let currentCalendarDate = new Date(2025, 9, 1); // 2025年10月を初期値とする

/**
 * カレンダーの表示を更新する
 */
function renderBusinessCalendar() {
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarBody = document.getElementById('calendar-body');

    if (!calendarMonthYear || !calendarBody) return;

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth(); // 0-11

    // 年月表示を更新
    calendarMonthYear.textContent = `${year}年 ${month + 1}月`;

    const firstDay = new Date(year, month, 1).getDay(); // 0:Sun, 1:Mon...
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '';
    let day = 1;
    for (let i = 0; i < 6; i++) { // 最大6週
        html += '<tr class="border-b">';
        for (let j = 0; j < 7; j++) { // jが曜日を表す (0:日曜, 1:月曜, ..., 6:土曜)
            if (i === 0 && j < firstDay) {
                html += '<td class="py-3 px-4 h-32 text-center border align-top"></td>';
            } else if (day > daysInMonth) {
                html += '<td class="py-3 px-4 h-32 text-center border align-top"></td>';
            } else {
                let content = '';
                let cellClass = 'cursor-pointer hover:bg-gray-100';

                // ▼▼▼▼▼ 修正箇所 ▼▼▼▼▼
                // 曜日を判定する条件を、日付(day)ではなく列のインデックス(j)に変更しました。
                // jが0(日曜)または6(土曜)の場合に「閉所」とします。
                if (j === 0 || j === 6) { 
                    content = `<div class="font-bold">${day}</div><div class="font-bold">閉所</div>`;
                    cellClass += ' bg-[var(--auxiliary-color)] hover:bg-gray-200';
                } else {
                    content = `<div class="font-bold">${day}</div><div class="text-sm"><div>10:00</div><div>～</div><div>16:00</div></div>`;
                }
                // ▲▲▲▲▲ 修正箇所 ▲▲▲▲▲

                // 今日の日付をハイライト（仮）
                const today = new Date();
                if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                     content = `<div class="font-bold inline-block bg-[var(--accent-color)] rounded-full w-6 h-6 leading-6">${day}</div><div class="text-sm"><div>10:00</div><div>～</div><div>16:00</div></div>`;
                }

                html += `<td onclick="openCalendarModal('${day}')" class="py-3 px-4 h-32 text-center border align-top ${cellClass}">${content}</td>`;
                day++;
            }
        }
        html += '</tr>';
        if (day > daysInMonth) break;
    }
    calendarBody.innerHTML = html;
}

/**
 * カレンダーの月を変更する
 * @param {number} offset - 1で翌月、-1で前月
 */
function changeCalendarMonth(offset) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset);
    renderBusinessCalendar();
}

// ページ読み込み時にカレンダーを初期描画
document.addEventListener('DOMContentLoaded', function() {
    renderBusinessCalendar();
});