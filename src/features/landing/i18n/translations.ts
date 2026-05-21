/* ============================================================
   Brux · Landing · Contenido i18n (es · en)
   Solo texto: imágenes, iconos y visuales viven en los componentes
   y se combinan por índice con estas listas.
   ============================================================ */

export type Lang = "es" | "en"

export const LANGS: Lang[] = ["es", "en"]

export type LandingDict = {
  /** Etiqueta accesible del selector de idioma. */
  langSwitch: string
  nav: {
    links: { href: string; label: string }[]
    signIn: string
    cta: string
    menuLabel: string
  }
  hero: {
    title: string
    highlight: string
    lead: string
    ctaPrimary: string
    ctaSecondary: string
    note: string
    shotAlt: string
  }
  highlights: {
    headingText: string
    headingHighlight: string
    items: { title: string; text: string }[]
  }
  showcase: {
    profileAlt: string
    rows: { title: string; highlight: string; text: string; points: string[] }[]
  }
  bento: {
    headingText: string
    headingHighlight: string
    sub: string
    cards: { title: string; text: string }[]
  }
  faq: {
    headingText: string
    headingHighlight: string
    items: { q: string; a: string }[]
  }
  welcome: {
    bgAlt: string
    title: string
    highlight: string
    text: string
    placeholder: string
    inputLabel: string
    submit: string
    done: (user: string) => string
  }
  footer: {
    brand: string
    columns: { title: string; links: string[] }[]
    rights: string
    legal: string[]
  }
}

