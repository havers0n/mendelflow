// Stub for '@supabase/supabase-js'
module.exports = {
  createClient: () => ({
    auth: {
      getUser: async () => ({ data: { user: null } })
    },
    from: () => ({
      select: () => ({ order: () => ({ data: [], error: null }) })
    }),
    // add any other needed stub methods
  }),
  PostgrestError: class PostgrestError extends Error {}
}; 