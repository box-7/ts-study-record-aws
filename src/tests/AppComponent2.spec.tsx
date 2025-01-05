// AppComponet.spec.tsxで1つのファイルで複数のmockテストできたので、こちらは不要

// import React from 'react';
// import {
//   render,
//   screen,
//   waitFor,
//   act,
//   fireEvent,
// } from '@testing-library/react';
// import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
// import App from '../App';
// import userEvent from '@testing-library/user-event';
// import supabase from '@/utils/supabase';

// import * as recordLib from '@/lib/record.ts';
// import * as recordLibDelete from '@/lib/record_delete.ts';
// import { v4 as uuidv4 } from 'uuid';

// describe('mockを使ったテスト', () => {
//   it('編集して登録すると更新される', async () => {
//     const { Record } = jest.requireActual('@/domain/record');
//     const validUUID1 = uuidv4();
//     const validUUID2 = uuidv4();
//     console.log('validUUID1', validUUID1);
//     // console.log('validUUID2', validUUID2);
//     // await waitFor(() => {
//     jest
//       .spyOn(recordLib, 'GetAllRecords')
//       .mockResolvedValueOnce([
//         new Record(validUUID1, 'Testtest5', 5),
//         new Record(validUUID2, 'Testtest10', 10),
//       ])
//       .mockResolvedValueOnce([
//         new Record(validUUID1, 'English', 8),
//         new Record(validUUID2, 'Testtest10', 10),
//       ]);
//     // });
//     render(
//       <ChakraProvider value={defaultSystem}>
//         <App />
//       </ChakraProvider>
//     );

//     await waitFor(() => {
//       expect(screen.getByText('学習記録一覧')).toBeInTheDocument();
//     });

//     const editButton = screen.getAllByRole('button', { name: '編集' })[0];
//     fireEvent.click(editButton);

//     await waitFor(() => {
//       expect(screen.getByText('記録編集')).toBeInTheDocument();
//     });

//     const studyContentInput = screen.getByLabelText(
//       '学習内容'
//     ) as HTMLInputElement;
//     const studyHourInput = screen.getByLabelText(
//       '学習時間'
//     ) as HTMLInputElement;
//     await userEvent.clear(studyContentInput);
//     await userEvent.type(studyContentInput, 'English');
//     await userEvent.clear(studyHourInput);
//     await userEvent.type(studyHourInput, '8');

//     // 入力フィールドの値を確認
//     expect(studyContentInput.value).toBe('English');
//     expect(studyHourInput.value).toBe('8');

//     // Saveボタンが有効になるのを待つ // 新規登録と同じtestIdを使うと、エラーになる
//     const submitButton = await waitFor(() =>
//       screen.getByTestId('submit-modify')
//     );
//     expect(submitButton).not.toBeDisabled();

//     await waitFor(() => {
//       userEvent.click(submitButton);
//       // fireEvent.click(submitButton);
//     });
//     // screen.debug();
//     await waitFor(() => {
//       // screen.debug(); // この位置だとログがおかしくなる
//       const studyContentHour = screen.getAllByRole('row').find(
//         (element) =>
//           // console.log('element', element)
//           element.textContent && element.textContent.includes('English 8時間')
//       );
//       expect(studyContentHour).toBeInTheDocument();
//     });
//   });
// });
