import { client, db } from '.';
import { goalCompletions, goals } from './schema';
import dayjs from 'dayjs';

// função para popular o banco de dados 
async function seed() {
  await db.delete(goalCompletions);
  await db.delete(goals);

  const result = await db.insert(goals).values([
    {title: 'Estudar JavaScript', weeklyFrequency: 5},
    {title:'Acordar 8h', weeklyFrequency:5},
    {title:'Meditar', weeklyFrequency: 4}
  ]).returning();

  const startOfWeek = dayjs().startOf('week');


  await db.insert(goalCompletions).values([
    {goalId: result[0].id, createdAt: startOfWeek.toDate()},
    {goalId: result[1].id, createdAt: startOfWeek.add(-5,'day').toDate()}
  ]);
}

seed().finally(() =>{
  client.end();
});