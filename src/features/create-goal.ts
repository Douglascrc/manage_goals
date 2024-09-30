import { goals } from '../db/schema';
import { db } from '../db';

interface createGoalRequest {
  title: string
  weeklyFrequency: number
}

//função para criar uma meta no banco
export async function createGoal({title, weeklyFrequency}: createGoalRequest) {
  const result = await db.insert(goals).values({
    title,
    weeklyFrequency,
  }).returning();

  const goal = result[0];

  return {
    goal,
  };
}