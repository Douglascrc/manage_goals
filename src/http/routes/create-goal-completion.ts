import z from 'zod';
import { createGoalsCompletions } from '../../features/create-goal-completion';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

export const createGoalCompletionRoute:FastifyPluginAsyncZod=  async (server) => {
  server.post('/completions', {
    schema: {
      body: z.object({
        goalId: z.string(),
      }),
    },
  },
  async (request) => {
    const { goalId } = request.body;
    await createGoalsCompletions({
      goalId,
    });
  },
  );
};