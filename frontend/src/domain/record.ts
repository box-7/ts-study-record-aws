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

//// export class Record
// export: このクラスを他のモジュールからインポートできるようにする
// class Record: Recordクラスを定義する
// constructor: クラスのインスタンスを初期化するためのコンストラクタ。3つの引数を受け取り、それぞれのプロパティに値を設定する
// public id: string: idプロパティは文字列型で、クラスの外部からアクセス可能
// public title: string: titleプロパティは文字列型で、クラスの外部からアクセス可能
// public time: number: timeプロパティは数値型で、クラスの外部からアクセス可能

//// newRecord静的メソッド
// newRecordメソッドは、Recordクラスの静的メソッド。新しいRecordオブジェクトを作成して返す。
// public: このメソッドがクラスの外部からアクセス可能であることを示す
// static: このメソッドが静的メソッドであり、クラスのインスタンスを作成せずに呼び出すことができることを示す
// newRecord: メソッド名
// 引数:
// id: string: idプロパティの値を指定する
// title: string: titleプロパティの値を指定する
// time: number: timeプロパティの値を指定する
// 戻り値の型: Record型のオブジェクトを返す
// メソッドの本体:
// return new Record(id, title, time);: 新しいRecordオブジェクトを作成し、返す




