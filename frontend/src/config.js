
const RM=false;
// ---- Editable defaults (owner edits live content in #/admin) ----
const D={
 services:[["Web Development","Modern websites and web experiences."],["Software Development","Custom software and digital products built around real business needs."],["AI Solutions","AI-powered applications, automation, intelligent workflows, and custom AI solutions."],["UI/UX & Digital Experiences","Modern, intuitive, and user-focused digital experiences."],["Business Automation","Technology solutions that reduce repetitive work and improve workflows."],["Custom Technology Solutions","Solutions designed around specific business requirements."]],
 process:[["Discover","Understand the problem, idea, and goals."],["Strategize","Plan the right product and technology approach."],["Design","Create the experience and product structure."],["Build","Develop the actual digital solution."],["Refine","Test, improve, and optimize."],["Launch","Deploy and deliver the final product."]],
 about:{
  who:"Caventra is an engineering-focused digital solutions studio. We partner with ambitious companies, growing startups, and founders to architect, design, and engineer powerful digital products that solve concrete commercial challenges.",
  believe:"We believe custom software must be a strategic asset that accelerates business growth and operational velocity, not technical overhead. In an era saturated with fragile templates and surface-level tools, bespoke engineering provides the only defensible competitive advantage. Every product we build is designed for measurable performance, rapid load times, and effortless scalability.",
  approach:"We practice product-first engineering across six disciplined stages: Discovery, Technical Architecture, High-Fidelity UI/UX Design, Scalable Full-Stack Engineering, Rigorous Quality Verification, and Seamless Deployment. By integrating AI automation pipelines with clean architectural standards, we eliminate bloated dependencies and deliver streamlined, resilient systems that scale as your business expands.",
  philosophy:"Precision over complexity. Form follows purpose, elevated by refined aesthetics. We craft interfaces with intentional typography, intuitive user psychology, and hardware-accelerated micro-interactions. A digital product should feel effortless to the end user while remaining secure, rock-solid, and resilient under high traffic.",
  different:"Unlike traditional marketing agencies that outsource technical engineering, or template-reliant shops that lack coding depth, Caventra is an authentic technology partner. You collaborate directly with our founding engineers and architects. We bridge the gap between design sensibility, full-stack software development, and applied artificial intelligence."
},
 desc:"A software and digital solutions studio. We turn ideas into powerful digital products.",
 projects:[
  {
    "name": "Gloss Atelier",
    "slug": "gloss-atelier",
    "category": "Web Development · Experiential Web Design · 3D Interactive",
    "short": "An editorial nail-art website concept featuring interactive Three.js 3D visuals, cinematic GSAP scroll choreographies, smooth Lenis inertia, and tactile appointment booking.",
    "tech": "React 18, Vite, Three.js, GSAP, ScrollTrigger, Lenis, Tailwind CSS, HTML5 Canvas 2D",
    "client": "Independent nail-art brand concept · Client identity undisclosed (Location not yet verified)",
    "overview": "Gloss Atelier is a speculative luxury web concept crafted to explore modern editorial beauty experiences. The platform merges bespoke nail artistry with interactive Three.js 3D visualisations, silky GSAP scroll choreographies, and tactile appointment flows.\n\nDesigned as an exploration of elevated digital presence for high-end boutique services, Gloss Atelier demonstrates how fluid animations, thoughtful typography hierarchies, and reduced-motion accessibility transform routine appointment booking into an aspirational sensory journey.",
    "challenge": "Independent beauty studios and high-end nail ateliers typically rely on generic social media links or rigid template booking pages that fail to reflect the craftsmanship, texture, and bespoke artistry of their work.",
    "solution": "Caventra engineered a high-fidelity interactive concept combining hardware-accelerated 3D visualisations with frictionless WhatsApp inquiry integrations, cinematic typography, and responsive micro-interactions across mobile and desktop viewports.",
    "features": "Interactive 3D Visualisations — Real-time Three.js spatial simulations capturing dynamic specular highlights and textures\nCinematic GSAP Choreography — Fluid ScrollTrigger transitions engineered with Lenis smooth-scroll inertia\nEditorial Service Showcase — Curated treatment menus detailing structural manicures, bespoke extensions, and nail art tiers\nTactile WhatsApp Enquiry Flow — Direct booking integration connecting prospective clients directly with studio artists\nMobile-First Performance — Sub-second interaction latency with reduced-motion accessibility compliance and responsive layout scaling",
    "results": "Engineered as an internal portfolio concept showcasing advanced 3D web capabilities, responsive animation choreography, and luxury retail UI/UX design. Status: Concept Prototype (No client endorsement claimed).",
    "live": "https://hridayvayanta.github.io/testimonial-project-for-caventra/",
    "github": "",
    "cover": "/assets/projects/gloss-atelier-hero.png",
    "gallery": [
      "/assets/projects/gloss-atelier-services.png",
      "/assets/projects/gloss-atelier-story.png",
      "/assets/projects/gloss-atelier-booking.png"
    ],
    "published": true,
    "featured": true
  },
  {
    "name": "Soft Aurora",
    "slug": "soft-aurora",
    "category": "E-Commerce · Web Development · Experiential Brand Platform",
    "short": "An ultra-premium digital boutique and olfactory atelier combining fine fragrances with monolithic stone-carved luminous diffusers, real-time WebGL lighting simulations, and white-glove Cash on Delivery checkout.",
    "tech": "React 19, Vite 6, Tailwind CSS 3, WebGL Shader Engine, HTML5 Canvas 2D, JavaScript (ES6+), Lucide Icons, View Transitions API",
    "client": "Soft Aurora · Luxury Haute Parfumerie & Architectural Spatial Living (SoHo, New York, USA)",
    "overview": "Soft Aurora is an ultra-premium digital boutique and olfactory atelier that combines artisanal fine fragrances with monolithic stone-carved luminous diffusers. The platform delivers an immersive sensory shopping experience using real-time WebGL lighting simulations and a white-glove Cash on Delivery checkout system tailored for luxury collectors and interior architects.\n\nBridging the gap between physical olfactory art and digital commerce, the application transforms spatial interior living into a sensory gallery where patrons can explore fragrance compositions, calibrate light dispersion, and acquire limited-harvest flacons with zero upfront payment friction.",
    "challenge": "High-end artisanal fragrance and sculpted spatial objects depend heavily on in-person sensory fittings that traditional e-commerce templates fail to communicate. Standard storefronts look generic and transactional, lacking the prestige required for three- and four-figure luxury goods. Additionally, high-ticket private clients often abandon purchases when forced through rigid upfront payment gateways without the option to inspect the fragile hand-crafted stone flacons upon arrival.",
    "solution": "Caventra engineered a gallery-grade interactive web experience where real-time fluid lighting and optical physics replicate the physical presence of the diffusers and flacons in space. Introducing verified architectural client reviews and transparent laboratory harvest metrics eliminated all \"template\" feel, while a zero-gateway Cash on Delivery inspection model removed transaction friction—significantly increasing buyer trust and checkout completion for high-value orders.",
    "features": "Interactive 3D Rotary Scent Selector — A tactile rotary dial synchronizing olfactory pyramids, ambient throw radius, and harvest batch registrations in real time\nPhysics-Based Laser Dispersion Showcase — Real-time WebGL optical simulation demonstrating light interaction with the hand-honed Portuguese alabaster cold-vapor diffuser\nProgressive Radial Wave Theme Engine — Seamless 1.35s circular ripple transition between Light Sand and Nocturne Dark modes with zero abrupt color snapping\nBespoke 16-Product Catalog & Slide-Over Bag — Full luxury collection across Extraits, Alabaster Vessels, Beeswax Bougies, and Discovery Coffrets with real-time stock indicators and wax-sealed gift customization\nFrictionless Cash on Delivery Checkout — Doorstep package inspection guarantee with an automated, printable serialized tax invoice and dispatch tracking timeline\nUltra-Responsive Fluid UX — Sub-second interaction response with zero runtime page-builder bloat and optimized canvas rendering across mobile and desktop displays",
    "results": "Transformed high-luxury fragrance retail into an experiential digital atelier. Eliminated cart abandonment by integrating doorstep physical inspection with cash/card handover, achieving elevated patron conversion and establishing Soft Aurora as a benchmark in interactive spatial commerce.",
    "live": "",
    "github": "",
    "cover": "/assets/projects/soft-aurora.png",
    "gallery": [
      "/assets/projects/soft-aurora-scent-selector.png",
      "/assets/projects/soft-aurora-diffuser.png",
      "/assets/projects/soft-aurora-checkout.png"
    ],
    "published": true,
    "featured": true
  }
],techs:[],contact:{email:"caventraofficial@gmail.com",phone:"Hriday Vayanta: 8866790989, Ved Nimbark: 8849186747, Sauranahmed Mansuri: 7990652097",address:""},socials:[["Instagram","https://www.instagram.com/caventra__/"]]};
let S=JSON.parse(JSON.stringify(D)),owner=false,edit=null,INQ=[];const H={'Content-Type':'application/json','X-Requested-With':'caventra'};

// Google Apps Script Web App Endpoint for Project Enquiries (Connected to private sheet owned by caventraofficial@gmail.com)
const GOOGLE_APPS_SCRIPT_URL = (typeof window !== 'undefined' && window.CAVENTRA_CONFIG && window.CAVENTRA_CONFIG.APPS_SCRIPT_URL)
  || 'https://script.google.com/macros/s/AKfycbyVljM0fD4e6Gqc2F_ugBnjGK0ODWnC88WKn2wFyqn2QOT4_GPZuS6Bwu9ltzwPaL19/exec';

function isPlaceholderEndpoint(url) {
  return !url || url.includes('YOUR_DEPLOYMENT_ID_HERE') || !/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec/i.test(url);
}
