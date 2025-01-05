import React from 'react';
import {
        render,
        screen,
        waitFor,
        act,
        fireEvent,
} from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import supabase from '@/utils/supabase';

it('タイトルをレンダリングする', async () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );
        // 非同期処理が完了するまで待機
        await waitFor(() => {
                expect(screen.getByText('学習記録一覧')).toBeInTheDocument();
        });
});
it('isLoadingがtrueのとき、ローディング・スピナーとテキストを表示する', () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );
        // スピナーが表示されているか確認
        expect(screen.getByRole('spinnerStatus')).toBeInTheDocument();
        // "Loading..." テキストが表示されているか確認
        expect(screen.getByText('Loading...')).toBeInTheDocument();
});

it('新規登録ボタンがある', async () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );
        await waitFor(() => {
                const registerButton = screen.getByRole('button', { name: '登録' });
                expect(registerButton).toBeInTheDocument();
        });
});

test('登録できること', async () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );

        const registerButton = await waitFor(() =>
                screen.getByTestId('registration')
        );
        await userEvent.click(registerButton);

        await waitFor(() => {
                const dialogTitle = screen.getByText('新規登録');
                expect(dialogTitle).toBeInTheDocument();
        });

        // 入力フィールドに値を入力
        const studyContentInput = screen.getByLabelText(
                '学習内容'
        ) as HTMLInputElement;
        const studyHourInput = screen.getByLabelText('学習時間') as HTMLInputElement;
        await userEvent.type(studyContentInput, 'Math');
        await userEvent.type(studyHourInput, '2');

        // Saveボタンが有効になるのを待つ
        const submitButton = await waitFor(() => screen.getByTestId('submit'));
        expect(submitButton).not.toBeDisabled();

        await userEvent.click(submitButton);

        // 結果が表示されるのを待つ
        await waitFor(() => {
                const studyContentHour = screen
                        .getAllByRole('row')
                        .find(
                                (element) =>
                                        element.textContent && element.textContent.includes('Math 2時間')
                        );
                expect(studyContentHour).toBeInTheDocument();
        });
});

test('モーダルが新規登録というタイトルになっている', async () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );
        const registerButton = await waitFor(() =>
                screen.getByTestId('registration')
        );
        await userEvent.click(registerButton);
        await waitFor(() => {
                const dialogTitle = screen.getByText('新規登録');
                expect(dialogTitle).toBeInTheDocument();
        });
});

test('学習内容がないときに登録するとエラーが出る', async () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );

        const registerButton = await waitFor(() =>
                screen.getByTestId('registration')
        );
        await userEvent.click(registerButton);

        // ダイアログが表示されるのを待つ
        await waitFor(() => {
                const dialogTitle = screen.getByText('新規登録');
                expect(dialogTitle).toBeInTheDocument();
        });

        // Saveボタンが有効になるのを待つ
        const submitButton = await waitFor(() =>
                screen.getByTestId('submit-failure')
        );
        expect(submitButton).not.toBeDisabled();
        await userEvent.click(submitButton);

        // 結果が表示されるのを待つ
        await waitFor(() => {
                const studyContentError = screen.getByText('内容の入力は必須です');
                const studyHourError = screen.getByText('時間の入力は必須です');
                expect(studyContentError && studyHourError).toBeInTheDocument();
        });
});

