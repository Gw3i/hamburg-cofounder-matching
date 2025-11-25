/**
 * Founder skill areas based on Y Combinator Co-Founder Matching
 * 
 * These are the 5 general role-based categories YC uses, not technology-specific skills.
 * Non-technical founders care about what you can DO, not which specific technologies you use.
 */

export const FOUNDER_SKILLS = [
  {
    value: 'product',
    label: 'Product',
    description: 'Product management, strategy, roadmap planning'
  },
  {
    value: 'design',
    label: 'Design',
    description: 'UI/UX design, visual design, user research'
  },
  {
    value: 'engineering',
    label: 'Engineering',
    description: 'Building the product (most in-demand skill)'
  },
  {
    value: 'sales_marketing',
    label: 'Sales & Marketing',
    description: 'Growth, customer acquisition, marketing strategy'
  },
  {
    value: 'operations',
    label: 'Operations',
    description: 'Running the business, logistics, operations'
  }
] as const;

export type FounderSkill = typeof FOUNDER_SKILLS[number]['value'];
