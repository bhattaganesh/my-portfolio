import Link from 'next/link';
import { education, profile, resumeRequestHref, roleDates, roles } from '@/content/profile';

/**
 * About Ganesh: profile, verified experience, résumé (only when published) and contact,
 * all read from the same content as the main portfolio.
 *
 * @param props.resumeHref Public path of the published résumé PDF, or null to offer it by email.
 */
export function AboutApp({ resumeHref }: { resumeHref: string | null }) {
  return (
    <div className="gw-about">
      <header className="gw-about-head">
        <span className="gw-about-mark" aria-hidden="true">G</span>
        <div>
          <h3 className="gw-app-heading">{profile.name}</h3>
          <p>{profile.summary}</p>
        </div>
      </header>

      <section aria-labelledby="gw-about-exp">
        <h4 id="gw-about-exp">Experience</h4>
        <ol className="gw-about-list">
          {roles.map((r) => (
            <li key={`${r.organization}-${r.start}`}>
              <span className="gw-about-when">{roleDates(r)}</span>
              <span>
                <strong>{r.title}</strong>, {r.organization}
              </span>
            </li>
          ))}
          <li>
            <span className="gw-about-when">{education.years}</span>
            <span>
              <strong>{education.title}</strong>, {education.organization}
            </span>
          </li>
        </ol>
      </section>

      <section aria-labelledby="gw-about-contact">
        <h4 id="gw-about-contact">Résumé and contact</h4>
        <ul className="gw-about-links">
          <li>
            {resumeHref ? (
              <a href={resumeHref}>Download résumé (PDF)</a>
            ) : (
              <a href={resumeRequestHref()}>Ask for my résumé by email</a>
            )}
          </li>
          <li>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          {profile.links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer">
                {l.label}
                <span className="sr-only"> (opens in a new tab)</span> <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
          <li>
            <Link href="/journey/" prefetch={false}>
              Full career journey on the portfolio
            </Link>
          </li>
        </ul>
      </section>
    </div>
  );
}
