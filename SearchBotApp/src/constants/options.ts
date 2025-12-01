import { DifficultyLevel, PriorityLevel } from '@/types';

export const CATEGORIES = [
  'DIY & Home Repair',
  'Automotive',
  'Technology',
  'Shopping',
  'Travel Planning',
  'Academic Research',
  'Health & Wellness',
  'Professional Tasks',
];

export const PRIORITY_OPTIONS: { label: string; value: PriorityLevel; description: string }[] = [
  {
    label: 'Urgent',
    value: 'urgent',
    description: 'Need help within a few hours',
  },
  {
    label: 'Normal',
    value: 'normal',
    description: 'Resolve within a day',
  },
  {
    label: 'Low',
    value: 'low',
    description: 'Research when convenient',
  },
];

export const DIFFICULTY_LABELS: Record<DifficultyLevel, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};
