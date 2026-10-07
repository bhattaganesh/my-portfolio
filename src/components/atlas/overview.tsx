import Link from 'next/link';
import { education, profile, roleDates, roles } from '@/content/profile';
import { work } from '@/content/work';
import { resumeRequestHref } from '@/lib/resume';

const CELL = 'grid content-start gap-3 border-t-[1.5px] border-ink pt-4';
const LINK = 'font-semibold text-cobalt underline-offset-4 hover:underline';

/**
 * The recruiter fast path: strongest work, experience, résumé and contact in one band.
 *
 * @param props.resumeHref Public path of the published résumé PDF, or null to offer it by email instead.
 */
export function Overview({ resumeHref }: { resumeHref: string | null }) {
  return (
    <section id="overview" aria-labelledby="overview-title" className="scroll-mt-6 border-y border-rule bg-tint">
      <div className="mx-auto grid max-w-[1240px] gap-8 px-5 py-12 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="overview-title" className="m-0 text-2xl font-bold md:text-3xl">
            The 60-second overview
          </h2>
          <p className="eyebrow m-0">Work · experience · résumé · contact</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          <div className={CELL}>
            <h3 className="eyebrow m-0">Focus</h3>
            <p className="m-0">{profile.summary}</p>
          </div>

          <div className={CELL}>
            <h3 className="eyebrow m-0">Strongest work</h3>
            <ul className="m-0 grid list-none gap-3 p-0">
              {work
                .filter((w) => w.flagship)
                .map((w) => (
                  <li key={w.slug} className="grid">
                    <Link href={`/work/${w.slug}/`} className={`${LINK} inline-flex min-h-11 items-center`}>
                      {w.title}
                    </Link>
                    <span className="text-[15px] text-muted">{w.role}, {w.organization}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div className={CELL}>
            <h3 className="eyebrow m-0">Experience</h3>
            <ul className="m-0 grid list-none gap-2 p-0">
              {roles.map((r) => (
                <li key={`${r.organization}-${r.start}`} className="grid">
                  <span>
                    <strong className="font-semibold">{r.organization}</strong>, {r.title}
                  </span>
                  <span className="font-mono text-[13px] text-muted">{roleDates(r)}</span>
                </li>
              ))}
              <li className="grid">
                <span>
                  <strong className="font-semibold">{education.organization}</strong>, {education.title}
                </span>
                <span className="font-mono text-[13px] text-muted">{education.years}</span>
              </li>
            </ul>
            <Link href="/journey/" className={`${LINK} inline-flex min-h-11 items-center`}>
              The full journey →
            </Link>
          </div>

          <div className={CELL}>
            <h3 className="eyebrow m-0">Résumé &amp; contact</h3>
            <ul className="m-0 grid list-none gap-1 p-0">
              <li>
                {resumeHref ? (
                  <a href={resumeHref} className={`${LINK} inline-flex min-h-11 items-center`}>
                    Résumé (PDF)
                  </a>
                ) : (
                  <a href={resumeRequestHref(profile.email)} className={`${LINK} inline-flex min-h-11 items-center`}>
                    Résumé on request by email
                  </a>
                )}
              </li>
              <li>
                <a href={`mailto:${profile.email}`} className={`${LINK} inline-flex min-h-11 items-center break-all`}>
                  {profile.email}
                </a>
              </li>
              {profile.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer" className={`${LINK} inline-flex min-h-11 items-center`}>
                    {l.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                    <span aria-hidden="true">&nbsp;↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
