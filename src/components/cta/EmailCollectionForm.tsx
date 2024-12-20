import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { CTAConfig } from './types';

interface EmailCollectionFormProps {
  config: CTAConfig;
  className?: string;
  variant?: 'hero' | 'inline' | 'sticky';
}

export const EmailCollectionForm: React.FC<EmailCollectionFormProps> = ({
  config,
  className = '',
  variant = 'inline'
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubmitStatus('success');
      setEmail('');
    } catch (error: any) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formClassName = variant === 'inline' 
    ? 'flex flex-col sm:flex-row gap-3'
    : 'flex flex-col gap-2';

  return (
    <form onSubmit={handleSubmit} className={formClassName}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
        required
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          px-4 py-2 rounded-md transition-all duration-300 
          flex items-center justify-center gap-2
          bg-emerald-600 text-white hover:bg-emerald-700
          disabled:opacity-50 disabled:cursor-not-allowed
          sm:w-auto
        "
      >
        {isSubmitting ? (
          'Sending...'
        ) : (
          <>
            <span>{config.buttonText}</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
      {submitStatus === 'success' && (
        <p className="text-green-600 mt-2 text-sm">✓ Check your email to download the guide</p>
      )}
      {submitStatus === 'error' && (
        <p className="text-red-600 mt-2 text-sm">× Something went wrong. Please try again.</p>
      )}
    </form>
  );
};
