export class Record {
        // constructor(...) { } の中に初期化処理を書くことができる
        // 今回は何も処理を書いていないので、空の本体 { } になっている
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
