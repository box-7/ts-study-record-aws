// frontend/src/lib/recordApi.ts
import { Record } from "@shared/record.ts";

// vite-plugin-env-compatible により、両環境で process.env が使える
// 「両環境」＝ブラウザ（Vite でビルドされたフロントエンド）と Node.js（サーバーや Jest テスト）」
const API_BASE_URL: string = process.env.VITE_API_BASE_URL || "http://localhost:4000";
interface StudyRecordRow {
        id: string;
        title: string;
        time: number;
}

export async function GetAllRecords(): Promise<Record[]> {
        // fetchは、HTTPリクエスト（API通信）を行うためのブラウザ標準の関数
        const res = await fetch(`${API_BASE_URL}/records`);
        if (!res.ok) throw new Error("Failed to fetch records");
        const data = await res.json();
        return data.map((r: StudyRecordRow) => Record.newRecord(r.id, r.title, r.time));
}

export async function DeleteRecord(id: string): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/records/${id}`, { method: "DELETE" });
        if (!res.ok && res.status !== 204) throw new Error("Failed to delete record");
}

export async function CreateRecord(title: string, time: number): Promise<Record> {
        const res = await fetch(`${API_BASE_URL}/records`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, time }),
        });
        if (!res.ok) throw new Error("Failed to create record");
        const data = await res.json();
        return Record.newRecord(data.id, data.title, data.time);
}

export async function UpdateRecord(id: string, title: string, time: number): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/records/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, time }),
        });
        if (!res.ok) throw new Error("Failed to update record");
}
