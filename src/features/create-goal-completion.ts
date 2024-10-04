import { and, count, gte, lte, sql, eq } from 'drizzle-orm';
import { db } from '../db';
import { goalCompletions, goals } from '../db/schema';
import dayjs from 'dayjs';

interface CreateGoalCompletionRequest {
  goalId: string
}

export async function createGoalsCompletions({
  goalId,
}: CreateGoalCompletionRequest) {
  const lastDayOfWeek = dayjs().endOf('week').toDate();
  const firstDayOfWeek = dayjs().startOf('week').toDate();

  const goalsCompletionsCount = db.$with('goal_completions_count').as(
    db.select({
 
      goalId: goalCompletions.goalId,
      completionCount: count(goalCompletions.id).as('completionCount'),
      weeklyFrenquency: goals.weeklyFrequency,
    }).from(goalCompletions).where(
      and(gte(goalCompletions.createdAt, firstDayOfWeek),
        lte(goalCompletions.createdAt, lastDayOfWeek),
        eq(goalCompletions.goalId, goalId)
      )
    ).groupBy(goalCompletions.goalId)
  );

  const result = await db.with(goalsCompletionsCount).select({
    weeklyFrequence: goals.weeklyFrequency,
    completionsCount: sql`COALESCE(${goalsCompletionsCount.completionCount},0)`.mapWith(Number),
  }).from(goals).leftJoin(goalsCompletionsCount, eq(goalsCompletionsCount.goalId, goals.id)).where(eq(goals.id,goalId)).limit(1);

  const {completionsCount: completionCount, weeklyFrequence: weeklyFrenquency} = result[0];

  if (completionCount>=weeklyFrenquency) {
    throw new Error('Goal already completed this week');
  }

  const insertResult = await db.insert(goalCompletions).values({goalId}).returning();

  const goalCompletion = insertResult[0];

  return {
    goalCompletion
  };
}