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

import * as recordLib from '@/lib/record.ts';
import * as recordLibDelete from '@/lib/record_delete.ts';

describe('mockを使ったテスト', () => {
  // // @lib/record.ts
  // // GetAllRecordsをexport
  // // supabaseのデータを取得する関数
  // jest.mock('@/lib/record.ts', () => {
  //   const { Record } = jest.requireActual('@/domain/record');
  //   console.log('record.ts--------のテストのモック通過');
  //   return {
  //     GetAllRecords: jest
  //       .fn()
  //       .mockImplementationOnce(() =>
  //         Promise.resolve([
  //           new Record('5', 'Testtest5', 5),
  //           new Record('10', 'Testtest10', 10),
  //         ])
  //       )
  //       .mockImplementationOnce(() =>
  //         Promise.resolve([
  //         //   new Record('5', 'Testtest5', 5),
  //           new Record('10', 'Testtest10', 10),
  //           new Record('15', 'Testtest15', 15),
  //           new Record('20', 'Testtest20', 20),
  //         ])
  //       ),
  //   };
  // });

  // jest.mock('@/lib/record_delete.ts', () => {
  //         const { Record } = jest.requireActual('@/domain/record');
  //   console.log('record_delete.ts--------のテストのモック通過');
  //   return {
  //         RecordDelete:  jest
  //     .fn()
  //     .mockImplementationOnce(() =>
  //       Promise.resolve([
  //         // new Record('5', 'Testtest5', 5),
  //         new Record('10', 'Testtest10', 10),
  //         new Record('15', 'Testtest15', 15),
  //         new Record('20', 'Testtest20', 20),
  //       ])
  //     ),
  //   };
  // });

  // spyOnの場合、jest.mockは不要(あっても良い)
  jest.mock('@/lib/record.ts');
  jest.mock('@/lib/record_delete.ts');

  test('削除ができること', async () => {
    const { Record } = jest.requireActual('@/domain/record');
    await waitFor(() => {
      jest
        .spyOn(recordLib, 'GetAllRecords')
        .mockResolvedValueOnce([
          new Record('5', 'Testtest5', 5),
          new Record('10', 'Testtest10', 10),
        ])
        .mockResolvedValueOnce([
          new Record('10', 'Testtest10', 10),
          new Record('11', 'Testtest11', 11),
          new Record('12', 'Testtest12', 12),
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
    });

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

    // screen.debug();
    await waitFor(() => {
      const dialogTitle = screen.getByText('登録');
      expect(dialogTitle).toBeInTheDocument();
    });
    //     screen.debug();

    const deleteButton = await waitFor(() =>
      screen.getByTestId('delete-button-5')
    );
    // console.log("deleteButton", deleteButton)

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
  it('isLoadingがfalseの場合、データテーブルを表示する', async () => {
    const { Record } = jest.requireActual('@/domain/record');
    await waitFor(() => {
      jest
        .spyOn(recordLib, 'GetAllRecords')
        .mockResolvedValueOnce([
          new Record('5', 'Testtest5', 5),
          new Record('10', 'Testtest10', 10),
        ])
        .mockResolvedValueOnce([
          new Record('10', 'Testtest10', 10),
          new Record('11', 'Testtest11', 11),
          new Record('12', 'Testtest12', 12),
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
});


// // firebase.jsonの分析
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

