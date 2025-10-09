// src/lib/record.ts
import { Record } from "@/domain/record";

interface StudyRecordRow {
        id: string;
        title: string;
        time: number;
}

export async function GetAllRecords(): Promise<Record[]> {
        const res = await fetch("http://localhost:4000/records");
        if (!res.ok) throw new Error("Failed to fetch records");
        const data = await res.json();
        return data.map((r: StudyRecordRow) => Record.newRecord(r.id, r.title, r.time));
}

export async function DeleteRecord(id: string): Promise<void> {
        const res = await fetch(`http://localhost:4000/records/${id}`, { method: "DELETE" });
        if (!res.ok && res.status !== 204) throw new Error("Failed to delete record");
}

export async function CreateRecord(title: string, time: number): Promise<Record> {
        const res = await fetch("http://localhost:4000/records", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, time }),
        });
        if (!res.ok) throw new Error("Failed to create record");
        const data = await res.json();
        return Record.newRecord(data.id, data.title, data.time);
}

export async function UpdateRecord(id: string, title: string, time: number): Promise<void> {
        const res = await fetch(`http://localhost:4000/records/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, time }),
        });
        if (!res.ok) throw new Error("Failed to update record");
}