/** @jsxImportSource @emotion/react */
import { useState, ChangeEvent } from 'react';
// import './App.css'
// import supabase from './utils/supabase';
import { useEffect } from 'react';

// import { useForm, SubmitHandler } from 'react-hook-form';
import { Record } from './domain/record';
import { GetAllRecords } from '@/lib/record';
import { RecordDelete } from './lib/record_delete';

import { Spinner, Text, VStack, Center, Flex } from '@chakra-ui/react';
import { Box, Button, Heading, Table } from '@chakra-ui/react';

// EmotionというCSS-in-JSライブラリからcss関数をインポートするためのコード
// JavaScript内でCSSスタイルを定義し、Reactコンポーネントに適用できる
import { css } from '@emotion/react';

import RegistrationDialog from './components/ui/RegistrationDialog';

import { FaBook } from 'react-icons/fa';

function App() {
  const [data, setData] = useState<Record[]>([]);
  const [totalTime, setTotalTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const fetchData = async () => {
    const getAllRecordMethod = async () => {
      // supabaseを呼び出す処理
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
    //         // acc: 累積値を表す。初期値は0で、各要素を処理するたびにこの値に新しい値が加算される
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
        (acc, record) => acc + record.time,
        0
      );
      setTotalTime(calculatedTotalTime);
    }
  }, [data]);

  const handleDelete = async (id: string) => {
    try {
      // eq は、Supabaseのクエリビルダーで使用されるメソッドの一つ
      // 指定したカラムが特定の値と等しいレコードをフィルタリングするために使用
      // eq は "equal" の略で、SQLの = 演算子に相当する
      await RecordDelete(id);
      fetchData();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('An unknown error occurred');
      }
    }
  };

  return (
    <>
      <Center>
        <Flex justify="center" align="center">
          <div>
            {isLoading ? (
              <Center height="100vh">
                <VStack colorPalette="teal">
                  <Spinner
                    color="colorPalette.600"
                    size="xl"
                    role="spinnerStatus"
                  />
                  <Text color="colorPalette.600">Loading...</Text>
                </VStack>
              </Center>
            ) : data && data.length > 0 ? (
              <>
                <Box p={4} pt={8}>
                  <Heading as="h1" fontSize="5xl" size="lg" mb={4}>
                    <Box display="flex" alignItems="center">
                      <FaBook style={{ marginRight: '8px' }} />
                      学習記録一覧
                    </Box>
                  </Heading>

                  <RegistrationDialog
                    button="registration"
                    setData={setData}
                    fetchData={fetchData}
                  />

                  <Table.Root size="md" striped m={8} w="100%">
                    <Table.Header>
                      <Table.Row>
                        <Table.ColumnHeader
                          css={css`
                            //     font-weight: bold;
                            font-size: 20px;
                          `}
                        >
                          タイトル
                        </Table.ColumnHeader>
                        <Table.ColumnHeader
                          css={css`
                            //     font-weight: bold;
                            font-size: 20px;
                          `}
                        >
                          時間
                        </Table.ColumnHeader>
                        <Table.ColumnHeader textAlign="end"></Table.ColumnHeader>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {data.map((item) => (
                        <Table.Row key={item.id}>
                          <Table.Cell>{item.title} </Table.Cell>
                          <Table.Cell>{item.time}時間</Table.Cell>
                          <Table.Cell>
                            <Box display="flex">
                              <RegistrationDialog
                                item={item}
                                button="modifcation"
                                setData={setData}
                                fetchData={fetchData}
                              />
                              <Button
                                ml={2} /* ボタン間にスペースを追加 */
                                // ChakraUIのcolorPalette='red'で、色の変更ができない
                                // そのため、EmotionというCSS-in-JSライブラリで色を変える
                                css={css`
                                  background-color: red;
                                  border-width: 1px;
                                  border-color: black;
                                  color: white;
                                  cursor: pointer;
                                  padding: 6px 10px; /* ボタンを小さくするためにパディングを調整 */
                                  font-size: 18px; /* フォントサイズを小さくする */
                                  &:hover {
                                    background-color: darkred;
                                  }
                                `}
                                data-testid={`delete-button-${item.id}`}
                                onClick={() => handleDelete(item.id)}
                              >
                                削除
                              </Button>
                            </Box>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table.Root>
                  <Heading as="h2" size="2xl" mb={4} mt={6}>
                    合計時間: {totalTime} / 1000(h)
                  </Heading>
                </Box>
              </>
            ) : (
              <>
                <Heading as="h1" fontSize="5xl" size="lg" mb={4}>
                  <Box display="flex" alignItems="center">
                    <FaBook style={{ marginRight: '8px' }} />
                    学習記録一覧
                  </Box>
                </Heading>
                <RegistrationDialog
                  button="registration"
                  setData={setData}
                  fetchData={fetchData}
                />
                <Heading as="h2" size="2xl" mb={4} mt={6}>
                  <p>データがありません</p>
                </Heading>
              </>
            )}
          </div>
        </Flex>
      </Center>
    </>
  );
}

export default App;
