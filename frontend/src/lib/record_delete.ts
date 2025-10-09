import { Record } from '../domain/record';
import supabase from '../utils/supabase';

// ジェネリック型引数として使用され、useStateフックが管理する状態の型
// useStateフックの型引数として、Record型の配列を指定
// data状態がRecordオブジェクトの配列であることが保証される
export async function RecordDelete(id: string): Promise<void> {
  await supabase.from('study-record').delete().eq('id', id);
}

// const response = await supabase.from("study-record").select("*");
// if (response.error) {
//         throw new Error(response.error.message);
// }

// // console.log("lib/record.ts response", response);
// const data = response.data.map((todo) => {
//         return Record.newRecord(todo.id, todo.title, todo.time);
// });

// return data; ;
