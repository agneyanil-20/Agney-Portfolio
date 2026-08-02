/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Photo } from "../types";

export const PORTFOLIO_DATA = {
  about: {
    name: "Agney",
    role: "Creative Lead & Product Designer",
    subRole: "Building AI-powered digital experiences",
    location: "Kerala, India",
    coordinates: "Based in Kerala, India",
    socials: {
      instagram: "https://www.instagram.com/agney__anil_kallil?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
      whatsapp: "https://wa.me/917907939730",
      behance: "https://www.behance.net/agneyanil"
    },
    bioShort: "I'm Agney, a Creative Lead and Product Designer from Kerala. I design digital experiences, build AI-powered products, and help businesses turn ideas into scalable solutions.",
    bioLong: [
      "Hi, I'm Agney.",
      "I'm a Creative Lead, UI/UX Designer, and AI Builder from Kerala, India.",
      "I specialize in creating digital products, websites, and brand experiences that combine design thinking with modern AI-powered workflows.",
      "Over the past few years, I've evolved from a graphic designer into a product-focused designer, leading creative teams, building web applications, and launching AI-assisted digital experiences.",
      "I enjoy experimenting with new technologies, designing intuitive interfaces, and turning ideas into products people actually use."
    ],
    philosophy: [
      {
        title: "Design with Purpose",
        description: "Every interface should solve a problem, guide a decision, or create a memorable experience."
      },
      {
        title: "AI as a Creative Partner",
        description: "I use AI to accelerate ideation, prototyping, and execution while keeping human creativity at the center."
      },
      {
        title: "Ship, Learn, Improve",
        description: "Great products are built through iteration, testing, and continuous refinement."
      }
    ],
    skills: {
      design: ["UI Design", "UX Design", "Product Design", "Design Systems", "Prototyping", "Branding"],
      development: ["Google AI Studio", "Claude / Antigravity", "Lovable", "Supabase", "Vercel", "Cloudinary"],
      leadership: ["Creative Direction", "Team Leadership", "Client Communication", "Project Planning"]
    },
    timeline: [
      { 
        year: "2025 — Present", 
        role: "Creative Lead & UI/UX Designer", 
        company: "Cntrl M",
        details: [
          "Leading a multidisciplinary creative team of designers and content creators.",
          "Managing design systems, website projects, client branding, and product experiences.",
          "Designing websites, dashboards, AI tools, and internal systems.",
          "Introducing AI-assisted workflows using Google AI Studio, Claude, and other modern tools.",
          "Collaborating directly with clients to transform business requirements into digital experiences.",
          "Ensuring quality, consistency, and timely delivery across multiple client accounts."
        ]
      },
      { 
        year: "2024 — 2025", 
        role: "Graphic Designer", 
        company: "NBT",
        details: [
          "Created digital campaigns, branding assets, and social media content for multiple brands.",
          "Worked closely with marketing teams to develop performance-driven creative solutions.",
          "Developed visual identities, promotional materials, and campaign concepts.",
          "Built strong foundations in branding, typography, layout design, and creative problem-solving."
        ]
      },
      {
        year: "2023 — 2024",
        role: "Freelance UI Designer & Branding Specialist",
        company: "Independent",
        details: [
          "Delivered bespoke digital solutions for startups and local businesses.",
          "Specialized in minimalist web design and cohesive visual identity systems.",
          "Managed end-to-end creative processes from discovery to final delivery."
        ]
      },
      {
        year: "2022 — 2023",
        role: "Creative Intern",
        company: "Pixel Perfect Studio",
        details: [
          "Assisted in the creation of visual content for social media and web platforms.",
          "Gained hands-on experience with industry-standard design tools and workflows.",
          "Contributed to brainstorming sessions for client branding projects."
        ]
      }
    ],
    highlights: [
      "Leading creative direction and UI/UX design for multiple brands across education, SaaS, retail, and service industries.",
      "Designed and launched production-ready websites, dashboards, and digital experiences.",
      "Built AI-assisted products and internal tools using Google AI Studio, Claude, and Lovable.",
      "Established scalable design workflows that improved team collaboration and consistency.",
      "Bridging design and development to rapidly prototype and ship digital products."
    ]
  },
  featuredWork: [
    {
      id: "luxe-moto",
      title: "Luxe Moto",
      category: "Automotive UI/UX Concept",
      year: "2026",
      tagline: "A premium automotive web experience crafted to bring luxury, performance, and trust into a modern digital environment.",
      description: "Designed in Figma, the project explores how thoughtful user experience and elegant visual design can transform customer interaction with luxury vehicle brands online.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782135604/Untitled_desighhn_avr4mb.jpg",
      details: [
        "Premium automotive website design",
        "Luxury-inspired visual language",
        "High-end user experience design",
        "Customer-centric navigation flow"
      ],
      technologies: ["Figma", "UI/UX Design", "User Flows", "Prototyping"],
      projectUrl: "https://luxemoto.in/",
      buttonText: "View Case Study"
    },
    {
      id: "cntrl-m",
      title: "Cntrl M",
      category: "Digital Agency & Design System",
      year: "2025",
      tagline: "Creative direction, website design, and scalable design system empowering high-throughput creative production.",
      description: "Comprehensive product design and brand platform created for creative team management, client deliverables, and rapid agency execution.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229383/WhatsApp_Image_2026-06-23_at_9.09.38_PM_kmgjnv.jpg",
      details: [
        "Creative direction & web architecture",
        "Scalable client design system",
        "Internal project management workflows",
        "Client branding & digital guidelines"
      ],
      technologies: ["Creative Direction", "UI/UX Design", "Design Systems", "Web Architecture"],
      projectUrl: "https://www.cntrlm.com/",
      buttonText: "View Case Study"
    }
  ] as Project[],
  aiProducts: [
    {
      id: "sound-sketchbook",
      title: "Sound Sketchbook",
      category: "Creative Audio Exploration Platform",
      year: "2026",
      tagline: "An experimental digital sketchbook for documenting, exploring, and interacting with sound-based ideas, concepts, and audio experiences.",
      description: "Created as a space for experimentation where technology, audio APIs, and design converge into a single creative workflow.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782136970/Sound_Sketchbook_wqxlty.jpg",
      details: [
        "Interactive audio-first user experience",
        "Lightweight architecture for smooth playback and navigation",
        "Designed to encourage exploration and creative discovery"
      ],
      technologies: ["React", "Next.js", "Audio APIs", "Tailwind CSS"],
      projectUrl: "https://sound-sketchbook.vercel.app",
      buttonText: "See Website",
      fullWriteup: `# Sound Sketchbook

## Overview

Sound Sketchbook is a browser-based music player that reimagines the traditional streaming experience. Instead of following the familiar Spotify or Apple Music design language, the goal was to create an interface that felt like a designer's sketchbook—minimal, expressive, and distraction-free.

The project was built as an experiment to explore how AI-assisted design and development could be used to create a unique digital product from concept to deployment.

---

## The Idea

Most music streaming platforms share a similar interface and user experience. Rather than recreating another streaming app, I wanted to design something that reflected creativity and craftsmanship.

The concept was inspired by the feeling of sketching ideas on paper—where every line feels intentional and every interaction feels handcrafted.

---

## Design Direction

The interface was built around a distinctive visual language featuring:

* Sketchbook-inspired UI
* Minimal monochrome palette
* Grid paper backgrounds
* Hand-drawn borders and icons
* Technical annotations
* Brutalist typography
* Analog-inspired playback controls

Every design decision was made to ensure the application had its own identity instead of resembling existing music streaming platforms.

---

## AI Tools & Technologies

### Design & Ideation

* Google AI Studio
* ChatGPT
* Stitch

### Development

* Google AI Studio
* Vercel

### Music APIs & Services Explored

Finding a reliable music source turned out to be one of the biggest challenges. During development, several services and APIs were researched and tested, including:

* Spotify Web API
* YouTube Music
* YouTube Data API
* Deezer API
* Jamendo API
* SoundCloud integrations
* Public MP3 sources
* Open music databases

Each platform introduced different limitations, including authentication requirements, licensing restrictions, playback limitations, unavailable preview URLs, or inconsistent search results.

---

## Challenges

### Building a Unique Music Experience

The first challenge was avoiding a generic streaming interface. Most AI-generated layouts naturally resembled Spotify or Apple Music.

This was solved through continuous design iterations, visual experimentation, and prompt refinement until the interface developed its own recognizable identity.

---

### Finding a Reliable Music Source

The biggest technical challenge wasn't building the interface—it was finding a dependable way to search and play music.

Many APIs initially appeared suitable but quickly revealed limitations:

* OAuth authentication complexity
* Regional content restrictions
* Limited preview durations
* Missing playback support
* Rate limits
* Inconsistent metadata
* Licensing restrictions

Several music providers were tested before settling on an approach that balanced usability, reliability, and technical feasibility.

---

### AI Iteration

Rather than generating the project with a single prompt, AI was used throughout the entire process.

Each stage involved multiple rounds of:

* Prompt engineering
* Layout refinement
* UI improvements
* Debugging
* Code optimization
* Feature testing

The final product was created through continuous iteration rather than one-click generation.

---

## What I Learned

* AI works best as a collaborative tool rather than a replacement for design thinking.
* A strong product identity comes from clear creative direction, not just good prompts.
* Integrating third-party services often takes significantly more effort than designing the interface itself.
* Rapid iteration with AI dramatically reduces development time while encouraging experimentation.

---

## Outcome

Sound Sketchbook evolved from a simple music player concept into an exploration of AI-assisted product design. The project demonstrates how thoughtful design, iterative problem-solving, and modern AI tools can be combined to create a product with a distinctive visual identity while overcoming real-world technical constraints.`
    },
    {
      id: "photobooth",
      title: "Photobooth",
      category: "Interactive Event Photography Experience",
      year: "2025",
      tagline: "A modern digital photobooth designed to create memorable event experiences through instant capture, sharing, and interactive engagement.",
      description: "Built with simplicity and speed in mind, allowing users to focus on the moment while seamlessly generating shareable content.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782136614/photobooth1_wuqtdt.jpg",
      details: [
        "Fast image capture and processing workflow",
        "Mobile-first experience for events and social sharing",
        "Optimized interface designed for high-volume user interaction"
      ],
      technologies: ["React", "Next.js", "Tailwind CSS"],
      projectUrl: "https://photobooth-agney.vercel.app",
      buttonText: "See Website"
    },
    {
      id: "neeli",
      title: "Neeli",
      category: "Experimental Storytelling Platform",
      year: "2026",
      tagline: "A digital storytelling experience exploring folklore, mystery, and imagination through AI-assisted narratives and immersive interactions.",
      description: "Designed to blur the line between fiction and technology, Neeli transforms traditional storytelling into a dynamic experience where curiosity drives discovery.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782136236/Untitlesdfsdfd_design_asb5cz.jpg",
      details: [
        "AI-powered narrative generation and interactive story flow",
        "Responsive experience optimized for desktop and mobile devices",
        "Immersive visual language inspired by folklore and atmospheric storytelling"
      ],
      technologies: ["React", "Next.js", "Tailwind CSS", "AI Integration"],
      projectUrl: "https://neeli.vercel.app",
      buttonText: "See Website",
      fullWriteup: `# NEELI

## Overview

NEELI is a location-based paranormal folklore exploration platform that transforms regional ghost stories and urban legends into an immersive digital experience. Rather than creating a horror game, the objective was to preserve local folklore by allowing users to discover stories tied to real-world locations through an interactive investigation interface.

The project combines GPS mapping, camera-based exploration, and structured folklore archives to create a cinematic experience inspired by the myths and legends of South India.

---

## The Idea

Every village, town, and city has its own paranormal legends that slowly disappear over time. NEELI was created to document these stories and present them as an interactive folklore archive rather than fictional horror content.

Users can explore nearby locations, investigate reported paranormal hotspots, and learn about regional entities through detailed archives containing their origin, history, location, and cultural significance.

The goal was to create a platform that feels mysterious, immersive, and respectful to the folklore that inspired it.

---

## Design Direction

The interface was designed to resemble a professional paranormal investigation system instead of a horror game.

The visual language focused on:

* Dark cinematic interface
* Liquid glass design elements
* Interactive GPS-based mapping
* Minimal glowing location markers
* Investigation dashboard
* Ghost archive and dossiers
* Atmospheric typography
* Immersive transitions

Every design decision was intended to make users feel like investigators exploring real folklore rather than players in a fictional game.

---

## Development

### Platform

* Antigravity
* Vercel

### Core Features

During development, the application was designed around several core systems:

* GPS-based location mapping
* Camera investigation mode
* Regional folklore database
* Ghost archive
* Entity profile system
* Investigation dashboard
* Nearby paranormal hotspot detection
* Search by location
* Interactive investigation interface

---

## Challenges

### Creating a Serious Investigation Experience

One of the biggest challenges was avoiding the appearance of a horror game.

Early concepts felt overly dramatic and game-like. The design direction was refined into a cinematic investigation platform where folklore, history, and storytelling became the primary focus.

---

### Building Location-Based Exploration

The application was designed so that stories remain connected to their real-world locations rather than appearing randomly.

This required planning a location-first experience where users discover folklore based on their surroundings, making exploration feel authentic and meaningful.

---

### Organizing the Ghost Archive

Each paranormal entity required a structured profile containing:

* Origin
* Story
* Location
* Activity period
* Sighting history
* Regional folklore
* Investigation notes

Designing this information architecture required multiple iterations to balance readability with immersive storytelling.

---

### Balancing Mystery and Usability

The interface needed to create curiosity without overwhelming the user.

Visual effects, animations, and interactions were carefully refined so that the experience remained immersive while keeping navigation simple and intuitive.

---

## What I Learned

* Strong storytelling creates memorable digital experiences.
* Location-based products require careful UX planning and information architecture.
* Building around regional folklore requires balancing creativity with authenticity.
* A clear product vision is essential when developing unconventional digital experiences.

---

## Outcome

NEELI evolved from a simple ghost exploration concept into a location-based folklore platform that combines mapping, storytelling, and immersive design. The project demonstrates how thoughtful product design can preserve regional legends while creating an engaging digital experience that feels both modern and culturally connected.`
    }
  ] as Project[],
  projects: [
    {
      id: "luxe-moto",
      title: "Luxe Moto",
      category: "Automotive UI/UX Concept",
      year: "2026",
      tagline: "A premium automotive web experience crafted to bring luxury, performance, and trust into a modern digital environment.",
      description: "Designed in Figma, the project explores how thoughtful user experience and elegant visual design can transform customer interaction with luxury vehicle brands online.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782135604/Untitled_desighhn_avr4mb.jpg",
      details: [
        "Premium automotive website design",
        "Luxury-inspired visual language",
        "High-end user experience design"
      ],
      technologies: ["Figma", "UI/UX Design", "User Flows", "Prototyping"],
      projectUrl: "https://luxemoto.in/",
      buttonText: "View Case Study"
    },
    {
      id: "cntrl-m",
      title: "Cntrl M",
      category: "Digital Agency & Design System",
      year: "2025",
      tagline: "Creative direction, website design, and scalable design system.",
      description: "Comprehensive product design and brand platform for creative production.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229383/WhatsApp_Image_2026-06-23_at_9.09.38_PM_kmgjnv.jpg",
      details: ["Creative direction & web architecture", "Scalable client design system"],
      technologies: ["Creative Direction", "UI/UX Design", "Design Systems"],
      projectUrl: "https://www.cntrlm.com/",
      buttonText: "View Case Study"
    },
    {
      id: "sound-sketchbook",
      title: "Sound Sketchbook",
      category: "Creative Audio Exploration Platform",
      year: "2026",
      tagline: "An experimental digital sketchbook for audio experiences.",
      description: "A creative canvas where audio APIs and design converge.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782136970/Sound_Sketchbook_wqxlty.jpg",
      details: ["Interactive audio-first user experience"],
      technologies: ["React", "Next.js", "Audio APIs"],
      projectUrl: "https://sound-sketchbook.vercel.app",
      buttonText: "See Website"
    },
    {
      id: "photobooth",
      title: "Photobooth",
      category: "Interactive Event Photography Experience",
      year: "2025",
      tagline: "A modern digital photobooth designed for instant capture and sharing.",
      description: "Mobile-first instant photo processing workflow.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782136614/photobooth1_wuqtdt.jpg",
      details: ["Fast image capture and processing workflow"],
      technologies: ["React", "Next.js", "Tailwind CSS"],
      projectUrl: "https://photobooth-agney.vercel.app",
      buttonText: "See Website"
    },
    {
      id: "neeli",
      title: "Neeli",
      category: "Experimental Storytelling Platform",
      year: "2026",
      tagline: "A digital storytelling experience exploring folklore through AI.",
      description: "Blurring fiction and technology with generative narrative flows.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782136236/Untitlesdfsdfd_design_asb5cz.jpg",
      details: ["AI-powered narrative generation"],
      technologies: ["React", "Next.js", "AI Integration"],
      projectUrl: "https://neeli.vercel.app",
      buttonText: "See Website"
    }
  ] as Project[],
  photography: [
    {
      id: "photo-1",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229383/WhatsApp_Image_2026-06-23_at_9.09.38_PM_kmgjnv.jpg",
      caption: "Coastal observations and architectural contrasts.",
      location: "Thalassery",
      coordinates: "11.7491° N, 75.4890° E"
    },
    {
      id: "photo-2",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229382/WhatsApp_Image_2026-06-23_at_9.09.37_PM_qgowuu.jpg",
      caption: "Urban geometry and industrial textures of the port city.",
      location: "Kochi",
      coordinates: "9.9312° N, 76.2673° E",
      date: "Jun 2026"
    },
    {
      id: "photo-3",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229382/WhatsApp_Image_2026-06-23_at_9.09.37_PM_1_xpcdbr.jpg",
      caption: "The profound expression and detail of Kadhakali performance art.",
      location: "Kadhakali",
      coordinates: "Kerala, India",
      date: "Jun 2026"
    },
    {
      id: "photo-4",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229382/WhatsApp_Image_2026-06-23_at_9.09.35_PM_ihwtoy.jpg",
      caption: "Exploring visual silence through minimalist compositions.",
      location: "Kerala",
      coordinates: "India",
      date: "Jun 2026"
    }
  ] as Photo[],
  visualDesign: [
    {
      id: "vis-1",
      title: "Brand Identities & Systems",
      category: "Branding & Typography",
      year: "2026",
      tagline: "Cohesive brand identity, custom typography systems, and multi-channel design guidelines.",
      description: "A comprehensive exploration of visual identity systems designed for modern digital and physical platforms.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229383/WhatsApp_Image_2026-06-23_at_9.09.38_PM_kmgjnv.jpg",
      projectUrl: "https://www.behance.net/agneyanil",
      buttonText: "View Project"
    },
    {
      id: "vis-2",
      title: "Poster Architecture & Editorial",
      category: "Print & Graphic Design",
      year: "2026",
      tagline: "Experimental poster compositions, layout graphics, and editorial art exploring visual rhythm.",
      description: "Minimalist poster design series examining negative space, brutalist grid layouts, and Swiss typography.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229382/WhatsApp_Image_2026-06-23_at_9.09.37_PM_1_xpcdbr.jpg",
      projectUrl: "https://www.behance.net/agneyanil",
      buttonText: "View Project"
    },
    {
      id: "vis-3",
      title: "Social Creatives & Campaigns",
      category: "Social Media & Marketing",
      year: "2025",
      tagline: "High-impact social media creatives, motion graphics, and digital marketing campaign assets.",
      description: "Strategic visual campaign assets engineered to drive engagement across digital marketing touchpoints.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229382/WhatsApp_Image_2026-06-23_at_9.09.37_PM_qgowuu.jpg",
      projectUrl: "https://www.behance.net/agneyanil",
      buttonText: "View Project"
    },
    {
      id: "vis-4",
      title: "Visual Storytelling & Art Direction",
      category: "Art Direction",
      year: "2026",
      tagline: "Atmospheric visual narratives, photography direction, and digital art storytelling.",
      description: "Curated visual storytelling combining photography, minimalist composition, and cultural imagery.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782229382/WhatsApp_Image_2026-06-23_at_9.09.35_PM_ihwtoy.jpg",
      projectUrl: "https://www.behance.net/agneyanil",
      buttonText: "View Project"
    },
    {
      id: "vis-5",
      title: "Luxe Automotive Graphics",
      category: "Visual Experience",
      year: "2026",
      tagline: "High-end visual asset design and luxury automotive marketing materials.",
      description: "Crafting luxury automotive visuals and modern UI artwork for high-performance concept cars.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782135604/Untitled_desighhn_avr4mb.jpg",
      projectUrl: "https://www.behance.net/agneyanil",
      buttonText: "View Project"
    },
    {
      id: "vis-6",
      title: "Experimental Audio Visuals",
      category: "Creative Media",
      year: "2026",
      tagline: "Abstract audio-visual explorations, generative artwork, and digital cover art.",
      description: "Interdisciplinary visual design merging sound concepts with graphic poster compositions.",
      imageUrl: "https://res.cloudinary.com/demmybfne/image/upload/v1782136970/Sound_Sketchbook_wqxlty.jpg",
      projectUrl: "https://www.behance.net/agneyanil",
      buttonText: "View Project"
    }
  ] as Project[]
};
