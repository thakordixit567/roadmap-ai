import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the JWT token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
        auth: {
          persistSession: false,
        },
      }
    );

    // Pass the token directly to getUser
    const {
      data: { user },
    } = await supabaseClient.auth.getUser(token);

    if (!user) {
      throw new Error('Unauthorized');
    }

    const { topic, description, difficultyLevel, duration } = await req.json();

    if (!topic) {
      throw new Error('Topic is required');
    }

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are an expert learning path designer. Create comprehensive, structured learning roadmaps.

Your roadmap should include:
1. A clear title summarizing the learning path
2. Multiple learning phases (3-5 phases)
3. For each phase:
   - A descriptive title
   - A brief description
   - Key milestones or topics to master
4. Realistic time estimates for each phase

Format your response as JSON with this structure:
{
  "title": "string",
  "description": "string",
  "phases": [
    {
      "title": "string",
      "description": "string",
      "duration": "string",
      "milestones": ["string", "string", ...]
    }
  ]
}`;

    const userPrompt = `Create a ${difficultyLevel} level learning roadmap for: ${topic}
Duration: ${duration}
${description ? `Additional context: ${description}` : ''}

Make it practical, actionable, and tailored to the ${difficultyLevel} skill level.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      throw new Error('Failed to generate roadmap');
    }

    const aiData = await aiResponse.json();
    const roadmapContent = JSON.parse(aiData.choices[0].message.content);

    // Save roadmap to database
    const { data: roadmap, error: dbError } = await supabaseClient
      .from('roadmaps')
      .insert({
        user_id: user.id,
        title: roadmapContent.title,
        description: roadmapContent.description || description || '',
        topic,
        difficulty_level: difficultyLevel,
        duration,
        content: roadmapContent,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    return new Response(JSON.stringify(roadmap), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-roadmap function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
