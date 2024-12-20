// Define CTA types for type safety and flexibility
export type CTAType = 'email' | 'link';
export type CTAIcon = 'download' | 'mail' | 'external' | 'gift' | 'none';

// CTA Configuration Interface
export interface CTAConfig {
  title: string;
  description: string;
  buttonText: string;
  type: CTAType;
  href?: string;  // Only for 'link' type
  icon?: CTAIcon;
  trackingId?: string;
  email?: {
    listId: number;
  };
}