test('学習内容がないときに登録するとエラーが出る 未入力エラー、0未満エラー', async () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );

        const registerButton = await waitFor(() =>
                screen.getByTestId('registration')
        );
        await userEvent.click(registerButton);

        await waitFor(() => {
                const dialogTitle = screen.getByText('新規登録');
                expect(dialogTitle).toBeInTheDocument();
        });

        // const studyContentInput = screen.getByLabelText('学習内容') as HTMLInputElement;
        const studyHourInput = screen.getByLabelText('学習時間') as HTMLInputElement;
        // await userEvent.type(studyContentInput, '');
        await userEvent.type(studyHourInput, '-1');

        await waitFor(() => {
                // 入力フィールドの値をアサート
                // expect(studyContentInput).toHaveValue('');
                expect(studyHourInput).toHaveValue(-1);
        });

        // Saveボタンが有効になるのを待つ
        const submitButton = await waitFor(() =>
                screen.getByTestId('submit-failure')
        );
        expect(submitButton).not.toBeDisabled();
        await userEvent.click(submitButton);

        // 結果が表示されるのを待つ
        await waitFor(() => {
                const studyContentError = screen.getByText('内容の入力は必須です');
                const studyHourError = screen.getByText('時間は0以上である必要があります');
                expect(studyContentError && studyHourError).toBeInTheDocument();
        });
});

it('モーダルのタイトルが記録編集であること', async () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );
        await waitFor(() => {
                expect(screen.getByText('学習記録一覧')).toBeInTheDocument();
        });
        await waitFor(() => {
                const editButton = screen.getAllByRole('button', { name: '編集' })[0];
                fireEvent.click(editButton);
        });
        // モーダルのタイトルが表示されるまで待機
        await waitFor(() => {
                expect(screen.getByText('記録編集')).toBeInTheDocument();
        });
});

import * as recordLib from '@/lib/record.ts';
import * as recordLibDelete from '@/lib/record_delete.ts';
import { v4 as uuidv4 } from 'uuid';

