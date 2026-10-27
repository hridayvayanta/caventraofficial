
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
  },
{
    "name": "The Wheel Master",
    "slug": "the-wheel-master",
    "category": "Custom Business Software · ERP / CRM",
    "short": "A web-based workshop management application designed to streamline daily operations at The Wheel Master — managing customer records, alloy wheel repair jobs, invoices, inventory, insurance work, and courier tracking.",
    "tech": "HTML5, CSS3, JavaScript, Chart.js, jsPDF, SheetJS, QRCode.js, LocalStorage",
    "client": "The Wheel Master · Automotive Refurbishment (Sanathal Circle, Ahmedabad, Gujarat)",
    "overview": "Managing an alloy wheel repair workshop involves handling customer details, repair orders, job statuses, inventory, billing, insurance-related work, and deliveries. Maintaining these records manually or across separate systems makes information difficult to organize, retrieve, and update efficiently.\\n\\nWe developed a web-based workshop management application tailored to The Wheel Master's operational needs. The application brings essential business records and workflows into a centralized interface, helping staff organize customer information, track repair jobs, manage invoices and inventory, and monitor related business activities.",
    "challenge": "Scattered paper-based job cards, disjointed repair status tracking, manual billing reconciliation, and lack of real-time inventory visibility across technicians and front-desk staff.",
    "solution": "Caventra engineered a unified digital workshop management application featuring centralized customer records, job card workflows, inventory stock monitoring, PDF invoice generation, insurance tracking, and visual analytics dashboards.",
    "features": "Dashboard — Centralized overview of active workshop operations and job metrics\\nCustomer Management — Organize and maintain comprehensive customer profiles and histories\\nRepair Job Management — Record repair orders, monitor wheel refurbishment stages, and track job progress\\nInventory Management — Maintain real-time workshop consumable and spare parts stock records\\nInvoice Management — Prepare and manage billing records with instant PDF export via jsPDF\\nInsurance Management — Organize insurance-related repair claims and documentation\\nCourier Tracking — Maintain shipment, dispatch, and delivery tracking information\\nReports & Analytics — Visual business analytics powered by Chart.js and Excel export via SheetJS",
    "results": "Created a centralized digital interface for workshop management, structured customer and billing records, eliminated reliance on manual paper records, and established the foundation for future server-backed database expansions. Location: Sanathal Circle, Ahmedabad, Gujarat.",
    "live": "",
    "github": "",
    "cover": "/assets/projects/the-wheel-master.svg",
    "published": true,
    "featured": true
  },
  {
    "name": "PLINTH",
    "slug": "plinth",
    "category": "AI Solutions · ConTech",
    "short": "An integrated AI-powered platform connecting architecture, engineering, interior design, and construction workflows — bringing the entire building lifecycle into one unified ecosystem.",
    "tech": "React.js, Python, Django, DRF, PostgreSQL, GSAP, WebSockets, Celery, Redis",
    "client": "Architecture, Engineering & Construction (AEC) · Artificial Intelligence",
    "overview": "Building projects involve multiple stakeholders, complex workflows, and information spread across disconnected tools. PLINTH is designed to bring these moving parts together through a centralized platform that simplifies collaboration, improves project visibility, and supports informed decision-making throughout the building lifecycle.\\n\\nBy combining AI-assisted design capabilities with project management, cost estimation, document management, and construction tracking, PLINTH creates a connected environment for everyone involved in bringing a building from concept to completion.",
    "challenge": "Traditional construction projects suffer from fragmented stakeholder silos, disconnected spreadsheets, slow manual quantity estimation, and lack of real-time site synchronization between architects, engineers, contractors, and vendors.",
    "solution": "Caventra engineered a unified digital ecosystem integrating AI plot analysis, preliminary floor-plan generation, automated BOQ calculations, WebSocket-powered real-time task updates, and centralized role-based document approvals.",
    "features": "AI-Assisted Design — Plot analysis, preliminary floor-plan generation, and design alternatives\\n3D Visualization & Interior Design — Visual exploration of architectural concepts, materials, and layouts\\nEngineering Assistance — Preliminary structural assistance and compliance-related checks\\nCost Estimation & BOQ — Structured quantity takeoffs, cost estimates, and budget visibility\\nProject & Construction Management — Tasks, milestones, progress tracking, and site reporting\\nDocument & Approval Management — Centralized project files, revisions, reviews, and approvals\\nStakeholder Collaboration — Role-based workflows for clients, architects, engineers, contractors, and vendors",
    "results": "Connected every stage of the building lifecycle through intelligent tools, coordinated workflows, and a unified digital experience. Status: In Development.",
    "live": "",
    "github": "",
    "cover": "/assets/projects/plinth.svg",
    "published": true,
    "featured": true
  },
  {
    "name": "GenResume",
    "slug": "genresume",
    "category": "Web Development · Career Tech",
    "short": "A smart web-based resume-building and career development platform designed to help users create, organize, and present professional resumes through a streamlined digital experience.",
    "tech": "Python, Django, Django REST Framework, React, PostgreSQL",
    "client": "Human Resources Technology · Career Development · Productivity",
    "overview": "Creating an effective resume can be challenging when users lack professional templates, structured guidance, or an organized way to present their qualifications. GenResume aims to simplify this process by providing a centralized platform for building and managing resumes.\\n\\nThe platform focuses on making resume creation more accessible while helping users structure their personal information, education, skills, and professional experience into a clear format suitable for career opportunities.",
    "challenge": "Job seekers frequently struggle with inconsistent formatting, unstructured qualification sections, and lack of browser-based version control when tailoring applications for diverse roles.",
    "solution": "A modular, step-by-step resume editor with live layout previews, structured data schema, automated section alignment, and instant PDF export capabilities.",
    "features": "Resume Creation — Organize personal information, education, skills, and experience\\nStructured Resume Sections — Present career information in a consistent, readable format\\nDigital Resume Management — Manage multiple resume versions in a centralized web app\\nProfessional Presentation — Structure content to improve clarity, visual hierarchy, and ATS readability\\nWeb-Based Accessibility — Access resume-building functionality across desktop and mobile browsers",
    "results": "Empowered individuals to present their career achievements with clarity, structure, and confidence.",
    "live": "",
    "github": "",
    "cover": "/assets/projects/genresume.svg",
    "published": true,
    "featured": true
  },
  {
    "name": "IRONFORGE Fitness Store",
    "slug": "ironforge-fitness-store",
    "category": "E-Commerce · Retail Technology",
    "short": "A fitness-focused online shopping platform designed to showcase gym equipment and provide customers with a structured digital shopping experience.",
    "tech": "React, Node.js, Express, PostgreSQL, E-Commerce Catalog, Stripe",
    "client": "Fitness & Wellness · Sports Equipment · E-Commerce",
    "overview": "Customers looking for fitness equipment need a convenient way to discover products, review available options, and make informed purchasing decisions. IRONFORGE Fitness Store is designed around this requirement, providing a dedicated online storefront for fitness and gym equipment.\\n\\nThe platform establishes a digital retail presence for fitness products, creating a foundation for product discovery, online shopping, and customer engagement.",
    "challenge": "Heavy equipment e-commerce demands clear product specs, dimension comparisons, shipping tier calculators, and robust inventory categorization.",
    "solution": "Engineered a high-performance, dark-themed storefront featuring fluid product filtering, instant specifications comparison, cart management, and seamless checkout flows.",
    "features": "Product Showcase — Present fitness equipment through an organized visual catalogue\\nProduct Information — Structured specifications for easier browsing and technical comparison\\nE-Commerce Experience — High-speed digital shopping cart and responsive checkout\\nBrand Presentation — Cohesive, athletic brand identity and high-contrast typography\\nCustomer-Focused Browsing — Group equipment by training focus (Strength, Cardio, Recovery)",
    "results": "Built a focused digital shopping destination for fitness enthusiasts seeking reliable and accessible gym equipment.",
    "live": "",
    "github": "",
    "cover": "/assets/projects/ironforge.svg",
    "published": true,
    "featured": true
  },
  {
    "name": "Divine Bridal Accessories",
    "slug": "divine-bridal-accessories",
    "category": "E-Commerce · Digital Retail",
    "short": "An elegant bridal accessories website designed to showcase hair accessories, brooches, and occasion-focused products through a visually focused digital storefront.",
    "tech": "Modern Web Stack, Responsive CSS3, Product Catalog, Image Optimization",
    "client": "Bridal Fashion · Wedding Accessories · E-Commerce",
    "overview": "Bridal accessories are often selected based on their appearance, design, and suitability for a particular occasion. Divine Bridal Accessories is designed to give these products a dedicated online presence through a visually focused shopping experience.\\n\\nThe website brings bridal hair accessories, brooches, and related products into a single digital storefront, helping visitors explore available designs while presenting the brand in a consistent and polished manner.",
    "challenge": "Occasion-wear and bridal shoppers demand high-resolution imagery, subtle luxury aesthetics, and curated occasion categorization without performance degradation.",
    "solution": "Crafted an airy, elegant shopping storefront with optimized imagery, delicate typographic hierarchy, detailed product zooms, and intuitive category browsing.",
    "features": "Bridal Product Showcase — Present hair accessories, brooches, and bridal collections\\nVisual Product Presentation — High-resolution imagery emphasizing artisan detail and materials\\nOrganized Product Browsing — Group products by ceremony, hairstyle, and collection\\nRefined Brand Identity — Establish a sophisticated digital presence for luxury occasion retail\\nOnline Storefront — Seamless foundation for digital product discovery, inquiries, and orders",
    "results": "Established an elegant digital destination combining luxury presentation, brand consistency, and convenient shopping.",
    "live": "",
    "github": "",
    "cover": "/assets/projects/divine-bridal.svg",
    "published": true,
    "featured": true
  },
  {
    "name": "Personal Portfolio Website",
    "slug": "personal-portfolio-website",
    "category": "Web Development · Front-End",
    "short": "A responsive personal portfolio website showcasing technical projects, development skills, and professional experience through a structured and interactive digital experience.",
    "tech": "HTML5, CSS3, JavaScript, Responsive Grid, GSAP",
    "client": "Software Development · Technology · Professional Showcase",
    "overview": "A developer's portfolio serves as a central destination for presenting projects, technical capabilities, and professional achievements. This portfolio website is designed to establish a clear digital identity while making project information accessible to recruiters, collaborators, and potential clients.\\n\\nBuilt with core web technologies, the website combines responsive layouts, structured navigation, and interactive elements to present information across desktop and mobile devices.",
    "challenge": "Standing out in a crowded market requires showcasing both aesthetic polish and foundational coding mastery across all device form factors.",
    "solution": "Engineered a clean, semantic web portfolio with custom dark styling, subtle interactive hover states, responsive layouts, and dedicated project breakdowns.",
    "features": "Project Showcase — Display development projects, tech stacks, and live links\\nResponsive Design — Flawless multi-device layout adaptation from mobile to 4K\\nInteractive Elements — Dynamic DOM interactions, smooth scroll, and subtle micro-motion\\nStructured Navigation — Dedicated sections for About, Work, Experience, and Contact\\nCustom Styling — Bespoke CSS3 architecture with zero bloated UI dependencies\\nError Handling — Dedicated custom 404 page for unavailable routes",
    "results": "Built a professional digital presence communicating technical ability, architectural hygiene, and software development excellence.",
    "live": "",
    "github": "",
    "cover": "/assets/projects/personal-portfolio.svg",
    "published": true,
    "featured": true
  },
  {
    "name": "CRM Platform",
    "slug": "crm-platform",
    "category": "Business Software · Workflow Management",
    "short": "A web-based customer relationship management platform intended to centralize customer information and support more organized business workflows.",
    "tech": "Full-Stack Web Architecture, Relational Database, REST APIs, Analytics",
    "client": "Customer Relationship Management · Business Operations · Enterprise",
    "overview": "Businesses often manage customer information, follow-ups, and operational activities across disconnected tools. A centralized CRM platform provides a structured approach to organizing customer records and managing client interactions.\\n\\nThis project focuses on bringing customer-related information into a unified digital environment, supporting consistent recordkeeping and improved visibility into business activities.",
    "challenge": "Fragmented customer data spread across email threads and spreadsheets creates missed follow-ups, slow response times, and poor pipeline visibility.",
    "solution": "Architected a unified customer management dashboard with contact histories, stage-based lead tracking, automated reminder alerts, and consolidated team activity feeds.",
    "features": "Customer Information Management — Organize client records and metadata in a central hub\\nInteraction Tracking — Structured logs of communications, meetings, notes, and follow-ups\\nWorkflow Organization — Stage-based pipelines to track deals from initial lead to close\\nCentralized Records — Instant full-text search across accounts, contacts, and activity history\\nOperational Visibility — High-level dashboard metrics for monitoring business performance",
    "results": "Simplified customer relationship management through centralized information, organized workflows, and connected business operations.",
    "live": "",
    "github": "",
    "cover": "/assets/projects/crm-platform.svg",
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
