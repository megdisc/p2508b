const dummyData = {
    // 施設情報設定 > 事業所設定
    facilities: [
        { officeNumber: '1234567890', officeName: 'サンプル事業所', status: '有効' }
    ],
    // 各種設定 > スキル設定
    skills: [
        { genre: "マーケティング", category: "SEO", skillName: "キーワードリサーチ" },
        { genre: "マーケティング", category: "SEO", skillName: "コンテンツ最適化" },
        { genre: "マーケティング", category: "広告", skillName: "Google広告" },
        { genre: "マーケティング", category: "広告", skillName: "SNS広告" },
        { genre: "デザイン", category: "UIデザイン", skillName: "Figma" },
        { genre: "デザイン", category: "UIデザイン", skillName: "Adobe XD" },
        { genre: "デザイン", category: "グラフィックデザイン", skillName: "Illustrator" },
        { genre: "デザイン", category: "グラフィックデザイン", skillName: "Photoshop" },
        { genre: "開発", category: "フロントエンド", skillName: "React" },
        { genre: "開発", category: "フロントエンド", skillName: "Next.js" },
        { genre: "開発", category: "バックエンド", skillName: "Node.js" },
        { genre: "開発", category: "バックエンド", skillName: "Python" },
        { genre: "開発", category: "インフラ", skillName: "Docker" },
        { genre: "開発", category: "インフラ", skillName: "AWS" },
    ],
    // 取引先管理 > 顧客一覧
    customers: [
        { customerName: '株式会社サンプル取引先' },
        { customerName: '合同会社テスト顧客' }
    ],
    // 取引先管理 > 外注先一覧
    subcontractors: [
        { subcontractorName: '個人事業主A' },
        { subcontractorName: '株式会社B' }
    ],
    // 収支管理 > 収支集計（テーブルデータ）
    incomeAndExpenditure: {
        businessIncome: [
            { projectName: '案件A', clientName: '顧客A', amount: 300000 },
            { projectName: '案件B', clientName: '顧客B', amount: 150000 }
        ],
        productionCosts: [
            { projectName: '案件A', subcontractorName: '外注先A', amount: -40000 }
        ],
        wages: [
            { userName: '利用者A', amount: -16000 },
            { userName: '利用者B', amount: -15000 }
        ],
        reserves: [
            { type: '工賃積立金', amount: 100000 },
            { type: 'その他積立金', amount: 60000 }
        ]
    },
    // 収支管理 > 収支一覧（テーブルデータ）
    financialSummary: [
        { month: '9月', income: 450000, costs: -40000, wages: -250000, reserves: 160000 },
        { month: '8月', income: 480000, costs: -50000, wages: -260000, reserves: 170000 }
    ],
    // 収支管理 > 平均工賃一覧（テーブルデータ）
    averageWages: [
        { month: '9月', average: 15800, totalWages: 250000, avgUsers: 15.8, totalUsers: 316, openDays: 20 },
        { month: '8月', average: 16200, totalWages: 260000, avgUsers: 16.0, totalUsers: 352, openDays: 22 }
    ],
    // 収支管理 > 平均工賃詳細（テーブルデータ）
    averageWageDetails: [
        { date: '9月30日', average: 15800, wages: 12500, users: 16, isOpen: '◯' },
        { date: '9月29日', average: 15800, wages: 12500, users: 15, isOpen: '◯' }
    ],
    // 収支管理 > 支払い工賃一覧（テーブルデータ）
    paymentList: [
        { userName: '利用者A', payment: 15500, wages: 16000, deduction: -500 },
        { userName: '利用者B', payment: 14500, wages: 15000, deduction: -500 }
    ],
    // 収支管理 > 各画面のサマリー（集計値）データ
    financialSummaries: {
        // 収支集計
        aggregation: {
            year: 2025,
            month: 9,
            period: '2025年9月1日～2025年9月30日',
            income: 450000,
            costs: -40000,
            wages: -250000,
            reserves: 160000,
            status: 'unconfirmed' // 状態を追加 ('unconfirmed', 'confirmed', 'calculating', 'uncalculated')
        },
        // 収支一覧
        summary: {
            year: 2025,
            period: '2025年1月1日～2025年9月30日',
            income: 5000000,
            costs: -500000,
            wages: -3000000,
            reserves: 1500000
        },
        // 平均工賃一覧
        averageWage: {
            year: 2025,
            period: '2025年4月1日～2025年9月30日',
            average: 16000,
            totalWages: 3000000,
            avgUsers: 15.6,
            totalUsers: 3580,
            openDays: 230
        },
        // 支払い工賃一覧
        payment: {
            year: 2025,
            month: 9,
            period: '2025年9月1日～2025年9月30日',
            totalPayment: 240000,
            totalWages: 250000,
            totalDeduction: -10000
        }
    },
    accounts: [
        { role: '管理者', userName: '田中 太郎', email: 'tanaka@example.com', status: '有効' },
        { role: 'スタッフ', userName: '鈴木 一郎', email: 'suzuki@example.com', status: '有効' },
        { role: 'スタッフ', userName: '佐藤 花子', email: 'sato@example.com', status: '無効' }
    ],
    // 施設情報設定 > 事業所設定
    facilities: [
        { officeNumber: '1234567890', officeName: 'サンプル事業所', status: '有効' }
    ],
    // ...（既存のデータは省略）
    accounts: [
        { role: '管理者', userName: '田中 太郎', email: 'tanaka@example.com', status: '有効' },
        { role: 'スタッフ', userName: '鈴木 一郎', email: 'suzuki@example.com', status: '有効' },
        { role: 'スタッフ', userName: '佐藤 花子', email: 'sato@example.com', status: '無効' }
    ],
    users: [
        {
            userName: '山田 太郎', 
            status: '契約中',
            skills: [
                { genre: "マーケティング", category: "SEO", skillName: "キーワードリサーチ", level: 3 },
                { genre: "マーケティング", category: "SEO", skillName: "コンテンツ最適化", level: 2 },
                { genre: "デザイン", category: "UIデザイン", skillName: "Figma", level: 1 },
            ]
        },
        { userName: '佐藤 次郎', status: '契約中', skills: [] },
        { userName: '鈴木 三郎', status: '契約終了', skills: [] }
    ]
};