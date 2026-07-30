export const categories = ["学習", "設定手順", "トラブルシューティング", "備忘録"] as const;

export type Category = (typeof categories)[number];
