import axios from "axios";
import { Record } from "../domain/record";

export async function GetAllRecords(): Promise<Record[]> {
        try {
                const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

                // Axiosの型は response.data が any にならないように定義するのも可能
                const response = await axios.get<{ id: string; title: string; time: number }[]>(`${API_URL}/records`);

                const data: Record[] = response.data.map((item) => {
                        return Record.newRecord(item.id, item.title, item.time);
                });

                return data;
        } catch (err: unknown) {
                if (err instanceof Error) {
                        throw new Error(err.message);
                } else {
                        throw new Error("Unknown error");
                }
        }
}

// import { Record } from "../domain/record";
// import supabase from "../utils/supabase";

//         // ジェネリック型引数として使用され、useStateフックが管理する状態の型
//         // useStateフックの型引数として、Record型の配列を指定
//         // data状態がRecordオブジェクトの配列であることが保証される
// export async function GetAllRecords(): Promise<Record[]> {
//         const response = await supabase.from("study-record").select("*")
//         .order("created_at", { ascending: true }); // created_atフィールドで並べ替え;
//         if (response.error) {
//                 throw new Error(response.error.message);
//         }

//         // console.log("lib/record.ts response", response);
//         const data = response.data.map((todo) => {
//                 return Record.newRecord(todo.id, todo.title, todo.time);
//         });

//         return data; ;
// }
