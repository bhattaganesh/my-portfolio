'use client';

import React, { useState, useId } from 'react';
import { z } from 'zod';
import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
import { Send, Loader2, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SITE_CONFIG } from '@/lib/constants';

/* ── Validation schema ── */
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;
type FieldErrors = Partial<Record<keyof FormData, string>>;

/* ── Shared input class tokens ── */
const inputBase = [
  'w-full px-4 py-3 rounded-xl',
  'border border-surface-300 dark:border-surface-700',
  'bg-white dark:bg-surface-800',
  'text-surface-900 dark:text-surface-100',
  'placeholder:text-surface-400 dark:placeholder:text-surface-500',
  'text-sm',
  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
  'transition-all duration-200',
].join(' ');

const inputError = 'border-red-400 dark:border-red-600 focus:ring-red-500';
const labelBase = 'block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5';
const errorBase = 'text-red-500 dark:text-red-400 text-xs mt-1 flex items-center gap-1';

/* ── Field component ── */
interface FieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, id, error, required, children }: FieldProps) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className={labelBase}>
        {label}
        {required && (
          <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className={errorBase}>
          <span aria-hidden="true">&#9888;</span>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Main component ── */
export function ContactForm() {
  const uid = useId();
  const nameId = `${uid}-name`;
  const emailId = `${uid}-email`;
  const subjectId = `${uid}-subject`;
  const messageId = `${uid}-message`;

  const [form, setForm] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Client-side validation
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FieldErrors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS is not configured');
      }

      await emailjs.send(serviceId, templateId, {
        from_name: result.data.name,
        from_email: result.data.email,
        subject: result.data.subject || 'New Portfolio Contact',
        message: result.data.message,
      }, { publicKey });

      setSubmitted(true);
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send. Please try again or email me directly.');
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-5 py-16 px-8 rounded-2xl border border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-bold font-display text-surface-900 dark:text-surface-50">
            Message sent!
          </h3>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 leading-relaxed">
            Thanks for reaching out. I&apos;ll get back to you within 1&ndash;2 business days.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 transition-colors duration-150"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      className="flex flex-col gap-5"
    >
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Your Name" id={nameId} error={errors.name} required>
          <input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ganesh Bhatt"
            required
            aria-required="true"
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
            aria-invalid={!!errors.name}
            className={cn(inputBase, errors.name && inputError)}
            disabled={submitting}
          />
        </Field>

        <Field label="Email Address" id={emailId} error={errors.email} required>
          <input
            id={emailId}
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            aria-required="true"
            aria-describedby={errors.email ? `${emailId}-error` : undefined}
            aria-invalid={!!errors.email}
            className={cn(inputBase, errors.email && inputError)}
            disabled={submitting}
          />
        </Field>
      </div>

      {/* Subject */}
      <Field label="Subject" id={subjectId} error={errors.subject}>
        <input
          id={subjectId}
          name="subject"
          type="text"
          autoComplete="off"
          value={form.subject}
          onChange={handleChange}
          placeholder="e.g. Freelance project, Full-time role, Collaboration…"
          aria-describedby={errors.subject ? `${subjectId}-error` : undefined}
          aria-invalid={!!errors.subject}
          className={cn(inputBase, errors.subject && inputError)}
          disabled={submitting}
        />
      </Field>

      {/* Message */}
      <Field label="Message" id={messageId} error={errors.message} required>
        <textarea
          id={messageId}
          name="message"
          rows={6}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell me about your project, timeline, and budget. The more context, the better!"
          required
          aria-required="true"
          aria-describedby={errors.message ? `${messageId}-error` : undefined}
          aria-invalid={!!errors.message}
          className={cn(inputBase, 'resize-y min-h-[140px]', errors.message && inputError)}
          disabled={submitting}
        />
      </Field>

      {/* Privacy note */}
      <p className="text-xs text-surface-400 dark:text-surface-500 leading-relaxed">
        Your information is only used to respond to your message and will never be shared with third
        parties. You can also reach me directly at{' '}
        <a
          href={`mailto:${SITE_CONFIG.email}`}
          className="text-primary-500 hover:text-primary-400 transition-colors"
        >
          {SITE_CONFIG.email}
        </a>
        .
      </p>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className={cn(
          'inline-flex items-center justify-center gap-2',
          'w-full px-5 py-2.5 rounded-lg',
          'bg-primary-600 hover:bg-primary-500',
          'text-white font-semibold text-sm',
          'shadow-md shadow-primary-600/20',
          'hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5',
          'transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
          'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md',
        )}
        aria-busy={submitting}
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            <Send className="w-4 h-4" aria-hidden="true" />
            Send Message
          </>
        )}
      </button>
    </form>
  );
}

export default ContactForm;
