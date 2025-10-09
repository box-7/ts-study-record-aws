import axios from "axios";
import { Record } from "../domain/record";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";

export async function GetAllRecords(): Promise<Record[]> {
        try {
                const response = await axios.get<{ id: string; title: string; time: number }[]>(`${API_URL}/records`);

                const data: Record[] = response.data.map((item) =>
                        Record.newRecord(item.id, item.title, item.time)
                );

                return data;
        } catch (err: unknown) {
                if (err instanceof Error) {
                        throw new Error(err.message);
                } else {
                        throw new Error("Unknown error");
                }
        }
}

/**
 * 新しいレコードを追加
 * @param title 学習内容
 * @param time 学習時間
 * @returns 追加されたRecord
 */
export async function addTodo(title: string, time: number): Promise<Record> {
        try {
                console.log("API_URL:", API_URL);

                const response = await axios.post<{ id: string; title: string; time: number }>(
                        `${API_URL}/records`,
                        { title, time }
                );

                // サーバーから返ってきたデータでRecordを生成
                console.log("Response data:", response.data); // 追加
                return Record.newRecord(response.data.id, response.data.title, response.data.time);

        } catch (err: unknown) {
                if (axios.isAxiosError(err)) {
                        console.error("Axios error response:", err.response?.data);
                        console.error("Status code:", err.response?.status);
                        console.error("Headers:", err.response?.headers);
                        console.error("Message:", err.message);
                } else if (err instanceof Error) {
                        console.error("Error:", err.message);
                } else {
                        console.error("Unknown error:", err);
                }
                throw err; // 必要なら再スロー
        }
}
