/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Photo, Experiment } from "../types";

export const PORTFOLIO_DATA = {
  about: {
    name: "Agney",
    role: "Designer & Creative Technologist",
    location: "Stockholm, SE",
    coordinates: "59.3293° N, 18.0686° E",
    bioLong: [
      "Hi, I'm Agney.",
      "I'm a designer driven by curiosity, experimentation, and a desire to create meaningful experiences. My work often sits between design, technology, and storytelling, where ideas evolve through exploration rather than routine.",
      "I enjoy building digital products, testing new concepts, and turning abstract thoughts into tangible experiences. Most of my projects begin with a simple question and grow through research, iteration, and a willingness to try something different.",
      "This website is a collection of those explorations projects, ideas, and experiments that reflect how I think, create, and learn."
    ],
    philosophy: [
      {
        title: "Rigid Grids, Organic Content",
        description: "Standardize the canvas using structural systems, then break them with responsive, dynamic layers of organic movement."
      },
      {
        title: "Substraction over Ornamentation",
        description: "Good design is a result of progressive reduction. If an element can be removed without losing clarity, delete it immediately."
      },
      {
        title: "Code is a Design Medium",
        description: "Translating static Figma blueprints into code often loses the tactile soul of interactions. We explore design directly in the browser."
      }
    ],
    skills: ["Creative Direction", "Front-end Architecture", "Interactions Design", "WebGL / Shaders", "Editorial Brand Systems", "Visual Research"],
    timeline: [
      { year: "2024 — Present", role: "Principal Creative Director", company: "Independent practice, Stockholm" },
      { year: "2021 — 2024", role: "Senior UX Designer / Interaction Dev", company: "Aino Studio, Gothenburg" },
      { year: "2019 — 2021", role: "Digital Brand Architect", company: "Snøhetta Lab, Oslo" },
      { year: "2017 — 2019", role: "Interactive Developer", company: "North Kingdom, Stockholm" }
    ]
  },
  projects: [
    {
      id: "luxe-moto",
      title: "Luxe Moto",
      category: "Automotive UI/UX Concept",
      year: "2026",
      tagline: "A premium automotive web experience crafted to bring luxury, performance, and trust into a modern digital environment.",
      description: "Designed in Figma, the project explores how thoughtful user experience and elegant visual design can transform the way customers interact with luxury vehicle brands online.",
      imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80",
      details: [
        "Premium automotive website design",
        "Luxury-inspired visual language",
        "High-end user experience design",
        "Responsive interface exploration",
        "Customer-centric navigation flow",
        "Modern design system approach"
      ],
      technologies: ["Figma", "UI Design", "UX Design", "User Flows", "Wireframing", "Prototyping"],
      projectUrl: "https://luxemoto.in/"
    },
    {
      id: "neeli",
      title: "Neeli",
      category: "Experimental Storytelling Platform",
      year: "2026",
      tagline: "A digital storytelling experience exploring folklore, mystery, and imagination through AI-assisted narratives and immersive interactions.",
      description: "Designed to blur the line between fiction and technology, Neeli transforms traditional storytelling into a dynamic experience where curiosity drives discovery.",
      imageUrl: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80",
      details: [
        "AI-powered narrative generation and interactive story flow",
        "Responsive experience optimized for desktop and mobile devices",
        "Immersive visual language inspired by folklore and atmospheric storytelling"
      ],
      technologies: ["React", "Next.js", "Tailwind CSS", "AI Integration"],
      projectUrl: "https://neeli.vercel.app"
    },
    {
      id: "photobooth",
      title: "Photobooth",
      category: "Interactive Event Photography Experience",
      year: "2025",
      tagline: "A modern digital photobooth designed to create memorable event experiences through instant capture, sharing, and interactive engagement.",
      description: "Built with simplicity and speed in mind, allowing users to focus on the moment while seamlessly generating shareable content.",
      imageUrl: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1200&q=80",
      details: [
        "Fast image capture and processing workflow",
        "Mobile-first experience for events and social sharing",
        "Optimized interface designed for high-volume user interaction"
      ],
      technologies: ["React", "Next.js", "Tailwind CSS"],
      projectUrl: "https://photobooth-agney.vercel.app"
    },
    {
      id: "sound-sketchbook",
      title: "Sound Sketchbook",
      category: "Creative Audio Exploration Platform",
      year: "2026",
      tagline: "An experimental digital sketchbook for documenting, exploring, and interacting with sound-based ideas, concepts, and audio experiences.",
      description: "Created as a space for experimentation where technology, audio, and design converge into a single creative workflow.",
      imageUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80",
      details: [
        "Interactive audio-first user experience",
        "Lightweight architecture for smooth playback and navigation",
        "Designed to encourage exploration and creative discovery"
      ],
      technologies: ["React", "Next.js", "Audio APIs", "Tailwind CSS"],
      projectUrl: "https://sound-sketchbook.vercel.app"
    }
  ] as Project[],
  photography: [
    {
      id: "photo-1",
      imageUrl: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=80",
      caption: "Spiraling raw-concrete staircase reflecting natural northern light.",
      location: "Kulturhuset, Stockholm",
      coordinates: "59.3323° N, 18.0645° E",
      date: "Nov 2025"
    },
    {
      id: "photo-2",
      imageUrl: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=1000&q=80",
      caption: "Abstract geometry of modern suspension cables crossing negative sky space.",
      location: "Höga Kusten Bridge, Sweden",
      coordinates: "62.7972° N, 17.9383° E",
      date: "Sep 2025"
    },
    {
      id: "photo-3",
      imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1000&q=80",
      caption: "Stark shadow cast by brutalist structural columns during winter solstice.",
      location: "Stockholm University, SE",
      coordinates: "59.3644° N, 18.0583° E",
      date: "Dec 2025"
    },
    {
      id: "photo-4",
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      caption: "Vertical monolithic block concrete texture against raw Scandinavian rock.",
      location: "Nacka Strand, SE",
      coordinates: "59.3167° N, 18.1500° E",
      date: "Mar 2026"
    },
    {
      id: "photo-5",
      imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
      caption: "Symmetrical layout of ocean waves on cold sands during early sunrise blur.",
      location: "Visby Beach, Gotland",
      coordinates: "57.6349° N, 18.2913° E",
      date: "Apr 2026"
    }
  ] as Photo[],
  explorations: [
    {
      id: "gravity-particles",
      title: "Coordinate Gravity Canvas",
      description: "Interactive canvas experiment where particles gravitate towards physical text layout contours and cursor pulls, creating fluid structures.",
      tech: "HTML5 Canvas, Dynamic Vector Fields"
    },
    {
      id: "kinetic-typography",
      title: "Liquid Typography Distorter",
      description: "A generative typographic interface that distorts custom content based on micro-cursor velocity and viewport scroll metrics.",
      tech: "SVG Filters, React Mouse Motion State"
    },
    {
      id: "diurnal-monolith",
      title: "Procedural Shadow Play",
      description: "Interactive brutalist block renderer that projects clean shadow angles matching the local Stockholm real-time solar path.",
      tech: "D3 Projection Coordinates, SVG Extruder"
    }
  ] as Experiment[]
};
