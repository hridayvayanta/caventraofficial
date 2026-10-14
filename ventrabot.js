/**
 * CAVENTRA — Ventrabot Companion & Option-Based Support Assistant
 * Friendly animated robot character with option-only decision tree navigation.
 */
(function() {
  'use strict';

  // Configurable contact details
  const VENTRA_CONFIG = {
    email: 'caventraofficial@gmail.com',
    whatsappNumber: '+91 8866790989',
    companyName: 'Caventra',
    tagline: 'Ideas to Impact'
  };

  const SESSION_GREETED_KEY = 'cv_ventrabot_greeted';

  // Decision Tree Definitions
  const DECISION_TREE = {
    main: {
      title: "What can I help you with?",
      intro: "Welcome to Caventra. Select an option below to explore our services, discuss a project, or connect with our engineering team:",
      options: [
        { label: "Explore our services", next: "services" },
        { label: "Website development", next: "web_dev" },
        { label: "Branding & creative design", next: "branding" },
        { label: "Pricing & packages", next: "pricing" },
        { label: "Website management, hosting & security", next: "hosting" },
        { label: "Existing project support", next: "support" },
        { label: "Report an issue", next: "issue" },
        { label: "Contact our team", next: "contact" }
      ]
    },

    services: {
      title: "Explore Our Services",
      intro: "We engineer bespoke digital solutions across six core disciplines. Which capability would you like to explore?",
      options: [
        { label: "Web Engineering", next: "svc_web" },
        { label: "Bespoke Software", next: "svc_software" },
        { label: "Applied AI Solutions", next: "svc_ai" },
        { label: "UI/UX Architecture", next: "svc_uiux" },
        { label: "Business Automation", next: "svc_automation" },
        { label: "Cloud & Scalability", next: "svc_cloud" },
        { label: "↗ View Full Services Page", route: "#/services" },
        { label: "↗ Start a Project Consultation", route: "#/contact" }
      ]
    },

    svc_web: {
      title: "Web Engineering",
      intro: "High-performance websites and bespoke web applications engineered with clean code, zero bloat, sub-second load times, and resilient cloud architectures.",
      options: [
        { label: "↗ View Selected Web Projects", route: "#/work" },
        { label: "↗ Explore Services Page", route: "#/services" },
        { label: "Request Web Engineering Quote", next: "quote_req" }
      ]
    },

    svc_software: {
      title: "Bespoke Software",
      intro: "Custom software systems, ERPs, CRM platforms, and client portals built precisely around real enterprise business workflows (e.g., The Wheel Master application).",
      options: [
        { label: "↗ Explore The Wheel Master Case Study", route: "#/work/the-wheel-master" },
        { label: "↗ View Software Services", route: "#/services" },
        { label: "Request Software Development Quote", next: "quote_req" }
      ]
    },

    svc_ai: {
      title: "Applied AI Solutions",
      intro: "Automated intelligence pipelines, custom LLM workflows, automated BOQ estimation, and AI plot analysis integrated directly into production software (e.g., PLINTH).",
      options: [
        { label: "↗ Explore PLINTH AI Case Study", route: "#/work/plinth" },
        { label: "↗ View AI Services Overview", route: "#/services" },
        { label: "Discuss Custom AI Application", next: "contact" }
      ]
    },

    svc_uiux: {
      title: "UI/UX Architecture",
      intro: "Intuitive digital product interfaces designed with user conversion psychology, hardware-accelerated micro-interactions, accessibility, and modern design systems.",
      options: [
        { label: "↗ View Selected Work & UI", route: "#/work" },
        { label: "↗ Read Insights & Design Articles", route: "#/blog" },
        { label: "Start a Design Project", route: "#/contact" }
      ]
    },

    svc_automation: {
      title: "Business Automation",
      intro: "API integrations, webhook orchestration, background data synchronization, and automated invoicing that eliminate manual bottlenecks and repetitive tasks.",
      options: [
        { label: "↗ Explore Automation Capabilities", route: "#/services" },
        { label: "Request Automation Assessment", route: "#/contact" }
      ]
    },

    svc_cloud: {
      title: "Cloud & Scalability",
      intro: "High-availability deployment architectures, automated daily backups, SSL/TLS enforcement, database indexing, and robust DDoS/security protection.",
      options: [
        { label: "↗ Cloud Infrastructure Overview", route: "#/services" },
        { label: "Discuss Cloud Architecture", route: "#/contact" }
      ]
    },

    web_dev: {
      title: "Website Development",
      intro: "Select a question below regarding our web engineering capabilities and delivery standards:",
      options: [
        { label: "What types of websites do you build?", next: "web_types" },
        { label: "How does your process work?", next: "web_process" },
        { label: "Request a website quote", next: "quote_req" }
      ]
    },

    web_types: {
      title: "What types of websites do we build?",
      intro: "We engineer bespoke web applications, high-performance corporate platforms, client portals, custom SaaS dashboards, and tailored e-commerce systems with hardware-accelerated animations and clean semantic architecture. We do NOT use generic drag-and-drop templates or fragile page builders.",
      options: [
        { label: "↗ View Selected Case Studies", route: "#/work" },
        { label: "Request a Tailored Quote", next: "quote_req" }
      ]
    },

    web_process: {
      title: "How does our process work?",
      intro: "We follow six disciplined stages: Discover, Strategize, Design, Build, Refine, and Launch. You collaborate directly with our founding engineers and architects with complete transparency at every milestone.",
      options: [
        { label: "↗ View Detailed Process Page", route: "#/process" },
        { label: "Start a Conversation", route: "#/contact" }
      ]
    },

    branding: {
      title: "Branding & Creative Design",
      intro: "Our design team crafts intentional digital brand identities, architectural typography, design systems, and high-conversion UI/UX interfaces that elevate your digital presence.",
      options: [
        { label: "↗ Explore UI/UX Services", route: "#/services" },
        { label: "↗ View Design Case Studies", route: "#/work" },
        { label: "Request Design Consultation", next: "contact" }
      ]
    },

    pricing: {
      title: "Pricing & Packages",
      intro: "Every product we engineer is tailored to specific technical requirements, scale, and business goals rather than rigid one-size-fits-all packages. We provide transparent, itemized quotes after evaluating your brief.",
      options: [
        { label: "↗ Request a Tailored Quote", route: "#/contact" },
        {
          label: "💬 Chat on WhatsApp",
          action: "whatsapp",
          whatsappMsg: "Hello Caventra, I would like to request a tailored quote for my project."
        },
        {
          label: "✉️ Send an Email for Pricing",
          action: "email",
          emailSub: "Pricing & Quote Request — Caventra",
          emailBody: "Hello Caventra Team,\n\nI would like to discuss pricing and request an itemized proposal for my project.\n\nProject Scope:\nBudget Range:\nTarget Timeline:\n"
        }
      ]
    },

    hosting: {
      title: "Website Management, Hosting & Security",
      intro: "We provide comprehensive ongoing management, high-performance cloud hosting, automated security patching, uptime monitoring, and continuous code enhancements to keep your systems resilient.",
      options: [
        { label: "↗ Hosting & Security Overview", route: "#/services" },
        {
          label: "Discuss Maintenance & Hosting Support",
          action: "email",
          emailSub: "Hosting & Maintenance Inquiry — Caventra",
          emailBody: "Hello Caventra Team,\n\nI would like to inquire about ongoing website management, hosting, and security services for our company.\n\nCurrent Website / Domain:\nRequirements:\n"
        }
      ]
    },

    support: {
      title: "Existing Project Support",
      intro: "Are you an existing Caventra client looking for project assistance, revisions, or feature updates?",
      options: [
        {
          label: "✉️ Email Project Support Team",
          action: "email",
          emailSub: "Project Support Request — Caventra",
          emailBody: "Hello Caventra Support Team,\n\nProject Name:\nClient / Company:\nDescription of Support or Update Needed:\n"
        },
        {
          label: "💬 WhatsApp Priority Support",
          action: "whatsapp",
          whatsappMsg: "Hello Caventra Support, I am an existing client requesting assistance with my project."
        },
        { label: "↗ Open Contact Form", route: "#/contact" }
      ]
    },

    issue: {
      title: "Report an Issue",
      intro: "We take reliability and security seriously. What kind of issue are you encountering?",
      options: [
        { label: "Website not loading", next: "issue_not_loading" },
        { label: "Website error or broken page", next: "issue_broken_page" },
        { label: "Hosting or domain concern", next: "issue_hosting" },
        { label: "Security concern", next: "issue_security" },
        { label: "Other issue", next: "issue_other" }
      ]
    },

    issue_not_loading: {
      title: "Report: Website Not Loading",
      intro: "We will investigate this immediately. Please choose how you'd like to report the downtime:",
      options: [
        {
          label: "✉️ Email Downtime Report",
          action: "email",
          emailSub: "Urgent: Website Not Loading Report — Caventra",
          emailBody: "Hello Caventra Team,\n\nI am reporting that our website is not loading.\n\nWebsite URL:\nTime Noticed:\nError message / behavior observed:\nDevice & Browser:\n"
        },
        {
          label: "💬 Report via WhatsApp",
          action: "whatsapp",
          whatsappMsg: "URGENT: I am reporting that my website is not loading. URL: "
        }
      ]
    },

    issue_broken_page: {
      title: "Report: Website Error or Broken Page",
      intro: "Please let our engineering team know which page or component is malfunctioning:",
      options: [
        {
          label: "✉️ Email Bug Report",
          action: "email",
          emailSub: "Bug Report: Website Error or Broken Page — Caventra",
          emailBody: "Hello Caventra Team,\n\nPage / URL with error:\nSteps to reproduce:\nExpected behavior:\nActual behavior:\n"
        },
        {
          label: "💬 Report via WhatsApp",
          action: "whatsapp",
          whatsappMsg: "Hi Caventra Team, I found a broken page/error on: "
        }
      ]
    },

    issue_hosting: {
      title: "Report: Hosting or Domain Concern",
      intro: "Select a channel to connect with our infrastructure team regarding DNS, domain renewal, or server hosting:",
      options: [
        {
          label: "✉️ Email Infrastructure Team",
          action: "email",
          emailSub: "Hosting / Domain Inquiry — Caventra",
          emailBody: "Hello Caventra Team,\n\nDomain Name:\nConcern / Question:\n"
        },
        {
          label: "💬 WhatsApp Infrastructure Chat",
          action: "whatsapp",
          whatsappMsg: "Hello Caventra, I have a question regarding domain/hosting for: "
        }
      ]
    },

    issue_security: {
      title: "Report: Security Concern",
      intro: "Security disclosures and vulnerability reports are reviewed with highest priority by our security engineers.",
      options: [
        {
          label: "✉️ Email Security Team (High Priority)",
          action: "email",
          emailSub: "Security Concern / Vulnerability Report — Caventra",
          emailBody: "Hello Caventra Security Team,\n\nScope / URL:\nDescription of Vulnerability or Security Concern:\nProof of concept or details:\n"
        },
        {
          label: "💬 WhatsApp Security Alert",
          action: "whatsapp",
          whatsappMsg: "URGENT: Security alert regarding Caventra system: "
        }
      ]
    },

    issue_other: {
      title: "Report: Other Issue",
      intro: "Please share details so we can direct your report to the appropriate founding team member:",
      options: [
        {
          label: "✉️ Send Email Report",
          action: "email",
          emailSub: "General Issue Report — Caventra",
          emailBody: "Hello Caventra Team,\n\nIssue Details:\n"
        },
        {
          label: "💬 WhatsApp General Report",
          action: "whatsapp",
          whatsappMsg: "Hello Caventra Team, I would like to report an issue: "
        }
      ]
    },

    contact: {
      title: "Contact Our Team",
      intro: "Choose your preferred channel to connect directly with our founding engineers and leadership team:",
      options: [
        {
          label: "💬 Chat on WhatsApp",
          action: "whatsapp",
          whatsappMsg: "Hello Caventra, I would like to discuss a project with your team."
        },
        {
          label: "✉️ Send us an Email",
          action: "email",
          emailSub: "Project Inquiry — Caventra",
          emailBody: "Hello Caventra Team,\n\nI would like to get in touch regarding:\n"
        },
        { label: "📝 Fill Website Contact Form", route: "#/contact" }
      ]
    },

    quote_req: {
      title: "Request a Project Quote",
      intro: "Tell us about your project brief, timeline, and goals. How would you prefer to get started?",
      options: [
        { label: "📝 Fill Detailed Contact Form", route: "#/contact" },
        {
          label: "✉️ Email Your Project Brief",
          action: "email",
          emailSub: "Project Quote Request — Caventra",
          emailBody: "Hello Caventra Team,\n\nProject Overview:\nRequired Capabilities:\nEstimated Budget:\nTarget Launch Date:\n"
        },
        {
          label: "💬 WhatsApp Direct Chat",
          action: "whatsapp",
          whatsappMsg: "Hello Caventra, I would like to request a quote for a new web project."
        }
      ]
    }
  };

  // Robot SVG Markup
  const ROBOT_SVG = `
    <svg class="ventra-svg" viewBox="0 0 100 120" width="70" height="84" aria-hidden="true">
      <defs>
        <radialGradient id="vGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.95" />
          <stop offset="60%" stop-color="#e3d3bc" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#c9b8a0" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="vBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#242a30" />
          <stop offset="50%" stop-color="#14181b" />
          <stop offset="100%" stop-color="#0a0d0f" />
        </linearGradient>
        <linearGradient id="vGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#e3d3bc" />
          <stop offset="60%" stop-color="#c9b8a0" />
          <stop offset="100%" stop-color="#9e825a" />
        </linearGradient>
      </defs>

      <!-- Hover Thrust Ring -->
      <g class="ventra-thrust">
        <ellipse cx="50" cy="112" rx="22" ry="5" fill="none" stroke="url(#vGoldGrad)" stroke-width="1.6" opacity="0.75" />
        <ellipse cx="50" cy="112" rx="12" ry="2.8" fill="url(#vGoldGrad)" opacity="0.35" />
      </g>

      <!-- Left Arm -->
      <g class="ventra-arm-left">
        <circle cx="24" cy="62" r="4.5" fill="url(#vGoldGrad)" />
        <path d="M 23 64 Q 16 74 20 86" fill="none" stroke="url(#vBodyGrad)" stroke-width="5" stroke-linecap="round" />
        <circle cx="20" cy="87" r="3.5" fill="url(#vGoldGrad)" />
      </g>

      <!-- Right Arm (Capable of greeting wave) -->
      <g class="ventra-arm-right" id="vArmRight">
        <circle cx="76" cy="62" r="4.5" fill="url(#vGoldGrad)" />
        <path class="v-arm-path" d="M 77 64 Q 84 74 80 86" fill="none" stroke="url(#vBodyGrad)" stroke-width="5" stroke-linecap="round" />
        <circle class="v-hand" cx="80" cy="87" r="3.5" fill="url(#vGoldGrad)" />
      </g>

      <!-- Torso Body -->
      <g class="ventra-torso">
        <path d="M 32 54 L 68 54 Q 74 54 73 66 L 68 96 Q 67 102 50 102 Q 33 102 32 96 L 27 66 Q 26 54 32 54 Z" fill="url(#vBodyGrad)" stroke="url(#vGoldGrad)" stroke-width="1.4" />
        <!-- Chest Accent Lines -->
        <path d="M 36 62 L 64 62" stroke="rgba(201,184,160,0.35)" stroke-width="1" />
        <path d="M 40 70 L 60 70" stroke="rgba(201,184,160,0.25)" stroke-width="1" />
        <!-- Core Reactor Heart (Pulsing Crimson) -->
        <circle cx="50" cy="80" r="5" fill="#c9463d" class="ventra-core" />
        <circle cx="50" cy="80" r="7.5" fill="none" stroke="url(#vGoldGrad)" stroke-width="1" opacity="0.7" />
      </g>

      <!-- Head / Visor -->
      <g class="ventra-head">
        <!-- Neck Joint -->
        <rect x="44" y="46" width="12" height="9" rx="3" fill="url(#vGoldGrad)" />
        
        <!-- Antenna Fins -->
        <path d="M 22 28 L 16 19 L 26 23 Z" fill="url(#vGoldGrad)" />
        <circle cx="15" cy="18" r="2" fill="#c9463d" class="ventra-antenna-led" />
        <path d="M 78 28 L 84 19 L 74 23 Z" fill="url(#vGoldGrad)" />
        <circle cx="85" cy="18" r="2" fill="#c9463d" class="ventra-antenna-led" />

        <!-- Helmet Shell -->
        <rect x="22" y="16" width="56" height="34" rx="15" fill="url(#vBodyGrad)" stroke="url(#vGoldGrad)" stroke-width="1.6" />

        <!-- Visor Screen -->
        <rect x="26" y="21" width="48" height="24" rx="10" fill="#07090b" stroke="rgba(201,184,160,0.35)" stroke-width="1" />

        <!-- Expressive LED Eyes -->
        <g class="ventra-eyes" id="vEyes">
          <!-- Left Eye -->
          <ellipse class="v-eye v-eye-left" cx="39" cy="33" rx="5" ry="5.5" fill="#ffffff" />
          <!-- Right Eye -->
          <ellipse class="v-eye v-eye-right" cx="61" cy="33" rx="5" ry="5.5" fill="#ffffff" />
        </g>
        <!-- Visor Specular Glint -->
        <path d="M 30 24 Q 48 22 68 25" fill="none" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" stroke-linecap="round" />
      </g>
    </svg>
  `;

  // State Management
  let historyStack = ['main'];
  let isPanelOpen = false;
  let isGreetingActive = false;
  let greetingTimer = null;
  let widgetContainer = null;
  let botAvatar = null;
  let speechBubble = null;
  let chatPanel = null;

  // DOM Builder
  function createWidget() {
    widgetContainer = document.createElement('div');
    widgetContainer.id = 'ventrabot-widget';
    widgetContainer.className = 'ventra-widget';
    widgetContainer.setAttribute('role', 'region');
    widgetContainer.setAttribute('aria-label', 'Ventrabot Virtual Companion');

    // Speech Bubble (shown during welcome)
    speechBubble = document.createElement('div');
    speechBubble.id = 'ventra-bubble';
    speechBubble.className = 'ventra-bubble hidden';
    speechBubble.setAttribute('role', 'status');
    speechBubble.setAttribute('aria-live', 'polite');
    speechBubble.innerHTML = `
      <div class="bubble-content">
        <p class="bubble-text">Hi, I'm Ventrabot. I'm here if you need any help.</p>
        <button type="button" class="bubble-close" aria-label="Dismiss greeting">×</button>
      </div>
      <div class="bubble-arrow"></div>
    `;

    // Interactive Robot Avatar Button
    botAvatar = document.createElement('button');
    botAvatar.id = 'ventra-avatar';
    botAvatar.className = 'ventra-avatar';
    botAvatar.type = 'button';
    botAvatar.setAttribute('aria-label', 'Open Ventrabot support assistant');
    botAvatar.setAttribute('aria-expanded', 'false');
    botAvatar.setAttribute('aria-haspopup', 'dialog');
    botAvatar.title = 'Ventrabot · Ask about services, projects & contact';
    botAvatar.innerHTML = `
      <div class="ventra-badge">AI</div>
      ${ROBOT_SVG}
    `;

    // Chat Panel
    chatPanel = document.createElement('div');
    chatPanel.id = 'ventra-panel';
    chatPanel.className = 'ventra-panel';
    chatPanel.setAttribute('role', 'dialog');
    chatPanel.setAttribute('aria-modal', 'false');
    chatPanel.setAttribute('aria-label', 'Ventrabot Support Options');
    chatPanel.innerHTML = `
      <div class="panel-header">
        <div class="panel-title-group">
          <div class="panel-avatar-mini">${ROBOT_SVG}</div>
          <div>
            <div class="panel-title">Ventrabot <span class="status-dot"></span></div>
            <div class="panel-subtitle">Caventra Companion · Ideas to Impact</div>
          </div>
        </div>
        <button type="button" class="panel-close" id="ventra-close" aria-label="Close Ventrabot panel">×</button>
      </div>
      <div class="panel-body" id="ventra-body" tabindex="0"></div>
      <div class="panel-footer">
        <span>Caventra Official Assistant</span>
        <span class="footer-badge">Direct Options</span>
      </div>
    `;

    widgetContainer.appendChild(speechBubble);
    widgetContainer.appendChild(botAvatar);
    widgetContainer.appendChild(chatPanel);
    document.body.appendChild(widgetContainer);

    bindEvents();
  }

  function renderNode(nodeId) {
    const node = DECISION_TREE[nodeId] || DECISION_TREE.main;
    const body = document.getElementById('ventra-body');
    if (!body) return;

    const isMain = nodeId === 'main';
    let html = `
      <div class="chat-message bot-msg">
        <h4 class="node-title">${node.title}</h4>
        <p class="node-intro">${node.intro}</p>
      </div>
      <div class="chat-options-group" role="group" aria-label="Conversation options">
    `;

    // Render options
    (node.options || []).forEach((opt, idx) => {
      let dataAttrs = `data-idx="${idx}"`;
      if (opt.next) dataAttrs += ` data-next="${opt.next}"`;
      if (opt.route) dataAttrs += ` data-route="${opt.route}"`;
      if (opt.action) dataAttrs += ` data-action="${opt.action}"`;
      if (opt.emailSub) dataAttrs += ` data-email-sub="${encodeURIComponent(opt.emailSub)}"`;
      if (opt.emailBody) dataAttrs += ` data-email-body="${encodeURIComponent(opt.emailBody)}"`;
      if (opt.whatsappMsg) dataAttrs += ` data-wa-msg="${encodeURIComponent(opt.whatsappMsg)}"`;

      html += `<button type="button" class="opt-btn" ${dataAttrs}>${opt.label}</button>`;
    });

    // Navigation Controls for Nested levels
    if (!isMain) {
      html += `
        <div class="chat-nav-row">
          <button type="button" class="opt-btn nav-back-btn" id="v-btn-back">← Back</button>
          <button type="button" class="opt-btn nav-main-btn" id="v-btn-main">⌂ Main Menu</button>
        </div>
      `;
    }

    html += `</div>`;
    body.innerHTML = html;
    body.scrollTop = 0;

    // Focus first option for keyboard accessibility
    const firstBtn = body.querySelector('.opt-btn');
    if (firstBtn && isPanelOpen) {
      firstBtn.focus();
    }
  }

  function handleAction(action, target) {
    if (action === 'email') {
      const sub = decodeURIComponent(target.dataset.emailSub || 'Inquiry — Caventra');
      const body = decodeURIComponent(target.dataset.emailBody || 'Hello Caventra Team,\n\n');
      window.location.href = `mailto:${VENTRA_CONFIG.email}?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`;
    } else if (action === 'whatsapp') {
      const msg = decodeURIComponent(target.dataset.waMsg || 'Hello Caventra, I would like to get in touch.');
      if (VENTRA_CONFIG.whatsappNumber && VENTRA_CONFIG.whatsappNumber.trim()) {
        const cleanNumber = VENTRA_CONFIG.whatsappNumber.replace(/[^\d]/g, '');
        window.open(`https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
      } else {
        // WhatsApp number pending verification notice
        showWhatsAppPendingNotice(msg);
      }
    }
  }

  function showWhatsAppPendingNotice(originalMsg) {
    const body = document.getElementById('ventra-body');
    if (!body) return;

    body.innerHTML = `
      <div class="chat-message bot-msg">
        <h4 class="node-title">WhatsApp Verification in Progress</h4>
        <p class="node-intro">Our official WhatsApp Business account is currently awaiting phone verification. In the meantime, you can reach our founding engineers directly via email:</p>
      </div>
      <div class="chat-options-group">
        <button type="button" class="opt-btn solid-accent" id="v-wa-fallback-email">✉️ Email Us Directly (${VENTRA_CONFIG.email})</button>
        <button type="button" class="opt-btn nav-back-btn" id="v-btn-back">← Back</button>
      </div>
    `;

    document.getElementById('v-wa-fallback-email')?.addEventListener('click', () => {
      window.location.href = `mailto:${VENTRA_CONFIG.email}?subject=${encodeURIComponent('Inquiry from Caventra Website')}&body=${encodeURIComponent(originalMsg)}`;
    });

    document.getElementById('v-btn-back')?.addEventListener('click', goBack);
  }

  function goBack() {
    if (historyStack.length > 1) {
      historyStack.pop();
      renderNode(historyStack[historyStack.length - 1]);
    } else {
      renderNode('main');
    }
  }

  function goMain() {
    historyStack = ['main'];
    renderNode('main');
  }

  function dismissGreeting() {
    if (greetingTimer) {
      clearTimeout(greetingTimer);
      greetingTimer = null;
    }
    if (speechBubble) {
      speechBubble.classList.add('fade-out');
      setTimeout(() => {
        speechBubble.classList.add('hidden');
        speechBubble.classList.remove('fade-out');
      }, 400);
    }
    if (botAvatar) {
      botAvatar.classList.remove('greeting');
      botAvatar.classList.remove('waving');
    }
    sessionStorage.setItem(SESSION_GREETED_KEY, '1');
  }

  function openPanel() {
    dismissGreeting();
    isPanelOpen = true;
    chatPanel.classList.add('open');
    botAvatar.setAttribute('aria-expanded', 'true');
    botAvatar.classList.add('active');

    // Wake up animation
    botAvatar.classList.add('wake-up');
    setTimeout(() => botAvatar.classList.remove('wake-up'), 600);

    renderNode(historyStack[historyStack.length - 1] || 'main');
  }

  function closePanel() {
    isPanelOpen = false;
    chatPanel.classList.remove('open');
    botAvatar.setAttribute('aria-expanded', 'false');
    botAvatar.classList.remove('active');
  }

  function togglePanel() {
    if (isPanelOpen) closePanel();
    else openPanel();
  }

  function bindEvents() {
    // Click avatar
    botAvatar.addEventListener('click', togglePanel);

    // Close button
    const closeBtn = document.getElementById('ventra-close');
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    // Dismiss speech bubble
    const bubbleClose = speechBubble.querySelector('.bubble-close');
    if (bubbleClose) {
      bubbleClose.addEventListener('click', (e) => {
        e.stopPropagation();
        dismissGreeting();
      });
    }

    // Dynamic offset when cookie banner is visible on small screens
    const updateCookieOffset = () => {
      const ckb = document.getElementById('ckb');
      if (ckb && ckb.classList.contains('show') && !ckb.classList.contains('hide')) {
        widgetContainer?.classList.add('above-cookie');
      } else {
        widgetContainer?.classList.remove('above-cookie');
      }
    };
    const ckb = document.getElementById('ckb');
    if (ckb) {
      const obs = new MutationObserver(updateCookieOffset);
      obs.observe(ckb, { attributes: true, attributeFilter: ['class'] });
      document.getElementById('ck-acc')?.addEventListener('click', () => setTimeout(updateCookieOffset, 50));
      document.getElementById('ck-dec')?.addEventListener('click', () => setTimeout(updateCookieOffset, 50));
    }

    // Keyboard support: Escape closes panel
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isPanelOpen) {
        closePanel();
        botAvatar.focus();
      }
    });

    // Delegate clicks inside chat options
    chatPanel.addEventListener('click', (e) => {
      const btn = e.target.closest('.opt-btn');
      if (!btn) return;

      if (btn.id === 'v-btn-back') {
        goBack();
        return;
      }
      if (btn.id === 'v-btn-main') {
        goMain();
        return;
      }

      const next = btn.dataset.next;
      const route = btn.dataset.route;
      const action = btn.dataset.action;

      if (route) {
        window.location.hash = route;
        // Don't close panel automatically so visitor can keep exploring, or leave open
      }

      if (action) {
        handleAction(action, btn);
        return;
      }

      if (next) {
        historyStack.push(next);
        renderNode(next);
      }
    });
  }

  // Welcome sequence orchestration
  function runWelcomeSequence() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const alreadyGreeted = sessionStorage.getItem(SESSION_GREETED_KEY);

    // Position directly in permanent resting dock on the right
    widgetContainer.classList.add('ready');

    if (alreadyGreeted) {
      // Idle resting position directly, no greeting or speech bubble
      speechBubble.classList.add('hidden');
      return;
    }

    // First visit in session: show subtle greeting notice & speech bubble
    sessionStorage.setItem(SESSION_GREETED_KEY, '1');

    if (!prefersReducedMotion) {
      botAvatar.classList.add('greeting');
      // Settle back to subtle idle after notice animation
      setTimeout(() => {
        if (botAvatar) botAvatar.classList.remove('greeting');
      }, 2600);
    }

    // Show speech bubble beside Ventrabot on his left
    speechBubble.classList.remove('hidden');

    // Readable pause: 5.5s (or 2.8s for reduced motion)
    const displayTime = prefersReducedMotion ? 2800 : 5500;
    greetingTimer = setTimeout(() => {
      dismissGreeting();
    }, displayTime);
  }

  // Initialize after splash screen finishes
  function init() {
    createWidget();

    // Wait until existing loading screen (#splash) exit animation completes (approx 2.7s)
    const splash = document.getElementById('splash');
    if (splash) {
      setTimeout(() => {
        runWelcomeSequence();
      }, 2750);
    } else {
      setTimeout(runWelcomeSequence, 400);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global controller
  window.Ventrabot = {
    open: openPanel,
    close: closePanel,
    toggle: togglePanel,
    dismissGreeting: dismissGreeting,
    goTo: (nodeId) => {
      historyStack.push(nodeId);
      renderNode(nodeId);
      openPanel();
    },
    setConfig: (newConfig) => {
      Object.assign(VENTRA_CONFIG, newConfig);
    }
  };
})();
