document.addEventListener('DOMContentLoaded', function() {
    // --- 初期表示処理 ---
    renderFacilityList();
    renderFinanceAggregation(); // テーブルとサマリーの両方を描画
    renderCustomerList(); // 顧客一覧の初期描画
    renderSubcontractorList(); // 外注先一覧の初期描画
    renderUserList(); // 利用者一覧の初期描画
    renderProjectList(); // 案件一覧の初期描画

    // --- イベントリスナーのセットアップ ---
    setupEventListeners(); // ログイン、ログアウトなど汎用的なものをまとめる想定
    setupClientManagementEventListeners(); // 取引先管理画面のイベントリスナーを追加
    setupUserDetailEventListeners(); // 利用者詳細画面のイベントリスナーを追加

    // スキル設定タブの初期化処理
    const skillTabContainer = document.getElementById('settings-skills');
    if(skillTabContainer) {
        renderSkillList(); // 初回のアコーディオン描画
        setupSkillSettingsEventListeners(); // イベントリスナーの設定
    }
    
    // アカウント設定のイベントリスナーセットアップ
    setupAccountSettingsEventListeners();
    
    // 差引工賃設定のイベントリスナーセットアップ
    setupPaymentWageSettingsEventListeners();
    
    // 事業所カレンダーの初期描画
    renderBusinessCalendar();

    // カレンダーモーダルのフォーム送信イベント
    const calendarForm = document.getElementById('calendar-form');
    if(calendarForm) {
        calendarForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // TODO: 保存処理を実装
            alert('保存機能は未実装です。');
            closeCalendarModal();
        });
    }

    // 【追加】利用者個別カレンダーのモーダルフォーム送信イベント
    const userAttendanceForm = document.getElementById('user-attendance-form');
    if (userAttendanceForm) {
        userAttendanceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('保存機能は未実装です。');
            closeUserAttendanceModal();
        });
    }
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
 * =================================================================
 */

/**
 * ユーティリティ関数：スキルデータを階層構造に変換する
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
 */
