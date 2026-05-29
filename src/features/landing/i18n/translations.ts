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
    /** Chip "Sandbox · Demo" arriba del título; también es el atajo
     *  discreto al login del panel. */
    sandbox: string
    sandboxA11y: string
    waitlist: {
      /** Texto del chip social, recibe el total (base + reales). */
      socialProof: (count: number) => string
      emailPlaceholder: string
      emailLabel: string
      submit: string
      submitting: string
      success: string
      alreadyIn: string
      invalid: string
      offline: string
      error: string
      haveAccount: string
      signIn: string
    }
  }
  highlights: {
    headingText: string
    headingHighlight: string
    cta: string
    items: { title: string; text: string }[]
  }
  howItWorks: {
    eyebrow: string
    headingText: string
    headingHighlight: string
    sub: string
    steps: { title: string; text: string }[]
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
  capabilities: {
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
  appStores: {
    eyebrow: string
    title: string
    highlight: string
    text: string
    shotAlt: string
    apple: { small: string; big: string }
    google: { small: string; big: string }
  }
  footer: {
    brand: string
    columns: { title: string; links: { label: string; href: string }[] }[]
    rights: string
    legal: { label: string; href: string }[]
  }
}

export const translations: Record<Lang, LandingDict> = {
  es: {
    langSwitch: "Cambiar idioma",
    nav: {
      links: [
        { href: "#como-funciona", label: "Cómo funciona" },
        { href: "#capacidades", label: "Capacidades" },
        { href: "#descarga", label: "App" },
        { href: "#faq", label: "Preguntas" },
      ],
      signIn: "Iniciar sesión",
      cta: "Crear mi @usuario",
      menuLabel: "Abrir menú",
    },
    hero: {
      title: "Desbloquea las fronteras del dinero",
      highlight: "fronteras",
      lead: "Mándale dinero a los tuyos en otro país: fácil, rápido y sin comisiones que se coman lo que envías.",
      ctaPrimary: "Crear mi cuenta",
      ctaSecondary: "Iniciar sesión",
      note: "Verificación de identidad · Sin datos bancarios · Cobros B2B con QR",
      shotAlt: "Panel de Brux",
      sandbox: "Sandbox · Demo",
      sandboxA11y: "Acceder al sandbox de Brux",
      waitlist: {
        socialProof: (count) => `+${count} personas esperando entrar`,
        emailPlaceholder: "tu@correo.com",
        emailLabel: "Tu correo",
        submit: "Unirme a la lista",
        submitting: "Apuntándote…",
        success: "¡Estás dentro! Te avisamos en cuanto abramos.",
        alreadyIn: "Ya estabas en la lista — te avisamos pronto.",
        invalid: "Ese correo no parece válido.",
        offline: "Ahora no podemos guardarte. Inténtalo en unos minutos.",
        error: "Algo salió mal. Inténtalo de nuevo.",
        haveAccount: "¿Ya tienes cuenta?",
        signIn: "Iniciar sesión",
      },
    },
    highlights: {
      headingText: "Brux es para TODOS los que mueven dinero.",
      headingHighlight: "todos",
      cta: "Conocer más",
      items: [
        {
          title: "Creadores y freelancers",
          text: "Cobra a clientes del mundo entero sin abrir cuentas locales ni esperar días.",
        },
        {
          title: "Negocios y comercios",
          text: "Acepta pagos sin POS ni terminales. Tus clientes pagan con QR en segundos.",
        },
        {
          title: "Familia y amigos",
          text: "Manda dinero a los tuyos, vivan donde vivan. Llega tan rápido como un mensaje.",
        },
      ],
    },
    howItWorks: {
      eyebrow: "Cómo funciona",
      headingText: "Empezar toma minutos, no días",
      headingHighlight: "minutos",
      sub: "Tres pasos y ya estás moviendo dinero entre países.",
      steps: [
        {
          title: "Crea tu @usuario",
          text: "Regístrate, verifica tu identidad una sola vez y reserva el alias con el que el mundo te pagará.",
        },
        {
          title: "Comparte o escanea",
          text: "Pasas tu @usuario o tu QR. La otra persona no necesita —ni ve— tus datos bancarios.",
        },
        {
          title: "El dinero llega",
          text: "Recibe y envía entre países en segundos. Sin filas, sin esperas, sin papeleo.",
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
    capabilities: {
      headingText: "El @usuario es solo el comienzo.",
      headingHighlight: "@usuario",
      sub: "Todo lo que necesitas para cobrar, pagar y mover dinero — sin compartir tu banco.",
      cards: [
        {
          title: "Entre países",
          text: "Envía dinero desde donde estás hacia donde la otra persona lo necesita.",
        },
        {
          title: "Envía a una persona",
          text: "Solo eliges a quién, cuánto quieres mandar y Brux se encarga del resto.",
        },
        {
          title: "Cobro con QR",
          text: "Tus clientes escanean y pagan. Cero papeles, cero datos bancarios.",
        },
        {
          title: "Control y seguridad",
          text: "Cada movimiento queda claro, trazable y visible para reducir fricción y errores.",
        },
      ],
    },
    faq: {
      headingText: "Preguntas frecuentes",
      headingHighlight: "frecuentes",
      items: [
        {
          q: "¿Qué es Brux?",
          a: "Una forma simple de enviar y recibir dinero entre países. En vez de cuentas y números largos, usas tu @usuario o un QR, y el dinero se mueve tan rápido como un mensaje.",
        },
        {
          q: "¿Cómo envío dinero a otra persona?",
          a: "Eliges a quién (su @usuario, correo o QR), pones el monto y confirmas. En unos toques tu envío está en camino.",
        },
        {
          q: "¿Puedo enviar dinero usando solo un @usuario?",
          a: "Sí. El @usuario es la identidad de pago: con eso basta para enviar o cobrar, sin pedir ni mostrar datos bancarios.",
        },
        {
          q: "¿La otra persona necesita tener Brux?",
          a: "Para recibir en Brux, sí necesita su cuenta y su @usuario. Crearla es gratis y toma menos de un minuto.",
        },
        {
          q: "¿Cuánto tarda en llegar el dinero?",
          a: "La mayoría de los envíos llegan en segundos. Entre algunos países puede tardar un poco más según la red, pero siempre ves el estado en tiempo real.",
        },
        {
          q: "¿Cuánto cuesta enviar dinero?",
          a: "Usamos el tipo de cambio real, sin márgenes ocultos ni comisiones altas que se coman lo que mandas. Antes de confirmar ves exactamente cuánto recibe la otra persona.",
        },
        {
          q: "¿Puedo recibir dinero sin compartir mi cuenta bancaria?",
          a: "Sí. Compartes tu @usuario o tu QR y listo: nunca expones tu número de cuenta ni tus datos bancarios.",
        },
        {
          q: "¿En qué países estará disponible Brux?",
          a: "Empezamos en varios países de Latinoamérica: El Salvador, México, Guatemala, Colombia, Brasil, Argentina y Costa Rica, y seguiremos sumando más.",
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
    appStores: {
      eyebrow: "Próximamente",
      title: "Llévate Brux en el bolsillo",
      highlight: "bolsillo",
      text: "Mueve tu dinero a la velocidad de un mensaje. Sin filas, sin esperas, sin papeleo.",
      shotAlt: "App móvil de Brux",
      apple: { small: "Descarga en", big: "App Store" },
      google: { small: "Disponible en", big: "Google Play" },
    },
    footer: {
      brand: "Manda dinero a los tuyos en otro país: fácil, rápido y sin comisiones que se coman lo que envías.",
      columns: [
        {
          title: "Producto",
          links: [
            { label: "Cómo funciona", href: "#como-funciona" },
            { label: "Capacidades", href: "#capacidades" },
            { label: "App móvil", href: "#descarga" },
            { label: "Preguntas", href: "#faq" },
          ],
        },
        {
          title: "Empezar",
          links: [
            { label: "Reservar mi @usuario", href: "#empezar" },
            { label: "Volver al inicio", href: "#inicio" },
          ],
        },
      ],
      rights: "Todos los derechos reservados.",
      legal: [
        { label: "Privacidad", href: "#" },
        { label: "Términos", href: "#" },
        { label: "Cookies", href: "#" },
      ],
    },
  },

  en: {
    langSwitch: "Change language",
    nav: {
      links: [
        { href: "#como-funciona", label: "How it works" },
        { href: "#capacidades", label: "Features" },
        { href: "#descarga", label: "App" },
        { href: "#faq", label: "FAQ" },
      ],
      signIn: "Sign in",
      cta: "Create my @username",
      menuLabel: "Open menu",
    },
    hero: {
      title: "Unlock the borders of money",
      highlight: "borders",
      lead: "Send money to your people in another country: easy, fast, and without fees that eat into what you send.",
      ctaPrimary: "Create my account",
      ctaSecondary: "Sign in",
      note: "Identity verification · No bank details · B2B payments with QR",
      shotAlt: "Brux dashboard",
      sandbox: "Sandbox · Demo",
      sandboxA11y: "Enter the Brux sandbox",
      waitlist: {
        socialProof: (count) => `+${count} people waiting to get in`,
        emailPlaceholder: "you@email.com",
        emailLabel: "Your email",
        submit: "Join the waitlist",
        submitting: "Adding you…",
        success: "You're in! We'll ping you the moment we open.",
        alreadyIn: "You were already on the list — we'll be in touch soon.",
        invalid: "That doesn't look like a valid email.",
        offline: "We can't save you right now. Try again in a few minutes.",
        error: "Something went wrong. Please try again.",
        haveAccount: "Already have an account?",
        signIn: "Sign in",
      },
    },
    highlights: {
      headingText: "Brux works for EVERYONE who moves money.",
      headingHighlight: "everyone",
      cta: "Learn more",
      items: [
        {
          title: "Creators & freelancers",
          text: "Get paid by clients worldwide. No local accounts, no waiting days.",
        },
        {
          title: "Businesses & merchants",
          text: "Accept payments without a POS or terminal. Customers pay by QR in seconds.",
        },
        {
          title: "Family & friends",
          text: "Send money to your people, wherever they live. It arrives as fast as a message.",
        },
      ],
    },
    howItWorks: {
      eyebrow: "How it works",
      headingText: "Getting started takes minutes, not days",
      headingHighlight: "minutes",
      sub: "Three steps and you're already moving money across borders.",
      steps: [
        {
          title: "Create your @username",
          text: "Sign up, verify your identity once, and reserve the alias the world will pay you with.",
        },
        {
          title: "Share or scan",
          text: "Hand over your @username or QR. The other person never needs — or sees — your bank details.",
        },
        {
          title: "Money arrives",
          text: "Send and receive across countries in seconds. No lines, no waiting, no paperwork.",
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
    capabilities: {
      headingText: "Your @username is just the start.",
      headingHighlight: "@username",
      sub: "Everything you need to get paid, pay and move money — without sharing your bank.",
      cards: [
        {
          title: "Cross-border",
          text: "Send money from where you are to where the other person needs it.",
        },
        {
          title: "Send to a person",
          text: "Just pick who and how much. Brux takes care of the rest.",
        },
        {
          title: "QR collection",
          text: "Your customers scan and pay. Zero paper, zero bank details.",
        },
        {
          title: "Control & visibility",
          text: "Every movement is clear, traceable and visible — less friction, fewer errors.",
        },
      ],
    },
    faq: {
      headingText: "Frequently asked questions",
      headingHighlight: "questions",
      items: [
        {
          q: "What is Brux?",
          a: "A simple way to send and receive money across countries. Instead of accounts and long numbers, you use your @username or a QR, and money moves as fast as a message.",
        },
        {
          q: "How do I send money to someone?",
          a: "Pick who (their @username, email or QR), enter the amount and confirm. In a few taps your transfer is on its way.",
        },
        {
          q: "Can I send money using just a @username?",
          a: "Yes. The @username is your payment identity: that's all you need to send or get paid — no bank details asked for or shown.",
        },
        {
          q: "Does the other person need Brux?",
          a: "To receive on Brux, yes — they need an account and their @username. Creating one is free and takes less than a minute.",
        },
        {
          q: "How long does the money take to arrive?",
          a: "Most transfers arrive in seconds. Between some countries it may take a little longer depending on the network, but you always see the status in real time.",
        },
        {
          q: "How much does it cost to send money?",
          a: "We use the real exchange rate, with no hidden margins and no high fees eating into what you send. Before you confirm, you see exactly how much the other person receives.",
        },
        {
          q: "Can I receive money without sharing my bank account?",
          a: "Yes. You share your @username or QR and that's it: you never expose your account number or bank details.",
        },
        {
          q: "Which countries will Brux be available in?",
          a: "We're starting across Latin America: El Salvador, Mexico, Guatemala, Colombia, Brazil, Argentina and Costa Rica, and we'll keep adding more.",
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
    appStores: {
      eyebrow: "Coming soon",
      title: "Carry Brux in your pocket",
      highlight: "pocket",
      text: "Move your money at the speed of a message. No lines, no waiting, no paperwork.",
      shotAlt: "Brux mobile app",
      apple: { small: "Download on the", big: "App Store" },
      google: { small: "Get it on", big: "Google Play" },
    },
    footer: {
      brand: "Send money to your people in another country: easy, fast, and without fees that eat into what you send.",
      columns: [
        {
          title: "Product",
          links: [
            { label: "How it works", href: "#como-funciona" },
            { label: "Features", href: "#capacidades" },
            { label: "Mobile app", href: "#descarga" },
            { label: "FAQ", href: "#faq" },
          ],
        },
        {
          title: "Get started",
          links: [
            { label: "Reserve my @username", href: "#empezar" },
            { label: "Back to top", href: "#inicio" },
          ],
        },
      ],
      rights: "All rights reserved.",
      legal: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
        { label: "Cookies", href: "#" },
      ],
    },
  },
}