describe('mockを使ったテスト', () => {
        // spyOnの場合、jest.mockは不要(あっても良い)
        jest.mock('@/lib/record.ts');
        jest.mock('@/lib/record_delete.ts');

        //   beforeEachはなくても3つのテストを一気にやって通った
        //   beforeEach(() => {
        //         jest.clearAllMocks(); // すべてのモックをクリア
        //     });

        test('削除ができること', async () => {
                const { Record } = jest.requireActual('@/domain/record');
                const validUUID1 = uuidv4();
                const validUUID2 = uuidv4();
                const validUUID3 = uuidv4();
                const validUUID4 = uuidv4();
                // await waitFor(() => {
                jest
                        .spyOn(recordLib, 'GetAllRecords')
                        .mockResolvedValueOnce([
                                new Record(validUUID1, 'Testtest5', 5),
                                new Record(validUUID2, 'Testtest10', 10),
                        ])
                        .mockResolvedValueOnce([
                                new Record(validUUID2, 'Testtest10', 10),
                                new Record(validUUID3, 'Testtest11', 11),
                                new Record(validUUID4, 'Testtest12', 12),
                        ]);

                // classを使わなくても、以下のように書ける
                // .mockResolvedValueOnce(Promise.resolve([
                //         { id: '5', title: 'Testtest5', time: 5 },
                //         { id: '10', title: 'Testtest10', time: 10 }
                //       ]))
                //       .mockResolvedValueOnce(Promise.resolve([
                //         { id: '10', title: 'Testtest10', time: 10 },
                //         { id: '11', title: 'Testtest11', time: 11 },
                //         { id: '12', title: 'Testtest12', time: 12 }
                //       ]));
                // });

                await waitFor(() => {
                        // export async function RecordDelete(id: string): Promise<void>のため、何も返さない（void）プロミスを返す
                        jest
                                .spyOn(recordLibDelete, 'RecordDelete')
                                .mockResolvedValueOnce(Promise.resolve());
                });

                render(
                        <ChakraProvider value={defaultSystem}>
                                <App />
                        </ChakraProvider>
                );

                await waitFor(() => {
                        const dialogTitle = screen.getByText('登録');
                        expect(dialogTitle).toBeInTheDocument();
                });

                const deleteButton = await waitFor(() =>
                        screen.getByTestId(`delete-button-${validUUID1}`)
                );

                await waitFor(() => {
                        fireEvent.click(deleteButton);
                });
                //     screen.debug();
                await waitFor(() => {
                        //  expect(screen.queryByText('Testtest5 5時間')).toBeInTheDocument();
                        expect(screen.queryByText('Testtest5 5時間')).not.toBeInTheDocument();
                });
        });


        //データがない場合エラーになるので、モックデータを使って回避
        test('isLoadingがfalseの場合、データテーブルを表示する', async () => {
                const { Record } = jest.requireActual('@/domain/record');
                const validUUID1 = uuidv4();
                const validUUID2 = uuidv4();
                const validUUID3 = uuidv4();
                const validUUID4 = uuidv4();
                await waitFor(() => {
                        jest
                                .spyOn(recordLib, 'GetAllRecords')
                                // .mockResolvedValueOnce([
                                //   new Record('51', 'Testtest51', 51),
                                //   new Record('101', 'Testtest101', 101),
                                // ])
                                // .mockResolvedValueOnce([
                                //   new Record('101', 'Testtest101', 101),
                                //   new Record('111', 'Testtest111', 111),
                                //   new Record('121', 'Testtest121', 121),
                                // ]);
                                .mockResolvedValueOnce([
                                        new Record(validUUID1, 'Testtest51', 51),
                                        new Record(validUUID2, 'Testtest101', 101),
                                ])
                                .mockResolvedValueOnce([
                                        new Record(validUUID2, 'Testtest101', 101),
                                        new Record(validUUID3, 'Testtest111', 111),
                                        new Record(validUUID4, 'Testtest121', 121),
                                ]);
                });
                render(
                        <ChakraProvider value={defaultSystem}>
                                <App />
                        </ChakraProvider>
                );
                await waitFor(() => {
                        const dialogTitle = screen.getByText('登録');
                        expect(dialogTitle).toBeInTheDocument();
                });
                await waitFor(() => {
                        expect(screen.getByRole('table')).toBeInTheDocument();
                });

        });


        test('編集して登録すると更新される', async () => {
                const { Record } = jest.requireActual('@/domain/record');
                const validUUID1 = uuidv4();
                const validUUID2 = uuidv4();
                console.log('validUUID1', validUUID1);
                // console.log('validUUID2', validUUID2);
                // await waitFor(() => {
                jest
                        .spyOn(recordLib, 'GetAllRecords')
                        .mockResolvedValueOnce([
                                new Record(validUUID1, 'Testtest50', 50),
                                new Record(validUUID2, 'Testtest100', 100),
                        ])
                        .mockResolvedValueOnce([
                                new Record(validUUID1, 'English', 8),
                                new Record(validUUID2, 'Testtest100', 100),
                        ]);
                // });
                render(
                        <ChakraProvider value={defaultSystem}>
                                <App />
                        </ChakraProvider>
                );
                screen.debug();
                await waitFor(() => {
                        expect(screen.getByText('学習記録一覧')).toBeInTheDocument();
                });

                const editButton = screen.getAllByRole('button', { name: '編集' })[0];
                fireEvent.click(editButton);

                await waitFor(() => {
                        expect(screen.getByText('記録編集')).toBeInTheDocument();
                });

                const studyContentInput = screen.getByLabelText(
                        '学習内容'
                ) as HTMLInputElement;
                const studyHourInput = screen.getByLabelText(
                        '学習時間'
                ) as HTMLInputElement;
                await userEvent.clear(studyContentInput);
                await userEvent.type(studyContentInput, 'English');
                await userEvent.clear(studyHourInput);
                await userEvent.type(studyHourInput, '8');

                // 入力フィールドの値を確認
                expect(studyContentInput.value).toBe('English');
                expect(studyHourInput.value).toBe('8');

                // Saveボタンが有効になるのを待つ // 新規登録と同じtestIdを使うと、エラーになる
                const submitButton = await waitFor(() =>
                        screen.getByTestId('submit-modify')
                );
                expect(submitButton).not.toBeDisabled();

                await waitFor(() => {
                        userEvent.click(submitButton);
                        // fireEvent.click(submitButton);
                });
                // screen.debug();
                await waitFor(() => {
                        // screen.debug(); // この位置だとログがおかしくなる
                        const studyContentHour = screen.getAllByRole('row').find(
                                (element) =>
                                        // console.log('element', element)
                                        element.textContent && element.textContent.includes('English 8時間')
                        );
                        expect(studyContentHour).toBeInTheDocument();
                });
        });
});

