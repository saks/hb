export type AuthToken = { email: string, exp: number, user_id: number, username: string };
export type BudgetAttrs = {
    user: string,
    amount: string,
    left: number,
    name: string,
    left_average_per_day: number,
    average_per_day: number,
    spent: number,
};
