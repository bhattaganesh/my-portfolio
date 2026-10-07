import type { Metadata } from 'next';
import { CopyEmail } from '@/components/atlas/copy-email';
import { profile } from '@/content/profile';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Email Ganesh Prasad Bhatt about senior full-stack engineering roles or architecture consulting.',
  alternates: { canonical: `${SITE_CONFIG.url}/contact/` },
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-[1000px] gap-12 px-5 pt-14 pb-24 md:grid-cols-2 md:px-10 md:pt-20">
      <div className="grid content-start gap-4">
        <p className="eyebrow">Contact</p>
        <h1 className="m-0 text-5xl font-extrabold tracking-[-0.02em] md:text-6xl">Let&apos;s talk</h1>
        <p className="m-0 text-lg">I&apos;m open to senior full-stack engineering roles and to architecture consulting.</p>
        <p className="m-0 text-muted">
          Email is the best way to reach me. There&apos;s no contact form, so your message goes straight to my inbox and nowhere else.
        </p>
      </div>
      <div className="grid content-start gap-6">
        <section aria-labelledby="email-heading" className="grid gap-2">
          <h2 id="email-heading" className="m-0 text-xl font-bold">
            Email
          </h2>
          <CopyEmail email={profile.email} />
          <a href={`mailto:${profile.email}`} className="inline-flex min-h-12 w-fit items-center rounded-full bg-cobalt px-6 font-semibold text-on-cobalt">
            Write an email
          </a>
        </section>
        <section aria-labelledby="elsewhere" className="grid gap-2">
          <h2 id="elsewhere" className="m-0 text-xl font-bold">
            Elsewhere
          </h2>
          <ul className="m-0 grid list-none gap-1 p-0">
            {profile.links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-cobalt underline-offset-4 hover:underline">
                  {l.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                  <span aria-hidden="true">&nbsp;↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
