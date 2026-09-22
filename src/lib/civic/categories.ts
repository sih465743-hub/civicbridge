export const CATEGORIES = [
  "water",
  "sanitation",
  "education",
  "health",
  "infrastructure",
  "energy",
  "agriculture",
  "environment",
  "livelihood",
  "accessibility",
  "other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const DISTRICTS = [
  "Ranchi",
  "Khunti",
  "East Singhbhum",
  "West Singhbhum",
  "Dhanbad",
  "Bokaro",
  "Dumka",
  "Deoghar",
  "Hazaribagh",
  "Giridih",
  "Gumla",
  "Simdega",
  "Palamu",
  "Latehar",
  "Ramgarh",
  "Saraikela-Kharsawan",
  "Jamtara",
  "Pakur",
  "Sahebganj",
  "Godda",
  "Chatra",
  "Koderma",
  "Garhwa",
  "Lohardaga",
] as const;

export const PRIORITIES = ["low", "medium", "high", "urgent"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const PROBLEM_STATUSES = [
  "open",
  "assigned",
  "in_progress",
  "resolved",
  "closed",
] as const;
export type ProblemStatus = (typeof PROBLEM_STATUSES)[number];

export function categoryLabel(value: string) {
  return value.replace(/-/g, " ");
}

export function statusLabel(value: string) {
  return value.replace(/_/g, " ");
}
