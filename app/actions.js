'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
// import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

export async function createCard(data) {
  const supabase = createServerActionClient({ cookies })
  let input = {
    title: data.get('title'),
    question: data.get('question'),
    answer: data.get('answer'),
    difficulty: data.get('difficulty'),
  }
  if (!input.title || !input.question || !input.answer || !input.difficulty) {
    return { error: 'Missing required fields' };
  }
  let res = await supabase.from('cards').insert(input)
  console.log(res);
  if (!res.error) {
    redirect('/cards')
  } else {
    console.log('error', res.error);
    console.log('input', input);
    return { error: res.error.message};
  }
}
