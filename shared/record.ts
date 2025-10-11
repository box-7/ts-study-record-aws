// backend/domain/record.ts
export class Record {
        constructor(
                public id: string,
                public title: string,
                public time: number
        ) { }

        public static newRecord(
                id: string,
                title: string,
                time: number
        ): Record {
                return new Record(id, title, time);
        }
}