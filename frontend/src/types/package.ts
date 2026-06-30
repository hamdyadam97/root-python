export interface PackageCategory {
  id?: number;
  name: string;
}

export interface Package {
  id: number;
  name: string;
  code?: string | null;
  description?: string | null;
  logo?: string | null;
  icon?: string | null;
  price: string | number;
  original_price?: number | string | null;
  status?: number;
  period_days?: number | null;
  duration_minutes?: number | null;
  number_of_questions?: number | null;
  exam_count?: number;
  trial_count?: number;
  category?: PackageCategory | null;
  is_trial?: boolean;
  is_custom?: boolean;
  is_bestseller?: boolean;
  is_new?: boolean;
  daily_rate?: string | number | null;
  difficulty_level?: number | null;
  difficulty_label?: string | null;
  rating?: string | number;
  students_count?: number;
  discount_percentage?: number;
  sub_categories?: PackageCategory[];
  created_at?: string;
}
