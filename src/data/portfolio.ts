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
      projectUrl: "https://www.behance.net/agneyanil",
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
      badge: "AI PRODUCT",
      buttonText: "Live Demo"
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
      badge: "AI PRODUCT",
      buttonText: "Live Demo"
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
      badge: "AI PRODUCT",
      buttonText: "Live Demo"
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
      projectUrl: "https://www.behance.net/agneyanil",
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
      badge: "AI PRODUCT",
      buttonText: "Live Demo"
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
      badge: "AI PRODUCT",
      buttonText: "Live Demo"
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
      badge: "AI PRODUCT",
      buttonText: "Live Demo"
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
  ] as Photo[]
};
