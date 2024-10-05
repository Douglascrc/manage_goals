import dayjs from 'dayjs';
import { db } from '../db';
import { goalCompletions, goals } from '../db/schema';
import { and, eq, gte, lte, sql } from 'drizzle-orm';



export async function getWeekSummary() {
  
  const firstDayOfWeek = dayjs().startOf('week').toDate();
  const lastDayOfWeek = dayjs().endOf('week').toDate();

  //query para retorna as metas da semana
  const goalsCreateUpToWeek = await db.$with('goals_created_up_to_week').as(
    db.select({
      id: goals.id,
      title: goals.title,
      createdAt: goals.createdAt,
      weeklyFrequency: goals.weeklyFrequency  
    }).from(goals).where(lte(goals.createdAt,lastDayOfWeek))
  );
  //query para retorna as metas completas na semana
  const goalsCompletedInWeek = await db.$with('goals_completed_in_week').as(
    db.select({
      id: goalCompletions.id,
      title: goals.title,
      completedAt: goalCompletions.createdAt,
      completedDate: sql`
        DATE(${goalCompletions.createdAt})`
        .as('completedAtDate')
    }).from(goalCompletions).innerJoin(goals, eq(goals.id, goalCompletions.goalId))
      .where(and(
        gte(goalCompletions.createdAt, firstDayOfWeek),
        lte(goalCompletions.createdAt, lastDayOfWeek)
      )
      )
  );

  const goalsCompletedByWeekDay = await db.$with('goals_completed_by_week_day').as(
    db.select({
      completedAtDate: goalsCompletedInWeek.completedDate,
      completions: sql`
      JSON_AGG(
        JSON_BUILD_OBJECT(
          'id', ${goalsCompletedInWeek.id},
          'title', ${goalsCompletedInWeek.title},
          'completedAt', ${goalsCompletedInWeek.completedAt}
        )
      )`.as('completions')
    }).from(goalsCompletedInWeek).groupBy(goalsCompletedInWeek.completedDate)
  );

  const result = await db.with(goalsCreateUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
    .select({
      completed: sql`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(Number),
      total:  sql`(SELECT SUM(${goalsCreateUpToWeek.weeklyFrequency}) FROM ${goalsCreateUpToWeek})`.mapWith(Number),
      goalsPerDay: sql`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `
    }).from(goalsCompletedByWeekDay);

  return {
    summary: result,
  };
}
