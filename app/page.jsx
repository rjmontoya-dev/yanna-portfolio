import Scene from '@/components/Scene';
import ThemeToggle from '@/components/ThemeToggle';
import ToolsOrb from '@/components/ToolsOrb';
import ContactForm from '@/components/ContactForm';
import ResumeButton from '@/components/ResumeButton';
import Motion from '@/components/Motion';
import Icon from '@/components/Icon';
import {
  site,
  hero,
  taskBoard,
  marquee,
  about,
  skills,
  orbTools,
  toolkit,
  experience,
  education,
  certifications,
  achievements,
  reasons,
} from '@/lib/content';

/** Section heading: eyebrow + h2 (words animate in) + optional lead. */
function SectionHead({ id, eyebrow, children, lead }) {
  return (
    <header className="section__head">
      <p className="eyebrow" data-reveal>
        {eyebrow}
      </p>
      <h2 id={id} className="h2" data-split>
        {children}
      </h2>
      {lead && (
        <p className="lead" data-reveal>
          {lead}
        </p>
      )}
    </header>
  );
}

export default function Home() {
  const telHref = `tel:${site.phone.replace(/[^\d+]/g, '')}`;
  const mailHref = `mailto:${site.email}`;

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="progress" data-progress aria-hidden="true" />
      <ThemeToggle />
      <Scene />

      <main id="main">
        {/* ------------------------------------------------------------ Hero */}
        <section id="top" className="hero" aria-labelledby="hero-title">
          <div className="container hero__grid">
            <div>
              <p className="hero__status" data-hero-in>
                <span className="hero__dot" aria-hidden="true" />
                {hero.eyebrow}
              </p>
              <h1 id="hero-title" data-hero-name>
                {site.name}
              </h1>
              <p className="hero__role" data-hero-in>
                <span className="sr-only">{site.role}</span>
                <span aria-hidden="true">Your</span>
                <span className="typed" data-typed data-words={JSON.stringify(hero.roles)} aria-hidden="true">
                  {hero.roles[0]}
                </span>
                <span className="caret" aria-hidden="true" />
              </p>
              <p className="lead" data-hero-in>
                {hero.lead}
              </p>
              <div className="hero__actions" data-hero-in>
                <a href="#contact" className="btn btn--primary">
                  Contact Me <Icon name="arrowRight" size={18} />
                </a>
                <ResumeButton url={site.resumeUrl} name={site.name} />
              </div>
              <ul className="hero__highlights" data-hero-in>
                {hero.highlights.map((h) => (
                  <li key={h}>
                    <Icon name="check" size={16} /> {h}
                  </li>
                ))}
              </ul>
            </div>

            <aside className="board" data-hero-in aria-label="A typical day of support">
              <div className="board__head">
                <span className="board__avatar" aria-hidden="true">
                  YP
                </span>
                <div>
                  <strong>{taskBoard.title}</strong>
                  <small>A typical day · GMT+8</small>
                </div>
              </div>
              <ul>
                {taskBoard.tasks.map((t) => (
                  <li key={t.time} className="task is-done" data-task>
                    <span className="task__check" aria-hidden="true">
                      <Icon name="check" size={13} />
                    </span>
                    <span className="task__time">{t.time}</span>
                    <span className="task__label">{t.label}</span>
                  </li>
                ))}
              </ul>
              <p className="board__badge" data-badge>
                <Icon name="spark" size={16} /> {taskBoard.badge}
              </p>
            </aside>
          </div>
        </section>

        {/* -------------------------------------------------------- Marquee */}
        <div className="marquee" aria-hidden="true">
          <ul className="marquee__track">
            {[...marquee, ...marquee].map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </div>

        {/* ----------------------------------------------------------- About */}
        <section id="about" className="section" aria-labelledby="about-title">
          <div className="container bento">
            <div className="card bento__main" data-reveal>
              <p className="eyebrow">About me</p>
              <h2 id="about-title" className="h2" data-split>
                {about.title[0]}
                <em className="accent">{about.title[1]}</em>
                {about.title[2]}
              </h2>
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <ul className="bento__stats" data-stagger>
              {about.stats.map((s, i) => (
                <li key={s.label} className={`card mini-stat${i === 0 ? ' mini-stat--accent' : ''}`}>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------------- Skills */}
        <section id="skills" className="section" aria-labelledby="skills-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead id="skills-title" eyebrow="Top skills">
              What I bring to <em className="accent">your team</em>
            </SectionHead>
            <ul className="grid grid--3" data-stagger>
              {skills.map((s) => (
                <li key={s.title} className="card card--hover">
                  <div className="card__top">
                    <span className="card__icon">
                      <Icon name={s.icon} size={20} />
                    </span>
                    <h3>{s.title}</h3>
                  </div>
                  <p>{s.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------- Tools (3D orb) */}
        <section id="tools" className="section" aria-labelledby="tools-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead id="tools-title" eyebrow="Technical tools">
              Fluent in the tools <em className="accent">you already use</em>
            </SectionHead>
            <div data-reveal>
              <ToolsOrb tools={orbTools} />
            </div>
            <ul className="toolkit grid grid--3" data-stagger>
              {toolkit.map((t) => (
                <li key={t.name} className="toolkit__item">
                  <span className="card__icon">
                    <Icon name={t.icon} size={17} />
                  </span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ------------------------------------------------------ Experience */}
        <section id="experience" className="section" aria-labelledby="exp-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead id="exp-title" eyebrow="Professional experience">
              Where I&apos;ve made an <em className="accent">impact</em>
            </SectionHead>
            <div className="timeline">
              <span className="timeline__line" data-line aria-hidden="true" />
              <ol className="timeline__list">
                {experience.map((job) => (
                  <li key={job.role} className="timeline__item">
                    <div className="timeline__head" data-reveal>
                      <div>
                        <h3>{job.role}</h3>
                        <p className="timeline__org">{job.org}</p>
                      </div>
                      <span className="timeline__period">{job.period}</span>
                    </div>
                    <ul className="duties" data-stagger>
                      {job.items.map(([title, text]) => (
                        <li key={title}>
                          <strong>{title}</strong>
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ------------------------------------- Education & certifications */}
        <section id="education" className="section" aria-labelledby="edu-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead id="edu-title" eyebrow="Education & certifications">
              Always <em className="accent">learning</em>
            </SectionHead>
            <div className="edu-grid">
              <div className="card" data-reveal>
                <h3 className="sub">Education</h3>
                <ol className="steps">
                  {education.map((e, i) => (
                    <li key={e.school} className="step">
                      <span className="step__num" aria-hidden="true">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <h4>{e.school}</h4>
                        <p>{e.detail}</p>
                        {e.years && <small>{e.years}</small>}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <ul className="grid" data-stagger>
                {certifications.map((c) => (
                  <li key={c.title} className="card card--hover cert">
                    <div className="card__top">
                      <span className="card__icon">
                        <Icon name="award" size={20} />
                      </span>
                      <div>
                        <h4>{c.title}</h4>
                        <p className="cert__issuer">{c.issuer}</p>
                      </div>
                    </div>
                    <p>{c.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- Achievements */}
        <section id="results" className="section" aria-labelledby="results-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead
              id="results-title"
              eyebrow="Achievements"
              lead="Systems that save time, reduce busywork, and keep clients coming back."
            >
              Results clients can <em className="accent">measure</em>
            </SectionHead>
            <ul className="grid grid--4" data-stagger>
              {achievements.map((a) => (
                <li key={a.label} className="card card--hover stat">
                  <p className="stat__value">
                    <span data-count={a.value} data-suffix={a.suffix} aria-hidden="true">
                      {a.value}
                      {a.suffix}
                    </span>
                    <span className="sr-only">
                      {a.value}
                      {a.suffix}
                    </span>
                    {a.unit && <small>{a.unit}</small>}
                  </p>
                  <div className="stat__bar" aria-hidden="true">
                    <span data-bar={a.bar} style={{ '--p': a.bar }} />
                  </div>
                  <h3>{a.label}</h3>
                  <p>{a.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ----------------------------------------------------- Why work */}
        <section id="why" className="section" aria-labelledby="why-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <SectionHead id="why-title" eyebrow="Why work with me">
              Support you can <em className="accent">rely on</em>
            </SectionHead>
            <ul className="grid grid--4" data-stagger>
              {reasons.map((r) => (
                <li key={r.title} className="card card--hover">
                  <div className="card__top">
                    <span className="card__icon">
                      <Icon name={r.icon} size={20} />
                    </span>
                    <h3>{r.title}</h3>
                  </div>
                  <p>{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* -------------------------------------------------------- Contact */}
        <section id="contact" className="section" aria-labelledby="contact-title" style={{ paddingTop: 0 }}>
          <div className="container">
            <div className="contact" data-reveal>
              <div>
                <p className="eyebrow">Let&apos;s connect</p>
                <h2 id="contact-title" className="h2" data-split>
                  Let&apos;s free up <em className="accent">your time</em>
                </h2>
                <p className="lead">
                  Ready to bring organization, efficiency, and professionalism to your team. Reach out today.
                </p>
                <ul className="contact__list">
                  <li>
                    <a className="contact__row" href={mailHref}>
                      <span className="card__icon">
                        <Icon name="mail" size={18} />
                      </span>
                      <span>
                        <small>Email</small>
                        <strong>{site.email}</strong>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a className="contact__row" href={telHref}>
                      <span className="card__icon">
                        <Icon name="phone" size={18} />
                      </span>
                      <span>
                        <small>Phone</small>
                        <strong>{site.phone}</strong>
                      </span>
                    </a>
                  </li>
                  <li>
                    <div className="contact__row">
                      <span className="card__icon">
                        <Icon name="pin" size={18} />
                      </span>
                      <span>
                        <small>Location</small>
                        <strong>{site.location}</strong>
                      </span>
                    </div>
                  </li>
                </ul>
                <div className="contact__actions">
                  <a href={mailHref} className="btn btn--primary">
                    <Icon name="mail" size={18} /> Send a Message
                  </a>
                  <a href={telHref} className="btn btn--ghost">
                    <Icon name="phone" size={18} /> Call Now
                  </a>
                </div>
              </div>
              <ContactForm email={site.email} />
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <p>
            © {new Date().getFullYear()} {site.name} · Virtual Assistant
          </p>
          <a href="#top">
            Back to top <Icon name="arrowUp" size={16} />
          </a>
        </div>
      </footer>

      <Motion />
    </>
  );
}
