'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, Mail, ExternalLink, Gift, ArrowRight } from 'lucide-react';

// Define CTA types for type safety and flexibility
type CTAType = 'newsletter' | 'download' | 'affiliate' | 'content-upgrade' | 'external-link' | 'custom';
type CTAIcon = 'download' | 'mail' | 'external' | 'gift' | 'none';

// CTA Configuration Interface
interface CTAConfig {
  title: string;
  description: string;
  buttonText: string;
  type?: CTAType;
  href?: string;
  icon?: CTAIcon;
  trackingId?: string;
}

const ctaIcons: Record<CTAIcon, React.ReactNode> = {
  download: <Download className="w-5 h-5" />,
  mail: <Mail className="w-5 h-5" />,
  external: <ExternalLink className="w-5 h-5" />,
  gift: <Gift className="w-5 h-5" />,
  none: null
};

interface Props {
  config: CTAConfig;
  variant?: 'default' | 'inline' | 'sticky';
  className?: string;
}

type ComponentVariant = 'default' | 'inline' | 'sticky';

type LayoutStyles = {
  container: string;
  grid: string;
  textContainer: string;
  formContainer: string;
  heading: string;
  description: string;
  form: string;
}

const variants: Record<ComponentVariant, LayoutStyles> = {
  default: {
    container: "bg-blue-50/50 border border-dashed border-blue-200 rounded-lg p-6",
    grid: "grid grid-cols-1 md:grid-cols-5 gap-6 items-center",
    textContainer: "md:col-span-3 flex flex-col justify-center",
    formContainer: "md:col-span-2 flex flex-col justify-center",
    heading: "text-2xl font-bold text-slate-900",
    description: "text-slate-600 mt-1 text-base leading-relaxed",
    form: "flex flex-col gap-3",
  },
  inline: {
    container: "bg-blue-50/50 border border-dashed border-blue-200 rounded-lg p-4 my-8",
    grid: "space-y-4",
    textContainer: "",
    formContainer: "",
    heading: "text-xl font-bold text-slate-900",
    description: "text-slate-600 mt-1 text-sm leading-relaxed",
    form: "flex flex-col sm:flex-row gap-3",
  },
  sticky: {
    container: "bg-blue-50/50 border border-gray-200 rounded-lg p-4 shadow-sm",
    grid: "space-y-3",
    textContainer: "",
    formContainer: "",
    heading: "text-lg font-bold text-slate-900",
    description: "text-slate-600 text-sm leading-relaxed",
    form: "flex flex-col gap-2",
  }
};

export const CallToAction: React.FC<Props> = ({
  config, 
  variant = 'default', 
  className = ''
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Determine if CTA requires email collection
  const requiresEmailCollection = 
    config.type !== 'affiliate' && 
    config.type !== 'external-link' && 
    config.href;

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // TODO: Replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define icon based on variant
  const icon = config.icon ? ctaIcons[config.icon] : <ArrowRight className="w-5 h-5" />;

  const styles = variants[variant];

  // Render direct link for affiliate/external types
  if (!requiresEmailCollection && config.href) {
    return (
      <div className="w-full bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center space-x-4">
          {icon && <div className="text-white">{icon}</div>}
          <div className="flex-grow">
            <h3 className="text-2xl font-bold text-white">{config.title}</h3>
            <p className="text-white/80 mt-2">{config.description}</p>
          </div>
          <Link 
            href={config.href}
            className={`
              px-4 py-2 rounded-md transition-all duration-300 
              flex items-center space-x-2
              bg-white text-primary-600 hover:bg-white/90
              ${className}
            `}
          >
            {config.buttonText}
          </Link>
        </div>
      </div>
    );
  }

  // Render email collection form
  return (
    <div className="w-full">
      <div className={variant === 'default' ? 'max-w-7xl mx-auto px-4' : 'w-full'}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.textContainer}>
              <h3 className={styles.heading}>{config.title}</h3>
              <p className={styles.description}>{config.description}</p>
            </div>
            <div className={styles.formContainer}>
              <form onSubmit={handleSubmit} className={styles.form}>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`
                    bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm
                    px-3 py-2 rounded-md transition-all duration-300 
                    w-full flex items-center gap-2 justify-center
                    text-sm font-medium
                    ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                    ${className}
                  `}
                >
                  {icon}
                  <span>{isSubmitting ? 'Sending...' : config.buttonText}</span>
                </button>
              </form>

              {submitStatus === 'success' && (
                <p className="text-green-700 text-sm mt-2">
                  Success! Check your email for the resource.
                </p>
              )}
              {submitStatus === 'error' && (
                <p className="text-red-700 text-sm mt-2">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Preset CTA configurations for easy reuse
export const PresetCTAs = {
  newsletterSignup: {
    type: 'newsletter',
    title: 'Stay Updated',
    description: 'Get the latest photography tips and insights delivered straight to your inbox',
    buttonText: 'Subscribe Now',
    href: '/downloads/newsletter-guide.pdf'
  },
  contentUpgrade: {
    type: 'content-upgrade',
    title: 'Unlock Pro Resources',
    description: 'Download our comprehensive photography business checklist',
    buttonText: 'Get the Checklist',
    href: '/downloads/photography-business-checklist.pdf'
  }
} as const;
