import fastify from 'fastify';
import { createGoal } from '../features/create-goal';
import z from 'zod';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';
import { getWeekPendingGoals } from '../features/get-week-pending-goals';
import { createGoalsCompletions } from '../features/create-goal-completion';

const server = fastify().withTypeProvider<ZodTypeProvider>();

// Add schema validator and serializer
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

server.get('/pending-goals', async () => {
  const sql = getWeekPendingGoals();

  return sql;  
});

server.post('/goals', {
  schema: {
    body: z.object({
      title: z.string(),
      weeklyFrequency: z.number().int().min(1).max(7),
    }),
  }
},
async (request) => {
  const { title, weeklyFrequency } = request.body;
  await createGoal({
    title,
    weeklyFrequency,
  });
});

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

server.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP server is running!');
});