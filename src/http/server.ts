import fastify from 'fastify';
import { createGoal } from '../features/create-goal';
import z from 'zod';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';

const server = fastify().withTypeProvider<ZodTypeProvider>();

// Add schema validator and serializer
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

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


server.listen({
  port: 3333,
}).then(() => {
  console.log('HTTP server is running!');
});