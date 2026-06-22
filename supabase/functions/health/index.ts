import { withSupabase } from 'npm:@supabase/server';

export default {
  fetch: withSupabase({ auth: 'none' }, async (_req, _ctx) => {
    return Response.json({
      status: 'ok',
      time: new Date().toISOString(),
    });
  }),
};
