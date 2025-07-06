
import DOMPurify from 'dompurify';
import { supabase } from '@/integrations/supabase/client';

// Input sanitization utilities
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
};

export const sanitizeHtml = (html: string): string => {
  if (!html) return '';
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins 8 caractères.' };
  }
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return { valid: false, message: 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre.' };
  }
  return { valid: true };
};

// Security audit logging
export const logSecurityEvent = async (
  eventType: string,
  eventDetails?: Record<string, any>
) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase
      .from('security_audit_log')
      .insert({
        user_id: user?.id || null,
        event_type: sanitizeInput(eventType),
        event_details: eventDetails || null,
        ip_address: null, // Will be handled by edge functions in production
        user_agent: navigator.userAgent
      });
  } catch (error) {
    console.error('Failed to log security event:', error);
  }
};

// Rate limiting utilities (client-side basic implementation)
class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  isRateLimited(key: string, maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove attempts outside the window
    const validAttempts = attempts.filter(time => now - time < windowMs);
    
    if (validAttempts.length >= maxAttempts) {
      return true;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return false;
  }
  
  clear(key: string): void {
    this.attempts.delete(key);
  }
}

export const rateLimiter = new RateLimiter();