// Jest.mockの書き方
describe('mockを使ったテスト Jest.mockの書き方', () => {
        // // @lib/record.ts
        // // GetAllRecordsをexport
        // // supabaseのデータを取得する関数
        const { Record } = jest.requireActual('@/domain/record');
        const validUUID1 = uuidv4();
        const validUUID2 = uuidv4();
        const validUUID3 = uuidv4();
        const validUUID4 = uuidv4();
        jest.mock('@/lib/record.ts', () => {
                return {
                        GetAllRecords: jest
                                .fn()
                                .mockImplementationOnce(() =>
                                        Promise.resolve([
                                                new Record(validUUID1, 'Testtest5', 5),
                                                new Record(validUUID2, 'Testtest10', 10),
                                        ])
                                )
                                .mockImplementationOnce(() =>
                                        Promise.resolve([
                                                new Record(validUUID2, 'Testtest10', 10),
                                                new Record(validUUID3, 'Testtest15', 15),
                                                new Record(validUUID4, 'Testtest20', 20),
                                        ])
                                ),
                };
        });

        jest.mock('@/lib/record_delete.ts', () => {
                return {
                        RecordDelete: jest
                                .fn()
                                .mockImplementationOnce(() =>
                                        Promise.resolve([
                                                // new Record('5', 'Testtest5', 5),
                                                new Record(validUUID1, 'Testtest5', 5),
                                                new Record(validUUID2, 'Testtest10', 10),
                                                new Record(validUUID3, 'Testtest15', 15),
                                                new Record(validUUID4, 'Testtest20', 20),
                                        ])
                                ),
                };
        });

        test('削除ができること', async () => {
                await waitFor(() => {
                        // export async function RecordDelete(id: string): Promise<void>のため、何も返さない（void）プロミスを返す
                        jest
                                .spyOn(recordLibDelete, 'RecordDelete')
                                .mockResolvedValueOnce(Promise.resolve());
                });

                render(
                        <ChakraProvider value={defaultSystem}>
                                <App />
                        </ChakraProvider>
                );

                await waitFor(() => {
                        const dialogTitle = screen.getByText('登録');
                        expect(dialogTitle).toBeInTheDocument();
                });


                await waitFor(() => {
                        const deleteButton = screen.getAllByRole('button', { name: '削除' })[0];
                        fireEvent.click(deleteButton);
                });

                await waitFor(() => {
                        expect(screen.queryByText('Testtest5 5時間')).not.toBeInTheDocument();
                });
        });
});














// // firebase.jsonの分析-----------------------------------------------------
// {
//         "hosting": {
//         // Firebase Hosting にデプロイするディレクトリを指定
//           "public": "dist",
//           "ignore": [
//             "firebase.json",
//         // 先頭がピリオドのファイルはシステムから隠す
//             "**/.*",
//         // サイトの作成に使用されるが、実行はされない依存関係が含まれる
//             "**/node_modules/**"
//           ],
//         //   特定のURLパスを別のパスにリダイレクトするために使用される
//           "rewrites": [
//             {
//         // リダイレクトの対象となるURLパターンを指定する
//         // "**"はワイルドカードで、すべてのURLパスにマッチ
//               "source": "**",
//         // SPAでは、すべてのURLリクエストを/index.htmlにリダイレクトすることで、クライアントサイドのルーティングが正しく機能する
//               "destination": "/index.html"
//             }
//           ]
//         }
// }
