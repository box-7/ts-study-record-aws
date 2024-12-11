import { useState, ChangeEvent } from 'react';
// import './App.css'
import supabase from './utils/supabase';
import { useEffect } from 'react';
import { Record } from './domain/record';
import { Spinner, Text, VStack, Center, Box, Flex } from "@chakra-ui/react"
import {
        DialogActionTrigger,
        DialogBody,
        DialogCloseTrigger,
        DialogContent,
        DialogFooter,
        DialogHeader,
        DialogRoot,
        DialogTitle,
        DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

import { useForm } from "react-hook-form"

// データの型を定義
interface StudyRecord {
        id: string; // UUID型のフィールド
        title: string;
        time: number;
}


function App() {
        const [data, setData] = useState<StudyRecord[]>([]);
        const [totalTime, setTotalTime] = useState(0);
        const [isLoading, setIsLoading] = useState(true);

        const fetchData = async () => {
                try {
                        const { data } = await supabase.from('study-record').select('*');
                        //       setData(data || []);
                        //       setIsLoading(false);
                        if (data) {
                                // 取得したデータを Record クラスのインスタンスに変換
                                const records = data.map((item: Partial<Record>) => new Record(
                                        item.id || '',
                                        item.title || '',
                                        item.time || 0
                                ));
                                setData(records);
                        } else {
                                setData([]);
                        }
                        setIsLoading(false);
                        // setTimeout(() => {
                        //         setIsLoading(false);
                        // }, 3000); // 3秒間ローディングを表示

                } catch (error) {
                        console.error('Error fetching data:', error);
                }
        };

        useEffect(() => {
                fetchData();
                // fetchData().then(data => {
                //         // reduce: 配列の各要素に対して処理を行い、最終的に一つの値を返すメソッド
                //         // acc: 累積値を表します。初期値は0で、各要素を処理するたびにこの値に新しい値が加算される
                //         // record: 配列の現在の要素を表す変数
                //         // acc + parseInt(record.time): 現在の累積値accに、現在の要素のtimeの値を加算した新しい累積値を返す
                //         // 0: reduceメソッドの第二引数で、初期値を指定
                //         const calculatedTotalTime = data.reduce((acc, record) => acc + parseInt(record.time), 0);
                //         setTotalTime(calculatedTotalTime);
                // });
        }, []);

        useEffect(() => {
                if (data) {
                        const calculatedTotalTime = data.reduce(
                                // (acc, record) => acc + parseInt(record.time),
                                (acc, record) => acc + record.time,
                                0
                        );
                        setTotalTime(calculatedTotalTime);
                }
        }, [data]);

        const addTodo = async (title: string, time: number) => {
                const newRecord = new Record('', title, time);

                const { data, error } = await supabase
                        .from('study-record')
                        .insert([{ title: newRecord.title, time: newRecord.time }])
                        .select();
                if (error) {
                        throw error;
                }
                fetchData(); // データを再取得して状態を更新
                // console.log("addTodo data",data);
                return data;
        };

        const handleDelete = async (id: string) => {
                try {
                        await supabase.from('study-record').delete().eq('id', id);
                        fetchData();
                } catch (error) {
                        if (error instanceof Error) {
                                alert(error.message);
                        } else {
                                alert('An unknown error occurred');
                        }
                }
        };

        const [studyContent, setStudyContent] = useState('');
        const [studyHour, setStudyHour] = useState<number | null>(null);
        const [error, setError] = useState('');
        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
                setStudyContent(e.target.value);
        };
        const handleChangeHour = (e: ChangeEvent<HTMLInputElement>) => {
                // setStudyHour(Number(e.target.value));
                // setStudyHour(e.target.value);
                const value = e.target.value;
                setStudyHour(value === '' ? null : Number(value));
        };
        const onClickSetRecord = async (data) => {
                console.log("studyContent", data['study-content'] );
                const studyContent = data['study-content'];
                const studyHour = data['study-number'];
                if (studyContent === '' || studyHour === null) {
                        setError('入力されていない項目があります');
                        return;
                }
                setError('');
                await addTodo(studyContent, studyHour);
                // 非同期なので、ここだとうまくいかない
                // fetchData();
                setStudyContent('');
                setStudyHour(null);
        };
        const onClickCancelRecord = async () => {
                setStudyContent('');
                setStudyHour(null);
        };

        const {
                register,
                handleSubmit,
                formState: { errors },
        } = useForm()
        // const onSubmit = (data) => onClickSetRecord(data.study-content, data.study-hour)
        // const onSubmit = (data) => console.log(data)
        const onSubmit = ((data) => onClickSetRecord(data))
        return (
                <>
                        <Center h="100vh">
                                <Flex justify="center" align="center">
                                        {/* <Box bg="tomato" w="100%" h="100vh" p="4" color="white"> */}
                                        <div>
                                                {isLoading ? (
                                                        //   <p>Loading...</p>
                                                        <VStack colorPalette="teal">
                                                                <Spinner color="colorPalette.600" size="xl" />
                                                                <Text color="colorPalette.600">Loading...</Text>
                                                        </VStack>
                                                ) : data && data.length > 0 ? (
                                                        <>
                                                                <h1>学習記録一覧!</h1>
                                                                <DialogRoot placement={"center"}>
                                                                        <DialogTrigger asChild>
                                                                                <button>
                                                                                        登録
                                                                                </button>
                                                                        </DialogTrigger>
                                                                        <DialogContent>
                                                                                <DialogHeader>
                                                                                        <DialogTitle>学習記録登録</DialogTitle>
                                                                                </DialogHeader>
                                                                                <DialogBody>
                                                                                        <p>
                                                                                                {/* 最初の onSubmit:
                                                                                                <form onSubmit={handleSubmit(onSubmit)}> の onSubmit は、HTML の form 要素の onSubmit イベントハンドラ属性です。
                                                                                                この onSubmit は、フォームが送信されたときに実行される関数を指定します。
                                                                                                二番目の onSubmit:
                                                                                                handleSubmit(onSubmit) の onSubmit は、ユーザーが定義した関数です。この関数は、フォームのデータを処理するために使用されます。
                                                                                                この onSubmit 関数は、フォームのバリデーションが成功した後に呼び出されます。 */}
                                                                                                        <form onSubmit={handleSubmit(onSubmit, errors)}>
                                                                                                                <p>
                                                                                                                        <label htmlFor="study-content">学習内容</label>
                                                                                                                        <input
                                                                                                                                data-testid="study-content"
                                                                                                                                id="study-content"
                                                                                                                                type="text"
                                                                                                                                {...register("study-content", {
                                                                                                                                        required: "必須です",
                                                                                                                                        // maxLength: 30
                                                                                                                                })}
                                                                                                                        />
                                                                                                                </p>
                                                                                                                <p>
                                                                                                                        <label htmlFor="study-content">学習時間</label>
                                                                                                                        <input
                                                                                                                                data-testid="study-hour"
                                                                                                                                id="study-hour"
                                                                                                                                type="number"
                                                                                                                                {...register("study-number", { required: true, maxLength: 30 })}
                                                                                                                        />
                                                                                                                </p>
                                                                                                                <DialogFooter>
                                                                                                                        <DialogActionTrigger asChild>
                                                                                                                                <Button variant="outline" onClick={onClickCancelRecord} >Cancel</Button>
                                                                                                                        </DialogActionTrigger>
                                                                                                                        <DialogActionTrigger asChild>
                                                                                                                                {/* <Button data-testid="add-record" onClick={onClickSetRecord} >Save</Button> */}
                                                                                                                                <Button data-testid="add-record" type="submit" >Save</Button>
                                                                                                                        </DialogActionTrigger>
                                                                                                                </DialogFooter>
                                                                                                        </form>

                                                                                        </p>
                                                                                        {/* <p>
                                                                                                        <label htmlFor="study-content">学習内容</label>
                                                                                                        <input
                                                                                                                data-testid="study-content"
                                                                                                                id="study-content"
                                                                                                                type="text"
                                                                                                                value={studyContent}
                                                                                                                onChange={handleChange}
                                                                                                        />
                                                                                                </p>
                                                                                                <p>
                                                                                                        <label htmlFor="study-hour">学習時間</label>
                                                                                                        <input
                                                                                                                data-testid="study-hour"
                                                                                                                id="study-hour"
                                                                                                                type="number"
                                                                                                                // value={studyHour}
                                                                                                                value={studyHour !== null ? studyHour : ''}
                                                                                                                onChange={handleChangeHour}
                                                                                                        />
                                                                                                </p> */}

                                                                                </DialogBody>
                                                                                {/* <DialogFooter>
                                                                                        <DialogActionTrigger asChild>
                                                                                                <Button variant="outline" onClick={onClickCancelRecord} >Cancel</Button>
                                                                                        </DialogActionTrigger>
                                                                                        <DialogActionTrigger asChild>
                                                                                                <Button data-testid="add-record" onClick={onClickSetRecord} >Save</Button>
                                                                                        </DialogActionTrigger>
                                                                                </DialogFooter> */}
                                                                                <DialogCloseTrigger onClick={onClickCancelRecord} />
                                                                                {/* {error && <div>{error}</div>} */}
                                                                        </DialogContent>
                                                                </DialogRoot>


                                                                <div>
                                                                        {data.map((record) => (
                                                                                <p data-testid="record" key={record.id}>
                                                                                        {record.title} {record.time}時間{' '}
                                                                                        <button
                                                                                                data-testid="delete-button"
                                                                                                onClick={() => handleDelete(record.id)}
                                                                                        >
                                                                                                削除
                                                                                        </button>
                                                                                </p>
                                                                        ))}
                                                                </div>
                                                                <h2>合計時間: {totalTime} / 1000(h)</h2>
                                                        </>
                                                ) : (
                                                        <p>データがありません</p>
                                                )}
                                        </div>
                                </Flex>
                        </Center>
                </>
        );
}

export default App;
