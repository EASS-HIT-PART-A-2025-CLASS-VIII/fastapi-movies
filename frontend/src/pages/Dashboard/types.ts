export interface TransactionDetailsStats {
    monthly_burn: number;
    daily_avg: number;
    efficiency_score: number;
    trend_pct: number;
    history: TransactionItem[];
}

interface TransactionItem {
    date: string;
    amount: number;
}