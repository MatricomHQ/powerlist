// src/lib/marketplaces.ts

/**
 * Interface representing a single marketplace.
 * This structure standardizes how we interact with different platforms.
 */
export interface Marketplace {
  id: "ebay" | "facebook" | "mercari" | "poshmark" | "depop";
  name: string;
  icon: string;
  description: string;
  hasAPI: boolean; // Does the platform have a public API we can integrate with?
  setupRequired: boolean; // Does the user need to provide credentials?

  // --- API Functions (stubs for now) ---

  /**
   * Posts an item to the marketplace.
   * @param item - The inventory item to be listed.
   * @param credentials - The user's API credentials for this marketplace.
   * @returns A promise that resolves with the new listing ID on the platform.
   */
  postItem: (item: any, credentials?: any) => Promise<{ success: boolean; listingId: string; error?: string }>;

  /**
   * Updates an existing item on the marketplace.
   * @param listingId - The ID of the listing on the platform.
   * @param updates - The fields to update.
   * @returns A promise that resolves with the success status.
   */
  updateItem: (listingId: string, updates: any) => Promise<{ success: boolean; error?: string }>;

  /**
   * Removes (unlists) an item from the marketplace.
   * @param item - The inventory item containing marketplace-specific listing IDs.
   * @returns A promise that resolves with the success status.
   */
  unlistItem: (item: any) => Promise<{ success: boolean; error?: string }>;

  /**
   * Removes an item from the marketplace.
   * @param listingId - The ID of the listing on the platform.
   * @returns A promise that resolves with the success status.
   */
  removeItem: (listingId: string) => Promise<{ success: boolean; error?: string }>;
}

/**
 * An array containing all supported marketplace configurations.
 * This is the single source of truth for marketplace data in the app.
 */
export const marketplaces: Marketplace[] = [
  {
    id: "ebay",
    name: "eBay",
    icon: "🛒",
    description: "Reach millions of buyers worldwide",
    hasAPI: true,
    setupRequired: true,
    postItem: async (item) => {
      console.log(`[eBay API Stub] Posting item: ${item.title}`);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate network delay
      console.log("[eBay API Stub] Item posted successfully.");
      return { success: true, listingId: `ebay-${Date.now()}` };
    },
    updateItem: async (listingId, updates) => {
      console.log(`[eBay API Stub] Updating listing ${listingId} with:`, updates);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    unlistItem: async (item) => {
      console.log(`[eBay API Stub] Unlisting item: ${item.title}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    removeItem: async (listingId) => {
      console.log(`[eBay API Stub] Removing listing ${listingId}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
  },
  {
    id: "facebook",
    name: "Facebook Marketplace",
    icon: "📘",
    description: "Sell locally in your community",
    hasAPI: true,
    setupRequired: true,
    postItem: async (item) => {
      console.log(`[Facebook API Stub] Posting item: ${item.title}`);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      console.log("[Facebook API Stub] Item posted successfully.");
      return { success: true, listingId: `fb-${Date.now()}` };
    },
    updateItem: async (listingId, updates) => {
      console.log(`[Facebook API Stub] Updating listing ${listingId} with:`, updates);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    unlistItem: async (item) => {
      console.log(`[Facebook API Stub] Unlisting item: ${item.title}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
    removeItem: async (listingId) => {
      console.log(`[Facebook API Stub] Removing listing ${listingId}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    },
  },
  {
    id: "mercari",
    name: "Mercari",
    icon: "🛍️",
    description: "Mobile-first marketplace",
    hasAPI: false,
    setupRequired: false,
    postItem: async () => Promise.resolve({ success: false, listingId: "", error: "API not available" }),
    updateItem: async () => Promise.resolve({ success: false, error: "API not available" }),
    unlistItem: async () => Promise.resolve({ success: false, error: "API not available" }),
    removeItem: async () => Promise.resolve({ success: false, error: "API not available" }),
  },
  {
    id: "poshmark",
    name: "Poshmark",
    icon: "👗",
    description: "Fashion and lifestyle marketplace",
    hasAPI: false,
    setupRequired: false,
    postItem: async () => Promise.resolve({ success: false, listingId: "", error: "API not available" }),
    updateItem: async () => Promise.resolve({ success: false, error: "API not available" }),
    unlistItem: async () => Promise.resolve({ success: false, error: "API not available" }),
    removeItem: async () => Promise.resolve({ success: false, error: "API not available" }),
  },
  {
    id: "depop",
    name: "Depop",
    icon: "✨",
    description: "Creative community marketplace",
    hasAPI: false,
    setupRequired: false,
    postItem: async () => Promise.resolve({ success: false, listingId: "", error: "API not available" }),
    updateItem: async () => Promise.resolve({ success: false, error: "API not available" }),
    unlistItem: async () => Promise.resolve({ success: false, error: "API not available" }),
    removeItem: async () => Promise.resolve({ success: false, error: "API not available" }),
  },
];

/**
 * Helper function to find a marketplace configuration by its ID.
 * @param id The ID of the marketplace to find.
 * @returns The marketplace object or undefined if not found.
 */
export const getMarketplaceById = (id: string): Marketplace | undefined => {
  return marketplaces.find((m) => m.id === id);
};