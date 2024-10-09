import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekPendingGoals } from '../../features/get-week-pending-goals';

export const getWeekPendingGoalsRoute:FastifyPluginAsyncZod=  async (server) => {
  server.get('/pending-goals', async () => {
    const sql = getWeekPendingGoals();
  
    return sql;  
  });
};