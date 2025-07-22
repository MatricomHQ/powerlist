export const theme = {
  colors: {
    // Background gradients
    background: {
      primary: "from-slate-950 via-slate-900 to-slate-950",
      card: "bg-slate-800/50",
      cardHover: "hover:bg-slate-700/50",
      input: "bg-slate-900/50",
      overlay: "bg-slate-900/80",
    },

    // Text colors
    text: {
      primary: "text-white",
      secondary: "text-slate-300",
      muted: "text-slate-400",
      disabled: "text-slate-500",
      gradient: "bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent",
    },

    // Border colors
    border: {
      primary: "border-slate-700",
      secondary: "border-slate-800/50",
      focus: "focus:border-emerald-500",
      dashed: "border-slate-700",
    },

    // Status colors
    status: {
      success: {
        bg: "bg-gradient-to-r from-emerald-500 to-emerald-600",
        hover: "hover:from-emerald-600 hover:to-emerald-700",
        shadow: "shadow-xl shadow-emerald-500/25",
        text: "text-emerald-400",
        badge: "bg-emerald-900/30 text-emerald-300 border-emerald-800/50",
      },
      error: {
        bg: "bg-gradient-to-r from-red-500 to-red-600",
        hover: "hover:from-red-600 hover:to-red-700",
        shadow: "shadow-xl shadow-red-500/25",
        text: "text-red-400",
        badge: "bg-red-900/30 text-red-300 border-red-800/50",
      },
      warning: {
        bg: "bg-gradient-to-r from-amber-500 to-amber-600",
        hover: "hover:from-amber-600 hover:to-amber-700",
        shadow: "shadow-xl shadow-amber-500/25",
        text: "text-amber-400",
        badge: "bg-amber-900/30 text-amber-300 border-amber-800/50",
      },
      info: {
        bg: "bg-gradient-to-r from-blue-500 to-blue-600",
        hover: "hover:from-blue-600 hover:to-blue-700",
        shadow: "shadow-xl shadow-blue-500/25",
        text: "text-blue-400",
        badge: "bg-blue-900/30 text-blue-300 border-blue-800/50",
      },
      purple: {
        bg: "bg-gradient-to-r from-purple-500 to-purple-600",
        hover: "hover:from-purple-600 hover:to-purple-700",
        shadow: "shadow-xl shadow-purple-500/25",
        text: "text-purple-400",
        badge: "bg-purple-900/30 text-purple-300 border-purple-800/50",
      },
    },

    // Button variants
    button: {
      primary:
        "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg text-white",
      secondary: "border-2 border-slate-700 bg-slate-800/50 text-slate-300 hover:text-white hover:bg-slate-700/50",
      ghost: "text-slate-400 hover:text-white hover:bg-slate-800/50",
    },

    // Marketplace colors
    marketplace: {
      ebay: {
        bg: "bg-gradient-to-r from-blue-600 to-blue-700",
        hover: "hover:from-blue-700 hover:to-blue-800",
        shadow: "shadow-lg shadow-blue-600/25",
      },
      facebook: {
        bg: "bg-gradient-to-r from-blue-500 to-blue-600",
        hover: "hover:from-blue-600 hover:to-blue-700",
        shadow: "shadow-lg shadow-blue-500/25",
      },
      mercari: {
        bg: "bg-gradient-to-r from-red-500 to-red-600",
        hover: "hover:from-red-600 hover:to-red-700",
        shadow: "shadow-lg shadow-red-500/25",
      },
      poshmark: {
        bg: "bg-gradient-to-r from-pink-500 to-pink-600",
        hover: "hover:from-pink-600 hover:to-pink-700",
        shadow: "shadow-lg shadow-pink-500/25",
      },
      depop: {
        bg: "bg-gradient-to-r from-purple-500 to-purple-600",
        hover: "hover:from-purple-600 hover:to-purple-700",
        shadow: "shadow-lg shadow-purple-500/25",
      },
    },
  },

  // Effects
  effects: {
    blur: "backdrop-blur-xl",
    shadow: {
      card: "shadow-xl",
      button: "shadow-lg",
      large: "shadow-2xl",
    },
    transition: "transition-all duration-300",
    hover: {
      scale: "hover:scale-105",
      lift: "hover:-translate-y-1",
    },
  },

  // Layout
  layout: {
    nav: {
      top: "sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 shadow-lg",
      bottom:
        "fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800/50 shadow-2xl",
    },
    container: "px-4 pt-6 pb-24 max-w-7xl mx-auto",
    card: "border-0 shadow-xl bg-slate-800/50 backdrop-blur-sm",
  },
} as const

// Helper function to get theme classes
export const getThemeClasses = (path: string) => {
  const keys = path.split(".")
  let current: any = theme

  for (const key of keys) {
    current = current[key]
  }

  return current
}

// Marketplace configuration
export const marketplaces = [
  {
    id: "ebay",
    name: "eBay",
    icon: "🛒",
    description: "Reach millions of buyers worldwide",
    hasAPI: true,
    setupRequired: true,
  },
  {
    id: "facebook",
    name: "Facebook Marketplace",
    icon: "📘",
    description: "Sell locally in your community",
    hasAPI: true,
    setupRequired: true,
  },
  {
    id: "mercari",
    name: "Mercari",
    icon: "🛍️",
    description: "Mobile-first marketplace",
    hasAPI: false,
    setupRequired: false,
  },
  {
    id: "poshmark",
    name: "Poshmark",
    icon: "👗",
    description: "Fashion and lifestyle marketplace",
    hasAPI: false,
    setupRequired: false,
  },
  {
    id: "depop",
    name: "Depop",
    icon: "✨",
    description: "Creative community marketplace",
    hasAPI: false,
    setupRequired: false,
  },
] as const
