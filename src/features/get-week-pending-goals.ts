import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import { db } from '../db';
import { and, count, gte, lte, eq, sql } from 'drizzle-orm';
import { goalCompletions, goals } from '../db/schema';

dayjs.extend(weekOfYear);

//retorna as metas pendentes da semana atual
export async function getWeekPendingGoals() {
  const lastDayOfWeek = dayjs().endOf('week').toDate();
  const firstDayOfWeek = dayjs().startOf('week').toDate();

  const goalsCreatedUpToWeek = db.$with('goals_created_up_to_week').as(
    db.select({
      id: goals.id,
      title: goals.title,
      weeklyFrequency: goals.weeklyFrequency,
      createdAt: goals.createdAt,

    }).from(goals).where(lte(goals.createdAt, lastDayOfWeek))
  );

  const goalsCompletionsCount = db.$with('goal_completions_count').as(
    db.select({
 
      goalId: goalCompletions.goalId,
      completionCount: count(goalCompletions.id).as('completionCount'),

    }).from(goalCompletions).where(
      and(gte(goalCompletions.createdAt, firstDayOfWeek),
        lte(goalCompletions.createdAt, lastDayOfWeek)
      )
    ).groupBy(goalCompletions.goalId)
  );

  const pendingGoals = await db.with(goalsCreatedUpToWeek, goalsCompletionsCount).select({
    id: goalsCreatedUpToWeek.id,
    title: goalsCreatedUpToWeek.title,
    weeklyFrequence: goalsCreatedUpToWeek.weeklyFrequency,
    completionsCount: sql`COALESCE(${goalsCompletionsCount.completionCount},0)`.mapWith(Number),

  }).from(goalsCreatedUpToWeek).leftJoin(
    goalsCompletionsCount, eq(goalsCompletionsCount.goalId,goalsCreatedUpToWeek.id));

  return {
    pendingGoals
  };
}