export const translations: Record<Lang, LandingDict> = {
  es: {
    langSwitch: "Cambiar idioma",
    nav: {
      links: [
        { href: "#producto", label: "Producto" },
        { href: "#capacidades", label: "Capacidades" },
        { href: "#casos", label: "Casos" },
        { href: "#empezar", label: "Precios" },
      ],
      signIn: "Iniciar sesión",
      cta: "Crear mi @usuario",
      menuLabel: "Abrir menú",
    },
    hero: {
      title: "Desbloquea las fronteras del dinero",
      highlight: "fronteras",
      lead: "Mueve dinero de un país a otro con solo un @usuario o un código QR. Tus clientes pagan sin exponer datos bancarios y con menos riesgo de fraude.",
      ctaPrimary: "Crear mi cuenta",
      ctaSecondary: "Iniciar sesión",
      note: "Verificación de identidad · Sin datos bancarios · Cobros B2B con QR",
      shotAlt: "Panel de Brux",
    },
    highlights: {
      headingText: "Recibe pagos del mundo, SIMPLE Y RÁPIDO",
      headingHighlight: "simple y rápido",
      items: [
        {
          title: "Cobros B2B con QR",
          text: "Tu negocio cobra a clientes y empresas escaneando un código.",
        },
        {
          title: "Pagos entre países",
          text: "Envía y recibe de un país a otro, de forma simple y directa.",
        },
        {
          title: "Sin datos bancarios",
          text: "Nadie comparte números de cuenta: menos espacio para el fraude.",
        },
      ],
    },
    showcase: {
      profileAlt: "Perfil verificado de Brux con @usuario y código QR",
      rows: [
        {
          title: "Tu @usuario es tu identidad financiera",
          highlight: "@usuario",
          text: "Recibe pagos globales sin compartir datos bancarios.",
          points: [
            "Link de cobro y QR propios",
            "Notificación al instante",
            "Disponible al recibir",
          ],
        },
        {
          title: "De un país a otro",
          highlight: "",
          text: "Recibe y mueve dinero entre países y monedas (como USD), de forma directa y sin exponer tus cuentas bancarias.",
          points: [
            "Pagos entre países",
            "Sin datos bancarios",
            "Verificación de identidad",
          ],
        },
      ],
    },
    bento: {
      headingText: "Construido para mover dinero, sin fricción",
      headingHighlight: "dinero",
      sub: "Todo lo que necesitas para cobrar y mover tu dinero, reunido en una sola plataforma segura.",
      cards: [
        { title: "Pagos entre países", text: "Transferencias internacionales en pocos pasos." },
        { title: "Cobro con QR", text: "Cobra a clientes y empresas escaneando un código." },
        { title: "Tu @usuario", text: "Recibe pagos con un alias, sin dar tu cuenta bancaria." },
        { title: "Verificación de identidad", text: "Usuarios verificados para operar con confianza." },
        { title: "Menos fraude", text: "Al no exponer datos bancarios, baja el riesgo de estafas." },
        { title: "API para negocios", text: "Integra los cobros de Brux en tu plataforma." },
      ],
    },
    faq: {
      headingText: "Preguntas frecuentes",
      headingHighlight: "frecuentes",
      items: [
        {
          q: "¿Qué necesito para empezar?",
          a: "Crear tu cuenta, verificar tu identidad una sola vez y elegir tu @usuario. En minutos puedes enviar y recibir pagos.",
        },
        {
          q: "¿Cómo me pagan mis clientes?",
          a: "Comparten tu @usuario o escanean tu código QR. Nunca necesitan ni ven tus datos bancarios.",
        },
        {
          q: "¿Por qué es más seguro?",
          a: "Al no exponer cuentas ni datos bancarios, y al verificar a cada usuario, se reduce el espacio para las estafas.",
        },
        {
          q: "¿Sirve para mi negocio (B2B)?",
          a: "Sí. Brux está pensado para cobros entre empresas con código QR, simples y fáciles de rastrear.",
        },
        {
          q: "¿Puedo enviar dinero a otro país?",
          a: "Sí, es el corazón de Brux: mover dinero de un país a otro de forma simple y directa.",
        },
        {
          q: "¿En qué países está disponible?",
          a: "En varios países de Latinoamérica: El Salvador, Brasil, Colombia, Argentina, México y Costa Rica.",
        },
      ],
    },
    welcome: {
      bgAlt: "Persona cobrando con Brux desde su teléfono",
      title: "Reserva tu @usuario",
      highlight: "@usuario",
      text: "Elige el alias con el que el mundo te pagará. Es gratis y toma menos de un minuto.",
      placeholder: "minegocio",
      inputLabel: "Tu @usuario",
      submit: "Crear mi cuenta",
      done: (user) => `¡@${user} reservado! Te llevamos a crear tu cuenta.`,
    },
    footer: {
      brand: "Pagos internacionales con un identificador simple: @usuario, teléfono, correo o QR. Dinero que se mueve a la velocidad de un mensaje.",
      columns: [
        {
          title: "Producto",
          links: ["Cómo funciona", "Pagos globales", "Cobro con QR", "Seguridad"],
        },
        {
          title: "Casos de uso",
          links: ["Personas", "Negocios", "Creadores", "Desarrolladores"],
        },
        {
          title: "Empresa",
          links: ["Sobre Brux", "Regulación", "Empleo", "Contacto"],
        },
      ],
      rights: "Todos los derechos reservados.",
      legal: ["Privacidad", "Términos", "Cookies"],
    },
  },

  en: {
    langSwitch: "Change language",
    nav: {
      links: [
        { href: "#producto", label: "Product" },
        { href: "#capacidades", label: "Features" },
        { href: "#casos", label: "Use cases" },
        { href: "#empezar", label: "Pricing" },
      ],
      signIn: "Sign in",
      cta: "Create my @username",
      menuLabel: "Open menu",
    },
    hero: {
      title: "Unlock the borders of money",
      highlight: "borders",
      lead: "Move money from one country to another with just a @username or a QR code. Your customers pay without exposing bank details and with less risk of fraud.",
      ctaPrimary: "Create my account",
      ctaSecondary: "Sign in",
      note: "Identity verification · No bank details · B2B payments with QR",
      shotAlt: "Brux dashboard",
    },
    highlights: {
      headingText: "Get paid from anywhere, SIMPLE AND FAST",
      headingHighlight: "simple and fast",
      items: [
        {
          title: "B2B payments with QR",
          text: "Your business gets paid by customers and companies by scanning a code.",
        },
        {
          title: "Cross-border payments",
          text: "Send and receive from one country to another, simply and directly.",
        },
        {
          title: "No bank details",
          text: "Nobody shares account numbers — less room for fraud.",
        },
      ],
    },
    showcase: {
      profileAlt: "Verified Brux profile with @username and QR code",
      rows: [
        {
          title: "Your @username is your financial identity",
          highlight: "@username",
          text: "Receive global payments without sharing any bank details.",
          points: [
            "Your own payment link and QR",
            "Instant notifications",
            "Available the moment it arrives",
          ],
        },
        {
          title: "From one country to another",
          highlight: "",
          text: "Receive and move money across countries and currencies (like USD), directly and without exposing your bank accounts.",
          points: [
            "Cross-border payments",
            "No bank details",
            "Identity verification",
          ],
        },
      ],
    },
    bento: {
      headingText: "Built to move money, without friction",
      headingHighlight: "money",
      sub: "Everything you need to get paid and move your money, brought together in one secure platform.",
      cards: [
        { title: "Cross-border payments", text: "International transfers in just a few steps." },
        { title: "QR payments", text: "Get paid by customers and companies by scanning a code." },
        { title: "Your @username", text: "Get paid with an alias, without sharing your bank account." },
        { title: "Identity verification", text: "Verified users so you can transact with confidence." },
        { title: "Less fraud", text: "By not exposing bank details, the risk of scams drops." },
        { title: "API for businesses", text: "Integrate Brux payments into your platform." },
      ],
    },
    faq: {
      headingText: "Frequently asked questions",
      headingHighlight: "questions",
      items: [
        {
          q: "What do I need to get started?",
          a: "Create your account, verify your identity once, and choose your @username. In minutes you can send and receive payments.",
        },
        {
          q: "How do my customers pay me?",
          a: "They share your @username or scan your QR code. They never need or see your bank details.",
        },
        {
          q: "Why is it safer?",
          a: "By not exposing accounts or bank details, and by verifying every user, there's less room for scams.",
        },
        {
          q: "Does it work for my business (B2B)?",
          a: "Yes. Brux is built for business-to-business payments with QR codes — simple and easy to track.",
        },
        {
          q: "Can I send money to another country?",
          a: "Yes — that's the heart of Brux: moving money from one country to another, simply and directly.",
        },
        {
          q: "Which countries is it available in?",
          a: "Across several countries in Latin America: El Salvador, Brazil, Colombia, Argentina, Mexico, and Costa Rica.",
        },
      ],
    },
    welcome: {
      bgAlt: "Person getting paid with Brux from their phone",
      title: "Reserve your @username",
      highlight: "@username",
      text: "Choose the alias the world will pay you with. It's free and takes less than a minute.",
      placeholder: "mybusiness",
      inputLabel: "Your @username",
      submit: "Create my account",
      done: (user) => `@${user} reserved! Taking you to create your account.`,
    },
    footer: {
      brand: "International payments with one simple identifier: @username, phone, email, or QR. Money that moves at the speed of a message.",
      columns: [
        {
          title: "Product",
          links: ["How it works", "Global payments", "QR payments", "Security"],
        },
        {
          title: "Use cases",
          links: ["Individuals", "Businesses", "Creators", "Developers"],
        },
        {
          title: "Company",
          links: ["About Brux", "Compliance", "Careers", "Contact"],
        },
      ],
      rights: "All rights reserved.",
      legal: ["Privacy", "Terms", "Cookies"],
    },
  },
}
