export interface PromoCode {
  id?: number;
  code: string;
  percentage: number;
  is_active: boolean;
  max_uses?: number | null;
  uses_count?: number;
  expires_at: string;
  plan_ids?: number[];
  plans?: any[];
  created_at?: string;
  updated_at?: string;
}
