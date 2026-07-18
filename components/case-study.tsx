import Link from "next/link";
import { CaseStudyVideo } from "./case-study-video";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

type Detail = {
  label: string;
  value: string;
};

type Section = {
  number: string;
  label: string;
  title: string;
  body: string[];
};

type CaseStudyProps = {
  eyebrow: string;
  title: string;
  summary: string;
  video: string;
  poster: string;
  details: Detail[];
  sections: Section[];
  testimonial?: {
    quote: string;
    name: string;
    role: string;
    companyUrl: string;
  };
  nextProject: {
    title: string;
    href: string;
  };
};

export function CaseStudy({
  eyebrow,
  title,
  summary,
  video,
  poster,
  details,
  sections,
  testimonial,
  nextProject,
}: CaseStudyProps) {
  return (
    <main id="main-content">
      <SiteHeader />
      <article className="case-study">
        <header className="case-hero">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="case-summary">{summary}</p>
          <dl className="case-details">
            {details.map((detail) => (
              <div key={detail.label}>
                <dt>{detail.label}</dt>
                <dd>{detail.value}</dd>
              </div>
            ))}
          </dl>
        </header>

        <CaseStudyVideo src={video} poster={poster} title={title} />

        <div className="case-sections">
          {sections.map((section) => (
            <section key={section.number} className="case-section">
              <div className="case-section-index">
                <span>{section.number}</span>
                <span>{section.label}</span>
              </div>
              <div className="case-section-copy">
                <h2>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {testimonial ? (
          <figure className="testimonial">
            <blockquote>“{testimonial.quote}”</blockquote>
            <figcaption>
              <span>{testimonial.name}</span>
              <a href={testimonial.companyUrl} target="_blank" rel="noreferrer">
                {testimonial.role} ↗
              </a>
            </figcaption>
          </figure>
        ) : null}

        <Link className="next-project" href={nextProject.href}>
          <span>Next case study</span>
          <strong>{nextProject.title}</strong>
          <span aria-hidden="true">↗</span>
        </Link>
      </article>
      <SiteFooter />
    </main>
  );
}
