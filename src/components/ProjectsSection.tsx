/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { PORTFOLIO_DATA } from "../data/portfolio";
import type { Project } from "../types";
import "./ProjectsSection.css";

const desiredOrder = ["luxe-moto", "speeki-ai", "cntrl-m", "sound-sketchbook", "photobooth", "neeli"];
const projects = [...PORTFOLIO_DATA.projects].sort((a, b) => {
  const rank = (id: string) => desiredOrder.includes(id) ? desiredOrder.indexOf(id) : desiredOrder.length;
  return rank(a.id) - rank(b.id);
});
const colors = ["#d6cfc5", "#c5d1df", "#ff493e", "#daddcc", "#dbd1e0", "#242c2d"];
const animationQuery = "(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)";

function ProjectCard({ project, index, progress, animated, onFocus }: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  animated: boolean;
  onFocus: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const center = index / Math.max(1, projects.length - 1);
  const y = useTransform(progress, [center - 0.3, center, center + 0.3], [24, 0, -24]);
  const imageY = useTransform(progress, [center - 0.3, center + 0.3], ["-3%", "3%"]);
  const palette = index % colors.length;
  const style = {
    "--card-color": colors[palette],
    "--card-ink": palette === colors.length - 1 ? "#f7f7f9" : "#121212",
    "--card-offset": index % 2 ? "18px" : "0px",
    y: animated ? y : 0,
  } as CSSProperties & { y: MotionValue<number> | number };

  const content = <>
    <div className="floating-work-image">
      {imageFailed ? <p className="floating-work-image-fallback">Preview unavailable. Open {project.title} to explore the project.</p> : <motion.img
        src={project.imageUrl}
        alt={project.title}
        referrerPolicy="no-referrer"
        draggable={false}
        decoding="async"
        loading="lazy"
        width={1600}
        height={1000}
        onError={() => setImageFailed(true)}
        style={{ y: animated ? imageY : 0 }}
      />}
      {project.projectUrl && <div className="floating-work-open" aria-hidden="true"><ArrowUpRight size={24} /></div>}
    </div>
    <div className="floating-work-info">
      <div className="floating-work-meta">
        <span>{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        <span>{project.year}</span>
      </div>
      <div className="floating-work-title">
        <h3 id={`work-title-${project.id}`} translate="no">{project.title}</h3>
        <p>{project.category}</p>
      </div>
      <p className="floating-work-description">{project.description || project.tagline}</p>
    </div>
  </>;

  return <motion.article id={`work-${project.id}`} className="floating-work-card" style={style} aria-labelledby={`work-title-${project.id}`}>
    {project.projectUrl ? <a
      href={project.projectUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-labelledby={`work-title-${project.id}`}
      aria-describedby="work-link-help"
      data-cursor="interactive"
      onFocus={(event) => {
        // Pointer clicks must not move the card out from under the pointer.
        if (event.currentTarget.matches(":focus-visible")) onFocus();
      }}
    >{content}</a> : <div>{content}</div>}
  </motion.article>;
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(() => window.matchMedia(animationQuery).matches && projects.length > 1);
  const [geometry, setGeometry] = useState({ distance: 0, height: 0 });
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -geometry.distance]);

  useEffect(() => {
    // Small windows and reduced-motion settings use normal document flow.
    const query = window.matchMedia(animationQuery);
    const update = () => setAnimated(query.matches && projects.length > 1);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!animated || !trackRef.current || !viewportRef.current) return;
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      const distance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      const height = viewport.clientHeight;
      setGeometry(previous => previous.distance === distance && previous.height === height ? previous : { distance, height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(trackRef.current);
    observer.observe(viewportRef.current);
    measure();
    return () => observer.disconnect();
  }, [animated]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    setActive(Math.round(value * Math.max(0, projects.length - 1)));
  });

  const goToProject = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const section = sectionRef.current;
    if (!section) return;
    if (!animated) {
      document.getElementById(`work-${projects[index]?.id}`)?.scrollIntoView({ block: "start", behavior: "instant" });
      return;
    }
    if (!geometry.distance) return;
    const progress = Math.max(0, Math.min(projects.length - 1, index)) / Math.max(1, projects.length - 1);
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY + progress * geometry.distance, behavior });
  }, [animated, geometry.distance]);

  useEffect(() => {
    const restoreProject = () => {
      const index = projects.findIndex(project => window.location.hash === `#work-${project.id}`);
      if (index !== -1) goToProject(index, "instant");
    };
    restoreProject();
    window.addEventListener("hashchange", restoreProject);
    window.addEventListener("popstate", restoreProject);
    return () => {
      window.removeEventListener("hashchange", restoreProject);
      window.removeEventListener("popstate", restoreProject);
    };
  }, [goToProject]);

  const selectProject = (index: number) => {
    const hash = `#work-${projects[index].id}`;
    if (window.location.hash !== hash) window.history.pushState(null, "", hash);
    goToProject(index);
  };

  const navigateToProject = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    // Retain native new-tab, copy-link, and modified-click behavior.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    selectProject(index);
  };

  return <section
    id="projects"
    ref={sectionRef}
    className={`floating-works${animated ? " floating-works-animated" : ""}`}
    aria-labelledby="works-heading"
    tabIndex={-1}
    style={animated && geometry.height ? { height: geometry.height + geometry.distance } : undefined}
  >
    <div className="floating-works-viewport" ref={viewportRef}>
      <p id="work-link-help" className="sr-only">Visit project website. Opens in a new tab.</p>
      <header className="floating-works-header">
        <div className="floating-works-heading"><h2 id="works-heading">Works</h2><span>(SELECTED WORKS)</span></div>
        <div className="floating-works-header-actions">
          {animated && <p className="floating-works-hint">Scroll to explore <ArrowDown size={14} aria-hidden="true" /></p>}
          <a className="floating-works-skip" href="#photography">Skip to photography</a>
        </div>
      </header>
      <motion.div className="floating-works-track" ref={trackRef} style={{ x: animated ? x : 0 }}>
        {projects.map((project, index) => <ProjectCard
          key={project.id}
          project={project}
          index={index}
          progress={scrollYProgress}
          animated={animated}
          onFocus={() => { if (animated) goToProject(index, "instant"); }}
        />)}
      </motion.div>
      {animated && <nav className="floating-works-nav" aria-label="Browse selected works">
        <div className="floating-works-index">
          {projects.map((project, index) => <a
            key={project.id}
            href={`#work-${project.id}`}
            aria-label={`Show ${project.title}`}
            aria-current={active === index ? "step" : undefined}
            onClick={(event) => navigateToProject(event, index)}
            data-cursor="interactive"
          >{String(index + 1).padStart(2, "0")}</a>)}
        </div>
        <div className="floating-works-arrows">
          <button type="button" onClick={() => selectProject(active - 1)} disabled={active === 0} aria-label="Previous project" data-cursor="interactive"><ArrowLeft size={19} aria-hidden="true" /></button>
          <button type="button" onClick={() => selectProject(active + 1)} disabled={active === projects.length - 1} aria-label="Next project" data-cursor="interactive"><ArrowRight size={19} aria-hidden="true" /></button>
        </div>
      </nav>}
    </div>
  </section>;
}
