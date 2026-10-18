/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState, type CSSProperties } from "react";
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

function ProjectCard({ project, index, progress, animated, onFocus }: {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  animated: boolean;
  onFocus: () => void;
}) {
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
      <motion.img
        src={project.imageUrl}
        alt={project.title}
        referrerPolicy="no-referrer"
        draggable={false}
        decoding="async"
        style={{ y: animated ? imageY : 0 }}
      />
      <div className="floating-work-open" aria-hidden="true"><ArrowUpRight size={24} /></div>
    </div>
    <div className="floating-work-info">
      <div className="floating-work-meta">
        <span>{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        <span>{project.year}</span>
      </div>
      <div className="floating-work-title">
        <h3>{project.title}</h3>
        <p>{project.category}</p>
      </div>
      <p className="floating-work-description">{project.description || project.tagline}</p>
    </div>
  </>;

  return <motion.article className="floating-work-card" style={style} aria-labelledby={`work-${project.id}`}>
    {project.projectUrl ? <a
      id={`work-${project.id}`}
      href={project.projectUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${project.title} website (opens in a new tab)`}
      data-cursor="interactive"
      onFocus={onFocus}
    >{content}</a> : <div id={`work-${project.id}`}>{content}</div>}
  </motion.article>;
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);
  const [geometry, setGeometry] = useState({ distance: 0, height: 0 });
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -geometry.distance]);

  useEffect(() => {
    // Small windows and reduced-motion settings use normal document flow.
    const query = window.matchMedia("(min-width: 900px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
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
      setGeometry({ distance: Math.max(0, track.scrollWidth - viewport.clientWidth), height: viewport.clientHeight });
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

  const goToProject = (index: number, behavior: ScrollBehavior = "smooth") => {
    const section = sectionRef.current;
    if (!animated || !section || !geometry.distance) return;
    const progress = Math.max(0, Math.min(projects.length - 1, index)) / Math.max(1, projects.length - 1);
    window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY + progress * geometry.distance, behavior });
  };

  return <section
    id="projects"
    ref={sectionRef}
    className={`floating-works${animated ? " floating-works-animated" : ""}`}
    aria-labelledby="works-heading"
    style={animated && geometry.height ? { height: geometry.height + geometry.distance } : undefined}
  >
    <div className="floating-works-viewport" ref={viewportRef}>
      <header className="floating-works-header">
        <div className="floating-works-heading"><h2 id="works-heading">Works</h2><span>(SELECTED WORKS)</span></div>
        {animated && <p className="floating-works-hint">Scroll to explore <ArrowDown size={14} /></p>}
      </header>
      <motion.div className="floating-works-track" ref={trackRef} style={{ x: animated ? x : 0 }}>
        {projects.map((project, index) => <ProjectCard
          key={project.id}
          project={project}
          index={index}
          progress={scrollYProgress}
          animated={animated}
          onFocus={() => goToProject(index, "instant")}
        />)}
      </motion.div>
      {animated && <nav className="floating-works-nav" aria-label="Browse selected works">
        <div className="floating-works-index">
          {projects.map((project, index) => <button
            key={project.id}
            type="button"
            aria-label={`Show ${project.title}`}
            aria-current={active === index ? "step" : undefined}
            onClick={() => goToProject(index)}
            data-cursor="interactive"
          >{String(index + 1).padStart(2, "0")}</button>)}
        </div>
        <div className="floating-works-arrows">
          <button type="button" onClick={() => goToProject(active - 1)} disabled={active === 0} aria-label="Previous project" data-cursor="interactive"><ArrowLeft size={19} /></button>
          <button type="button" onClick={() => goToProject(active + 1)} disabled={active === projects.length - 1} aria-label="Next project" data-cursor="interactive"><ArrowRight size={19} /></button>
        </div>
      </nav>}
    </div>
  </section>;
}
