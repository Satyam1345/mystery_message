import { useState, useEffect } from 'react';

export const useHydrationFix = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSubmitting(false);
    }
  }, []);

  return { isSubmitting, setIsSubmitting };
};
