import { useState, ChangeEvent } from 'react';
// import './App.css'
import supabase from './utils/supabase';
import { useEffect } from 'react';
import { Spinner, Text, VStack, Center, Box, Flex } from '@chakra-ui/react';
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
  // } from './components/ui/dialog';
} from '@/components/ui/dialog'; //なぜか@だとダメ
import { Button } from '@/components/ui/button';

import { useForm, SubmitHandler } from 'react-hook-form';
import { Record } from './domain/record';
import { GetAllRecords } from './lib/record';
import { RecordDelete } from './lib/record_delete';

interface FormValues {
  studyContent: string;
  studyHour: number | null;
}

function App() {
  //   const [data, setData] = useState<StudyRecord[]>([]);
  const [data, setData] = useState<Record[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  //   const fetchData = fetchData();

  const fetchData = async () => {
    const getAllRecordMethod = async () => {
      // supabaseを対応
      const todoRecord = await GetAllRecords();
      setData(todoRecord);
      setIsLoading(false);
    };
    getAllRecordMethod();
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
      console.log('data  useEffect(()', data);
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
    const { error } = await supabase
      .from('study-record')
      .insert([{ title: newRecord.title, time: newRecord.time }])
      .select();
    if (error) {
      throw error;
    }
    fetchData();
  };
  const handleDelete = async (id: string) => {
    try {
      // eq は、Supabaseのクエリビルダーで使用されるメソッドの一つ
      // 指定したカラムが特定の値と等しいレコードをフィルタリングするために使用
      // eq は "equal" の略で、SQLの = 演算子に相当する
      await RecordDelete(id);

      console.log('record_delete.ts--------のApp.tsxのモック通過');
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>();
  const onClickCancelRecord = () => {
    reset({
      studyContent: '',
      studyHour: null,
    });
  };
  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    const studyContent = data.studyContent;
    const studyHour = data.studyHour;
    if (studyHour === null || isNaN(studyHour)) {
      // setFormError('学習時間は有効な数値である必要があります');
      return studyContent && studyHour;
    }
    // onSubmitに対してreturn文は必要なさそう
    await addTodo(studyContent, studyHour);
    reset({
      studyContent: '',
      studyHour: null,
    });
  };
  // 監視用のwatchを定義
  const studyContent = watch('studyContent', '');
  const studyHour = watch('studyHour', null);

  return (
    <>
      <Center h="100vh">
        <Flex justify="center" align="center">
          <div>
            {isLoading ? (
              <VStack colorPalette="teal">
                <Spinner
                  color="colorPalette.600"
                  size="xl"
                  role="spinnerStatus"
                />
                <Text color="colorPalette.600">Loading...</Text>
              </VStack>
            ) : data && data.length > 0 ? (
              <>
                <h1>学習記録一覧!</h1>
                <DialogRoot placement={'center'}>
                  <DialogTrigger asChild>
                    <button data-testid="registration">登録</button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>新規登録</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                      <div>
                        {/* 最初の onSubmit: フォーム送信時に実行されるイベントハンドラ
                                handleSubmit は、React Hook Form の関数で、フォームの送信を処理するために使用される
                                二番目の onSubmit: バリデーション成功後にデータを処理するユーザー定義関数 */}
                        <form onSubmit={handleSubmit(onSubmit)}>
                          <div>
                            <label htmlFor="studyContent">学習内容</label>
                            <input
                              id="studyContent"
                              type="text"
                              {...register('studyContent', {
                                required: '内容の入力は必須です',
                              })}
                            />
                            {errors['studyContent'] && (
                              <p>{errors['studyContent'].message}</p>
                            )}
                          </div>

                          <div>
                            <label htmlFor="studyHour">学習時間</label>
                            <input
                              id="studyHour"
                              type="number"
                              {...register('studyHour', {
                                required: '時間の入力は必須です',
                                min: {
                                  value: 0,
                                  message: '時間は0以上である必要があります',
                                },
                              })}
                            />
                            {errors['studyHour'] && (
                              <p>{errors['studyHour'].message}</p>
                            )}
                          </div>

                          <div>
                            {studyContent && studyHour && studyHour >= 0 ? (
                              <DialogActionTrigger asChild>
                                <button type="submit" data-testid="submit">
                                  Save
                                </button>
                              </DialogActionTrigger>
                            ) : (
                              <button
                                type="submit"
                                data-testid="submit-failure"
                              >
                                Save
                              </button>
                            )}

                            <DialogActionTrigger asChild>
                              <Button color="red" onClick={onClickCancelRecord}>
                                Cancel
                              </Button>
                            </DialogActionTrigger>
                          </div>
                        </form>
                      </div>
                    </DialogBody>
                    <DialogCloseTrigger onClick={onClickCancelRecord} />
                  </DialogContent>
                </DialogRoot>
                <table>
                  <tbody>
                    {data.map((record) => (
                      <tr key={record.id}>
                        <td data-testid="study-content-hour">
                          {record.title} {record.time}時間
                        </td>
                        <td>
                          <button
                            //     data-testid="delete-button"
                            data-testid={`delete-button-${record.id}`}
                            onClick={() => handleDelete(record.id)}
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
