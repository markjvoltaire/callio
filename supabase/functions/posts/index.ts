import { withSupabase } from 'npm:@supabase/server';

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, ctx) => {
    const url = new URL(req.url);
    const topicId = url.searchParams.get('topicId');

    let query = ctx.supabase.from('posts').select('*').order('created_at', {
      ascending: true,
    }).order('id', { ascending: true });

    if (topicId) {
      query = query.eq('topic_id', topicId);
    }

    const { data, error } = await query;

    if (error) {
      return Response.json({ message: error.message }, { status: 500 });
    }

    return Response.json(data);
  }),
};
