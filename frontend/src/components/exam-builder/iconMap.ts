import type { LucideIcon } from 'lucide-react';
import {
  Heart,
  Brain,
  Baby,
  Syringe,
  Activity,
  Bone,
  User,
  Microscope,
  Pill,
  Stethoscope,
  Thermometer,
  ClipboardList,
} from 'lucide-react';

const map: Record<string, LucideIcon> = {
  internal: Heart,
  cardiology: Heart,
  neurology: Brain,
  pediatrics: Baby,
  surgery: Syringe,
  emergency: Activity,
  orthopedics: Bone,
  gynecology: User,
  obstetrics: User,
  pathology: Microscope,
  pharmacology: Pill,
  pulmonology: Stethoscope,
  nephrology: Thermometer,
  gastroenterology: ClipboardList,
  endocrinology: Activity,
};

export function getIconForName(name: string): LucideIcon {
  const lower = name.toLowerCase();
  for (const key of Object.keys(map)) {
    if (lower.includes(key)) return map[key];
  }
  return ClipboardList;
}
