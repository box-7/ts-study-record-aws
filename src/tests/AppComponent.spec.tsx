import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
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
                expect(screen.getByText('学習記録一覧!')).toBeInTheDocument();
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

it('isLoadingがfalseの場合、データテーブルを表示する', async () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );
        // 非同期処理が完了するまで待機
        await waitFor(() => {
                // テーブルが表示されているか確認
                expect(screen.getByRole('table')).toBeInTheDocument();
        });
});

test('登録できること', async () => {
        render(
                <ChakraProvider value={defaultSystem}>
                        <App />
                </ChakraProvider>
        );

        const registerButton = await waitFor(() => screen.getByTestId('registration'));
        await userEvent.click(registerButton);

        // ダイアログが表示されるのを待つ
        await waitFor(() => {
                const dialogTitle = screen.getByText('新規登録');
                expect(dialogTitle).toBeInTheDocument();
        });

        // 入力フィールドに値を入力
        const studyContentInput = screen.getByLabelText('学習内容') as HTMLInputElement;
        const studyHourInput = screen.getByLabelText('学習時間') as HTMLInputElement;
        await userEvent.type(studyContentInput, 'Math');
        await userEvent.type(studyHourInput, '2');

        // await waitFor(() => {
        //         // 入力フィールドの値をアサート
        //         expect(studyContentInput).toHaveValue('Math');
        //         expect(studyHourInput).toHaveValue(2);
        // });
        // // 現在のDOMの状態を出力してデバッグ
        // screen.debug();

        // Saveボタンが有効になるのを待つ
        const submitButton = await waitFor(() => screen.getByTestId('submit'));
        expect(submitButton).not.toBeDisabled();

        await userEvent.click(submitButton);

        // 結果が表示されるのを待つ
        await waitFor(() => {
                const studyContentHour = screen.getAllByTestId('study-content-hour').find(element =>
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
        const registerButton = await waitFor(() => screen.getByTestId('registration'));
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

        const registerButton = await waitFor(() => screen.getByTestId('registration'));
        await userEvent.click(registerButton);

        // ダイアログが表示されるのを待つ
        await waitFor(() => {
                const dialogTitle = screen.getByText('新規登録');
                expect(dialogTitle).toBeInTheDocument();
        });

        // Saveボタンが有効になるのを待つ
        const submitButton = await waitFor(() => screen.getByTestId('submit-failure'));
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

        const registerButton = await waitFor(() => screen.getByTestId('registration'));
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
        const submitButton = await waitFor(() => screen.getByTestId('submit-failure'));
        expect(submitButton).not.toBeDisabled();
        await userEvent.click(submitButton);

        // 結果が表示されるのを待つ
        await waitFor(() => {
                const studyContentError = screen.getByText('内容の入力は必須です');
                const studyHourError = screen.getByText('時間は0以上である必要があります');
                expect(studyContentError && studyHourError).toBeInTheDocument();
        });
});




// import { Record } from '@/domain/record';
// const mockGetRecords = jest
//         .fn()
//         .mockResolvedValue([
//                 new Record('1', 'Testtest', 3),
//                 new Record('2', 'Testtest2', 4),
//                 // {id:"1", title:"title1", time: 3},
//         ])

// @lib/record.ts
// GetAllRecordsをexport
// supabaseのデータを取得する関数
const mockData = jest.mock('@/lib/record.ts', () => {
        // const originalModule = jest.requireActual('@/utils/supabase');
        // domainレコードは、classをexportしている
        const { Record } = jest.requireActual('@/domain/record');
        return {
                GetAllRecords: jest.fn().mockResolvedValue([
                        new Record('5', 'Testtest1', 5),
                ])
        };
});



// describe('テスト', () => {


//         test('削除ができること', async () => {
//                 render(
//                         <ChakraProvider value={defaultSystem}>
//                                 <App />
//                         </ChakraProvider>
//                 );

//                 await waitFor(() => {
//                         const dialogTitle = screen.getByText('登録');
//                         expect(dialogTitle).toBeInTheDocument();
//                 });
//                 screen.debug();

//                 const deleteButton = await waitFor(() => screen.getByTestId('delete-button-5'));
//                 // await act(async () => {
//                 await waitFor(() => {
//                         // const deleteButton = screen.getByTestId('delete-button-5');
//                         console.log("deleteButton",deleteButton)
//                         console.log("Before click");
//                         userEvent.click(deleteButton);
//                         console.log("After click");
//                 });
//                 // });
//                 screen.debug();
//                 await waitFor(() => {
//                         expect(screen.queryByText('Testtest1 5時間')).not.toBeInTheDocument();
//                 });

//         });
// });



// jest.mock('@/utils/supabase', () => {
//         // const originalModule = jest.requireActual('@/utils/supabase');
//         return {
//                 // __esModule: true,
//                 // ...originalModule,
//                 default: {
//                         from: jest.fn(() => ({
//                                 select: jest.fn().mockResolvedValue({ data: mockData, error: null }),
//                 //                 insert: jest.fn().mockResolvedValue({ error: null }),
//    // deleteをモックしないようにコメントアウト。
//    // コメントアウトしなくても変わらず。
//                                 delete:  jest.fn().mockReturnValue({
//                                         eq: jest.fn().mockResolvedValue({ error: null })
//                                 })
//                         }))
//                 }
//         }
// }
//         );


                //このコードは通常のデータをとってきてしまう
                // const testdata = await supabase.from('study-record').select('*');
                // console.log("testdata", testdata);


// describe('テスト', () => {

//         test('削除ができること', async () => {
//                 render(
//                         <ChakraProvider value={defaultSystem}>
//                                 <App />
//                         </ChakraProvider>
//                 );
//                 screen.debug();
//                 await waitFor(() => {
//                         const dialogTitle = screen.getByText('登録');
//                         expect(dialogTitle).toBeInTheDocument();
//                 });

//                 await supabase.from('study-record').select('*');
//                 // console.log("supabase", supabase.from('study-record').select('*'));
//                 expect(screen.getByText(/Testtest\s*3\s*時間/)).toBeInTheDocument();

//                 const deleteButtons = await waitFor(() => screen.getByTestId('delete-button'));
//                 // console.log(deleteButtons[0]);
//                 await act(async () => {
//                         // await waitFor(() => {
//                         userEvent.click(deleteButtons);
//                 });
//                 // });
//                 // await supabase.from('study-record').delete().eq('id', 1);
//                 // await waitFor(() => {
//                 //         supabase.from('study-record').delete().eq('id', mockData[0].id);
//                 // });

//                 screen.debug();
//         });
// });