function createCategoryAccordion(category, skills) {
    let skillHtml = '<ul class="list-disc pl-4 space-y-2 skill-list">';
    skills.forEach(skillName => {
        skillHtml += createSkillItem(skillName);
    });
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
 * 【利用者詳細用】HTML生成関数：ジャンルのアコーディオン部分を作成（表示のみ）
 */
function createUserSkillGenreAccordion(genre, categories) {
    let categoryHtml = '';
    for (const category in categories) {
        categoryHtml += createUserSkillCategoryAccordion(category, categories[category]);
    }

    return `
        <div class="genre-item border rounded" data-genre="${genre}">
            <div class="accordion-header bg-[var(--main-color)] text-white p-3 flex justify-between items-center cursor-pointer">
                <div class="flex-grow flex items-center">
                    <span class="accordion-toggle mr-2">▼</span>
                    <span class="font-bold text-lg">${genre}</span>
                </div>
            </div>
            <div class="accordion-content hidden p-3 pl-6 space-y-2">
                ${categoryHtml}
            </div>
        </div>
    `;
}

/**
 * 【利用者詳細用】HTML生成関数：カテゴリのアコーディオン部分を作成（表示のみ）
 */
function createUserSkillCategoryAccordion(category, skills) {
    let skillHtml = '<ul class="list-disc pl-4 space-y-2 skill-list">';
    skills.forEach(skill => {
        skillHtml += createUserSkillItem(skill);
    });
    skillHtml += '</ul>';

    return `
        <div class="category-item border rounded" data-category="${category}">
            <div class="accordion-header bg-gray-50 p-3 flex justify-between items-center cursor-pointer">
                <div class="flex-grow flex items-center">
                    <span class="accordion-toggle mr-2">▼</span>
                    <span class="font-semibold text-md">${category}</span>
                </div>
            </div>
            <div class="accordion-content hidden p-3 pl-6">
                ${skillHtml}
            </div>
        </div>
    `;
}

/**
 * 【利用者詳細用】HTML生成関数：スキル項目（li要素）を作成（表示のみ、Lv選択付き）
 */
function createUserSkillItem(skill) {
    const skillName = skill.skillName;
    const level = skill.level || 1;

    let options = '';
    for (let i = 1; i <= 5; i++) {
        options += `<option value="${i}" ${i === level ? 'selected' : ''}>${i}</option>`;
    }

    return `
        <li class="skill-item flex justify-between items-center">
            <span>${skillName}</span>
            <div class="flex items-center">
                <label class="mr-2 text-sm">Lv.</label>
                <select class="border rounded px-2 py-1 text-sm">
                    ${options}
                </select>
            </div>
        </li>
    `;
}


/**
 * スキル設定タブのイベントリスナー設定関数
 */
function setupSkillSettingsEventListeners() {
    const container = document.getElementById('settings-skills');
    if (!container) return;

    const addGenreBtn = document.getElementById('add-genre-btn');
    if(addGenreBtn) {
        addGenreBtn.addEventListener('click', () => {
            const newGenreHtml = createGenreAccordion('新しいジャンル', {});
            document.getElementById('skill-accordion-container').insertAdjacentHTML('beforeend', newGenreHtml);
        });
    }

    container.addEventListener('click', function(event) {
        const target = event.target;

        if (target.classList.contains('accordion-toggle')) {
            const header = target.closest('.accordion-header');
            const content = header.nextElementSibling;
            content.classList.toggle('hidden');
            target.textContent = content.classList.contains('hidden') ? '▼' : '▲';
            return; 
        }

        if (target.classList.contains('delete-genre-btn')) {
            target.closest('.genre-item').remove();
        }
        if (target.classList.contains('delete-category-btn')) {
            target.closest('.category-item').remove();
        }
        if (target.classList.contains('delete-skill-btn')) {
            target.closest('.skill-item').remove();
        }

        if (target.classList.contains('add-category-btn')) {
            const newCategoryHtml = createCategoryAccordion('新しいカテゴリ', []);
            target.closest('div').insertAdjacentHTML('beforebegin', newCategoryHtml);
        }
        
        if (target.classList.contains('add-skill-btn')) {
            const newSkillHtml = createSkillItem('新しいスキル');
            const skillList = target.closest('div').previousElementSibling;

            if (skillList && skillList.classList.contains('skill-list')) {
                skillList.insertAdjacentHTML('beforeend', newSkillHtml);
            }
        }
    });
}

/**
 * =================================================================
 * 取引先管理 機能
 * =================================================================
 */

/**
 * 取引先管理画面のイベントリスナーをセットアップする
 */
function setupClientManagementEventListeners() {
    const container = document.getElementById('client-list-screen');
    if (!container) return;

    const createNewRowHtml = (placeholder) => `
        <tr class="border-b">
            <td class="py-2 px-2">
                <input type="text" placeholder="${placeholder}" class="border rounded w-full px-2 py-1">
            </td>
            <td class="py-2 px-2 text-center">
                <button class="danger-button font-bold py-1 px-3 rounded text-sm delete-client-row-btn">削除</button>
            </td>
        </tr>
    `;

    container.addEventListener('click', (e) => {
        const target = e.target;

        if (target.classList.contains('add-client-row-btn')) {
            const targetTableId = target.dataset.targetTable;
            const tableBody = document.getElementById(targetTableId);
            if (tableBody) {
                const placeholder = targetTableId === 'customer-list-body' ? '顧客名称' : '外注先名称';
                tableBody.insertAdjacentHTML('beforeend', createNewRowHtml(placeholder));
            }
            return;
        }

        if (target.classList.contains('delete-client-row-btn')) {
            target.closest('tr').remove();
            return;
        }
    });
}

/**
 * 取引先管理 > 顧客一覧を描画する
 */
function renderCustomerList() {
    const tableBody = document.getElementById('customer-list-body');
    if (!tableBody) return;

    const customers = dummyData.customers || [];

    tableBody.innerHTML = customers.map(customer => `
        <tr class="border-b">
            <td class="py-2 px-2">
                <input type="text" value="${customer.customerName}" class="border rounded w-full px-2 py-1">
            </td>
            <td class="py-2 px-2 text-center">
                <button class="danger-button font-bold py-1 px-3 rounded text-sm delete-client-row-btn">削除</button>
            </td>
        </tr>
    `).join('');
}

/**
 * 取引先管理 > 外注先一覧を描画する
 */
function renderSubcontractorList() {
    const tableBody = document.getElementById('subcontractor-list-body');
    if (!tableBody) return;

    const subcontractors = dummyData.subcontractors || [];

    tableBody.innerHTML = subcontractors.map(subcontractor => `
        <tr class="border-b">
            <td class="py-2 px-2">
                <input type="text" value="${subcontractor.subcontractorName}" class="border rounded w-full px-2 py-1">
            </td>
            <td class="py-2 px-2 text-center">
                <button class="danger-button font-bold py-1 px-3 rounded text-sm delete-client-row-btn">削除</button>
            </td>
        </tr>
    `).join('');
}

/**
 * =================================================================
 * 利用者管理 機能
 * =================================================================
 */

/**
 * 利用者管理 > 利用者一覧を描画する
 */
function renderUserList() {
    const userList = document.getElementById('user-list');
    if (!userList) return;

    const users = dummyData.users || [];

    userList.innerHTML = users.map(user => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${user.userName}</td>
            <td class="py-3 px-4">${user.status}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="showScreen('user-detail-screen')" class="detail-button font-bold py-1 px-3 rounded text-sm">詳細</button>
            </td>
        </tr>
    `).join('');
}

/**
 * 利用者管理 > 利用者詳細 > スキル一覧を描画する
 */
function renderUserSkillList() {
    const container = document.getElementById('user-skill-accordion-container');
    if (!container) return;

    const userSkills = dummyData.users[0].skills || [];
    
    const groupedSkills = userSkills.reduce((acc, skill) => {
        const { genre, category } = skill;
        if (!acc[genre]) {
            acc[genre] = {};
        }
        if (!acc[genre][category]) {
            acc[genre][category] = [];
        }
        acc[genre][category].push(skill);
        return acc;
    }, {});
    
    let html = '';
    for (const genre in groupedSkills) {
        html += createUserSkillGenreAccordion(genre, groupedSkills[genre]);
    }
    container.innerHTML = html;
}

/**
 * 利用者詳細画面のイベントリスナー設定関数
 */
function setupUserDetailEventListeners() {
    const container = document.getElementById('user-detail-screen');
    if (!container) return;

    container.addEventListener('click', function(event) {
        const target = event.target;
        const header = target.closest('.accordion-header');

        if (header && header.querySelector('.accordion-toggle')) {
            const content = header.nextElementSibling;
            const toggle = header.querySelector('.accordion-toggle');
            content.classList.toggle('hidden');
            toggle.textContent = content.classList.contains('hidden') ? '▼' : '▲';
            return; 
        }
    });
}

/**
 * =================================================================
 * 案件管理 機能
 * =================================================================
 */

/**
 * 案件管理 > 案件一覧を描画する
 */
function renderProjectList() {
    const projectList = document.getElementById('project-list');
    if (!projectList) return;

    const projects = dummyData.projects || [];

    projectList.innerHTML = projects.map(project => `
        <tr class="border-b hover:bg-gray-50">
            <td class="py-3 px-4">${project.projectName}</td>
            <td class="py-3 px-4">${project.status}</td>
            <td class="py-3 px-4 text-center">
                <button onclick="showScreen('project-detail-screen')" class="detail-button font-bold py-1 px-3 rounded text-sm">詳細</button>
            </td>
        </tr>
    `).join('');
}

/**
 * =================================================================
 * 収支管理 機能
 * =================================================================
 */

/**
 * 収支管理 > 収支集計タブの全データを描画する
 */
function renderFinanceAggregation() {
    const summary = dummyData.financialSummaries.aggregation;
    document.getElementById('aggregation-month-display').textContent = `${summary.year}年度${summary.month}月`;
    document.getElementById('aggregation-period-display').textContent = summary.period;
    document.getElementById('aggregation-income').textContent = formatCurrency(summary.income);
    document.getElementById('aggregation-costs').textContent = formatCurrency(summary.costs);
    document.getElementById('aggregation-wages').textContent = formatCurrency(summary.wages);
    document.getElementById('aggregation-reserves').textContent = formatCurrency(summary.reserves);

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
    const summary = dummyData.financialSummaries.summary;
    document.getElementById('summary-year-display').textContent = `${summary.year}年度`;
    document.getElementById('summary-period-display').textContent = summary.period;
    document.getElementById('summary-income').textContent = formatCurrency(summary.income);
    document.getElementById('summary-costs').textContent = formatCurrency(summary.costs);
    document.getElementById('summary-wages').textContent = formatCurrency(summary.wages);
    document.getElementById('summary-reserves').textContent = formatCurrency(summary.reserves);

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
    const summary = dummyData.financialSummaries.averageWage;
    document.getElementById('avg-wage-year-display').textContent = `${summary.year}年度`;
    document.getElementById('avg-wage-period-display').textContent = summary.period;
    document.getElementById('avg-wage-average').textContent = formatCurrency(summary.average);
    document.getElementById('avg-wage-total-wages').textContent = formatCurrency(summary.totalWages);
    document.getElementById('avg-wage-avg-users').textContent = formatNumber(summary.avgUsers, '人');
    document.getElementById('avg-wage-total-users').textContent = formatNumber(summary.totalUsers, '人');
    document.getElementById('avg-wage-open-days').textContent = formatNumber(summary.openDays, '日');

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
    const summary = dummyData.financialSummaries.payment;
    document.getElementById('payment-month-display').textContent = `${summary.year}年度${summary.month}月`;
    document.getElementById('payment-period-display').textContent = summary.period;
    document.getElementById('payment-total-payment').textContent = formatCurrency(summary.totalPayment);
    document.getElementById('payment-total-wages').textContent = formatCurrency(summary.totalWages);
    document.getElementById('payment-total-deduction').textContent = formatCurrency(summary.totalDeduction);

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
 * 事業所情報設定タブ内の画面表示を切り替える
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
    if (navLink) {
        navLink.classList.add('active');
    }
    if (isFinance) {
        showFinanceTab('finance-aggregation-wrapper', document.querySelector('#finance-sub-nav a'));
    }
    if (screenId === 'client-list-screen') {
        showClientTab('client-customer-tab', document.querySelector('#client-sub-nav a'));
    }
    if (screenId === 'user-list-screen') {
        renderUserList();
    }
    if (screenId === 'user-detail-screen') {
        renderUserSkillList();
    }
    if (screenId === 'project-list-screen') {
        renderProjectList();
    }
    if (screenId === 'attendance-screen') {
        showAttendanceTab('attendance-business-calendar-wrapper', document.querySelector('#attendance-sub-nav a'));
        renderBusinessCalendar();
    }
}

function showSettingsTab(tabId, navLink) {
    document.querySelectorAll('.settings-tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('#settings-sub-nav .sub-nav-link').forEach(link => link.classList.remove('active'));
    navLink.classList.add('active');
    
    if (tabId === 'settings-facility') {
        showFacilityDetailScreen(false);
    }
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

function showClientTab(tabId, navLink) {
    document.querySelectorAll('.client-tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('#client-sub-nav .sub-nav-link').forEach(link => link.classList.remove('active'));
    navLink.classList.add('active');
}

function showAttendanceTab(tabId, navLink) {
    document.querySelectorAll('.attendance-tab-content').forEach(tab => tab.classList.add('hidden'));
    document.getElementById(tabId).classList.remove('hidden');
    document.querySelectorAll('#attendance-sub-nav .sub-nav-link').forEach(link => link.classList.remove('active'));
    navLink.classList.add('active');
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

    const now = new Date();
    if (date.getFullYear() < now.getFullYear() || (date.getFullYear() === now.getFullYear() && date.getMonth() < now.getMonth())) {
        summary.status = 'confirmed';
    } else {
        summary.status = 'unconfirmed';
    }

    renderFinanceAggregation();
}

/**
 * =================================================================
 * アカウント設定モーダル機能
 * =================================================================
 */

function openAccountModal(account = null) {
    const modal = document.getElementById('account-modal');
    const modalTitle = document.getElementById('account-modal-title');
    const form = document.getElementById('account-form');
    
    form.reset();
    document.getElementById('account-id').value = '';

    if (account) {
        modalTitle.textContent = 'アカウント編集';
        document.getElementById('account-id').value = account.email;
        document.getElementById('account-role').value = account.role;
        document.getElementById('account-username').value = account.userName;
        document.getElementById('account-email').value = account.email;
        document.getElementById('account-email').readOnly = true;
    } else {
        modalTitle.textContent = 'アカウント新規作成';
        document.getElementById('account-email').readOnly = false;
    }
    
    modal.classList.remove('hidden');
}

function closeAccountModal() {
    const modal = document.getElementById('account-modal');
    modal.classList.add('hidden');
}

function setupAccountSettingsEventListeners() {
    const openModalBtn = document.getElementById('open-account-modal-btn');
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            openAccountModal();
        });
    }

    const closeModalBtn = document.getElementById('close-account-modal-btn');
    if(closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAccountModal);
    }
    
    const cancelModalBtn = document.getElementById('cancel-account-modal-btn');
    if(cancelModalBtn) {
        cancelModalBtn.addEventListener('click', closeAccountModal);
    }

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
                alert('削除機能は未実装です。');
            }
        });
    }
    
    const accountForm = document.getElementById('account-form');
    if(accountForm) {
        accountForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('保存機能は未実装です。');
            closeAccountModal();
        });
    }
}

/**
 * =================================================================
 * 差引工賃設定 機能
 * =================================================================
 */

function setupPaymentWageSettingsEventListeners() {
    const container = document.getElementById('settings-payment-wage');
    if (!container) return;

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

    const addBasePriceBtn = document.getElementById('add-base-price-row-btn');
    const basePriceTableBody = document.getElementById('base-price-table-body');
    if (addBasePriceBtn && basePriceTableBody) {
        addBasePriceBtn.addEventListener('click', () => {
            basePriceTableBody.insertAdjacentHTML('beforeend', createBasePriceRowHtml());
        });
    }

    container.addEventListener('click', (e) => {
        const target = e.target;

        if (target.classList.contains('delete-row-btn')) {
            target.closest('tr').remove();
            return;
        }

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

/**
 * =================================================================
 * 事業所カレンダー編集モーダル機能
 * =================================================================
 */

function openCalendarModal(day) {
    const modal = document.getElementById('calendar-modal');
    const modalTitle = document.getElementById('calendar-modal-title');
    const dateInput = document.getElementById('calendar-date');
    
    modalTitle.textContent = `日付設定（${currentCalendarDate.getMonth() + 1}月${day}日）`;
    dateInput.value = day;
    
    modal.classList.remove('hidden');
}

function closeCalendarModal() {
    const modal = document.getElementById('calendar-modal');
    modal.classList.add('hidden');
}

function toggleTimePicker(show) {
    const timePickerWrapper = document.getElementById('time-picker-wrapper');
    if (show) {
        timePickerWrapper.classList.remove('hidden');
    } else {
        timePickerWrapper.classList.add('hidden');
    }
}

/**
 * =================================================================
 * 【追加】利用者個別カレンダー編集モーダル機能
 * =================================================================
 */
function openUserAttendanceModal(day) {
    const modal = document.getElementById('user-attendance-modal');
    const modalTitle = document.getElementById('user-attendance-modal-title');
    const dateInput = document.getElementById('user-attendance-date');
    
    modalTitle.textContent = `勤怠編集（${currentCalendarDate.getMonth() + 1}月${day}日）`;
    dateInput.value = day;
    
    modal.classList.remove('hidden');
}

function closeUserAttendanceModal() {
    const modal = document.getElementById('user-attendance-modal');
    modal.classList.add('hidden');
}

function toggleUserTimePicker(show) {
    const timePickerWrapper = document.getElementById('user-time-picker-wrapper');
    if (show) {
        timePickerWrapper.classList.remove('hidden');
    } else {
        timePickerWrapper.classList.add('hidden');
    }
}


/**
 * =================================================================
 * 事業所カレンダー 月変更機能
 * =================================================================
 */

let currentCalendarDate = new Date(2025, 9, 1);

/**
 * 【変更】カレンダー描画処理を共通化
 */
function generateCalendarBodyHTML(year, month, dayClickHandlerName) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = '';
    let day = 1;
    for (let i = 0; i < 6; i++) {
        html += '<tr class="border-b">';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                html += '<td class="py-3 px-4 h-32 text-center border align-top"></td>';
            } else if (day > daysInMonth) {
                html += '<td class="py-3 px-4 h-32 text-center border align-top"></td>';
            } else {
                let content = '';
                let cellClass = 'cursor-pointer hover:bg-gray-100';

                if (j === 0 || j === 6) { 
                    content = `<div class="font-bold">${day}</div><div class="font-bold">閉所</div>`;
                    cellClass += ' bg-[var(--auxiliary-color)] hover:bg-gray-200';
                } else {
                    content = `<div class="font-bold">${day}</div><div class="text-sm"><div>10:00</div><div>～</div><div>16:00</div></div>`;
                }

                const today = new Date();
                if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
                     content = `<div class="font-bold inline-block bg-[var(--accent-color)] rounded-full w-6 h-6 leading-6">${day}</div><div class="text-sm"><div>10:00</div><div>～</div><div>16:00</div></div>`;
                }

                html += `<td onclick="${dayClickHandlerName}('${day}')" class="py-3 px-4 h-32 text-center border align-top ${cellClass}">${content}</td>`;
                day++;
            }
        }
        html += '</tr>';
        if (day > daysInMonth) break;
    }
    return html;
}

/**
 * 【変更】共通化された描画処理を呼び出すように修正
 */
function renderBusinessCalendar() {
    const calendarMonthYear = document.getElementById('calendar-month-year');
    const calendarBody = document.getElementById('calendar-body');
    const userCalendarMonthYear = document.getElementById('user-calendar-month-year');
    const userCalendarBody = document.getElementById('user-calendar-body');

    if (!calendarMonthYear || !calendarBody || !userCalendarMonthYear || !userCalendarBody) return;

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();

    const monthYearText = `${year}年 ${month + 1}月`;
    calendarMonthYear.textContent = monthYearText;
    userCalendarMonthYear.textContent = monthYearText;
    
    calendarBody.innerHTML = generateCalendarBodyHTML(year, month, 'openCalendarModal');
    userCalendarBody.innerHTML = generateCalendarBodyHTML(year, month, 'openUserAttendanceModal');
}

function changeCalendarMonth(offset) {
    currentCalendarDate.setMonth(currentCalendarDate.getMonth() + offset);
    renderBusinessCalendar();
}