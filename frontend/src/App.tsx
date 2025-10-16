/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useEffect } from 'react';
import { Record } from '@shared/record';
import { GetAllRecords, DeleteRecord } from '@/lib/recordApi';
import { Spinner, Text, VStack, Center } from '@chakra-ui/react';
import { Box, Button, Heading, Table } from '@chakra-ui/react';
import { css } from '@emotion/react';
import RegistrationDialog from './components/ui/RegistrationDialog';
import { FaBook } from 'react-icons/fa';

function App() {
        const [data, setData] = useState<Record[]>([]);
        const [totalTime, setTotalTime] = useState(0);
        const [isLoading, setIsLoading] = useState(true);
        const fetchData = async () => {
                const getAllRecordMethod = async () => {
                        const todoRecord = await GetAllRecords();
                        setData(todoRecord);
                        setIsLoading(false);
                };
                getAllRecordMethod();
        };

        useEffect(() => {
                fetchData();
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
                        await DeleteRecord(id);
                        fetchData(); // 削除後に再取得
                } catch (error) {
                        if (error instanceof Error) {
                                alert(error.message);
                        } else {
                                alert("An unknown error occurred");
                        }
                }
        };

        return (
                <>
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
                                                        <Center>
                                                                <Heading as="h1" fontSize="5xl" size="lg" mb={4}>
                                                                        <Box display="flex" alignItems="center">
                                                                                <FaBook style={{ marginRight: '8px' }} />
                                                                                学習記録一覧
                                                                                <Box ml={8}>

                                                                                        {/* ダイアログ開くボタン */}
                                                                                        <RegistrationDialog
                                                                                                button="registration"
                                                                                                setData={setData}
                                                                                                fetchData={fetchData}
                                                                                        />
                                                                                </Box>
                                                                        </Box>
                                                                </Heading>
                                                        </Center>

                                                        <Center>
                                                                <Box overflowX="auto" minWidth="600px">
                                                                        <Table.Root
                                                                                striped
                                                                        // interactive
                                                                        >
                                                                                <Table.Header>
                                                                                        <Table.Row>
                                                                                                <Table.ColumnHeader>タイトル</Table.ColumnHeader>
                                                                                                <Table.ColumnHeader>時間</Table.ColumnHeader>
                                                                                                <Table.ColumnHeader></Table.ColumnHeader>
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
                                                                </Box>
                                                        </Center>
                                                        <Center>
                                                                <Heading as="h2" size="2xl" mb={4} mt={6}>
                                                                        合計時間: {totalTime} / 1000(h)
                                                                </Heading>
                                                        </Center>
                                                </Box>
                                        </>
                                ) : (
                                        <>
                                                <Box p={4} pt={8}>
                                                        <Center>
                                                                <Heading as="h1" fontSize="5xl" size="lg" mb={4}>
                                                                        <Box display="flex" alignItems="center">
                                                                                <FaBook style={{ marginRight: '8px' }} />
                                                                                学習記録一覧
                                                                                <Box ml={4}>
                                                                                        <RegistrationDialog
                                                                                                button="registration"
                                                                                                setData={setData}
                                                                                                fetchData={fetchData}
                                                                                        />
                                                                                </Box>
                                                                        </Box>
                                                                </Heading>
                                                        </Center>
                                                </Box>
                                                <Center>
                                                        <Heading as="h2" size="2xl" mb={4} mt={6}>
                                                                <p>データがありません</p>
                                                        </Heading>
                                                </Center>
                                        </>
                                )}
                        </div>
                </>
        );
}

export default App;
