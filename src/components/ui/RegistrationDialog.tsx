/** @jsxImportSource @emotion/react */
import React, { useEffect, ReactNode } from 'react';
import { Dispatch, SetStateAction } from 'react';
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
} from '@/components/ui/dialog';

import {
  Box,
  Button,
  Heading,
  Table,
  Input,
  Stack,
  NumberInputLabel,
  Text,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { Record } from '@/domain/record';
import supabase from '@/utils/supabase';
import { css } from '@emotion/react';
import { GetAllRecords } from '@/lib/record';

interface RegistrationDialogProps {
  item?: Record;
  button?: string;
  // Dispatch<SetStateAction<Record[]>>型は、ReactのuseStateフックによって提供される状態更新関数の型。状態を更新するための関数を表す
  // ?を使ったオプショナルだとダメ
  setData: Dispatch<SetStateAction<Record[]>>;
  // どの書き方でもOK  // fetchData: () => Promise<void>;  // fetchData: () => ReactNode;
  fetchData: () => void;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({
  // const RegistrationDialog = ({ fetchData }:RegistrationDialogProps) => { // この書き方でもOK
  item,
  button,
  setData,
  fetchData,
}) => {
  interface FormValues {
    studyId: string;
    studyContent: string;
    studyHour: number | null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<FormValues>();

  useEffect(() => {
    if (item) {
      setValue('studyId', item.id);
      setValue('studyContent', item.title);
      setValue('studyHour', item.time);
    }
  }, [item, setValue]);

  const addTodo = async (title: string, time: number) => {
    const newRecord = new Record('', title, time);
    // データベース操作が成功した場合、dataオブジェクトに操作の結果が含まれる  // const { data, error } = await supabase
    const { error } = await supabase
      .from('study-record')
      .insert([{ title: newRecord.title, time: newRecord.time }])
      .select();
    if (error) {
      throw error;
    }
    fetchData();
  };

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
      return studyContent && studyHour;
    }
    // onSubmitに対してreturn文は必要ない
    await addTodo(studyContent, studyHour);
    reset({
      studyContent: '',
      studyHour: null,
    });
  };

  const updateRecord = async (id: string, title: string, time: number) => {
    // Supabaseを使用してレコードを更新する処理
    const { error } = await supabase
      .from('study-record')
      .update({ title, time })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    const todoRecord = await GetAllRecords();
    setData(todoRecord);
    // ローカルの状態を更新する処理
    // setData((prevRecords) => {
    //         const updatedRecords = prevRecords.map((record) =>
    //                 record.id === id ? { ...record, title, time } : record
    //         );
    //         console.log('Updated Records:', updatedRecords);

    //         return updatedRecords;
    // });

    fetchData();
  };

  const onSubmitModify: SubmitHandler<FormValues> = async (data) => {
    const studyId = data.studyId;
    const studyContent = data.studyContent;
    const studyHour = data.studyHour;

    if (studyHour === null || isNaN(studyHour)) {
      return;
    }

    // 既存のレコードを修正する処理
    await updateRecord(studyId, studyContent, studyHour);

    reset({
      studyContent: '',
      studyHour: null,
    });
  };

  // 監視用のwatchを定義
  const studyContent = watch('studyContent', '');
  const studyHour = watch('studyHour', null);

  if (button === 'registration') {
    return (
      <DialogRoot placement={'center'}>
        <DialogTrigger asChild>
          <Button
            css={css`
              background-color: deepskyblue; /* 明るい青色に変更 */
              border-width: 1px;
              border-color: black;
              color: white;
              cursor: pointer;
              padding: 6px 10px; /* ボタンを小さくするためにパディングを調整 */
              font-size: 18px; /* フォントサイズを小さくする */
              &:hover {
                background-color: darkslategray;
              }
            `}
            data-testid="registration"
          >
            登録
          </Button>
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
                <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
                  <Stack gap="4" align="flex-start" maxW="sm">
                    <div style={{ width: '100%' }}>
                      <label htmlFor="studyContent" css={css``}>
                        学習内容
                      </label>
                      <Input
                        id="studyContent"
                        type="text"
                        width="100%"
                        {...register('studyContent', {
                          required: '内容の入力は必須です',
                        })}
                      />
                      {errors['studyContent'] && (
                        <Text color="red.500">
                          {errors['studyContent'].message}
                        </Text>
                      )}
                    </div>

                    <div>
                      <label htmlFor="studyHour" css={css``}>
                        学習時間
                      </label>
                      <Input
                        id="studyHour"
                        type="number"
                        // width="60%"
                        {...register('studyHour', {
                          required: '時間の入力は必須です',
                          min: {
                            value: 0,
                            message: '時間は0以上である必要があります',
                          },
                        })}
                      />
                      {errors['studyHour'] && (
                        <Text color="red.500">
                          {errors['studyHour'].message}
                        </Text>
                      )}
                    </div>

                    <div>
                      {studyContent && studyHour && studyHour >= 0 ? (
                        <DialogActionTrigger asChild>
                          <Button
                            type="submit"
                            data-testid="submit"
                            mr={4}
                            css={css`
                              background-color: deepskyblue; /* 明るい青色に変更 */
                              border-width: 1px;
                              border-color: black;
                              color: white;
                              cursor: pointer;
                              padding: 6px 10px; /* ボタンを小さくするためにパディングを調整 */
                              /* font-size: 12px;フォントサイズを小さくする */
                              width: 80px;
                              &:hover {
                                background-color: darkslategray;
                              }
                            `}
                          >
                            保存
                          </Button>
                        </DialogActionTrigger>
                      ) : (
                        <Button
                          type="submit"
                          data-testid="submit-failure"
                          mr={4}
                          css={css`
                            background-color: deepskyblue; /* 明るい青色に変更 */
                            border-width: 1px;
                            border-color: black;
                            color: white;
                            cursor: pointer;
                            padding: 6px 10px; /* ボタンを小さくするためにパディングを調整 */
                            /* font-size: 12px; フォントサイズを小さくする */
                            width: 80px;
                            &:hover {
                              background-color: darkslategray;
                            }
                          `}
                        >
                          保存
                        </Button>
                      )}

                      <DialogActionTrigger asChild>
                        <Button
                          css={css`
                            background-color: red;
                            border-width: 1px;
                            border-color: black;
                            color: white;
                            cursor: pointer;
                            padding: 6px 10px; /* ボタンを小さくするためにパディングを調整 */
                            font-size: 12px; /* フォントサイズを小さくする */
                            width: 80px;
                            &:hover {
                              background-color: darkred;
                            }
                          `}
                          onClick={onClickCancelRecord}
                        >
                          キャンセル
                        </Button>
                      </DialogActionTrigger>
                    </div>
                  </Stack>
                </Box>
              </form>
            </div>
          </DialogBody>
          <DialogCloseTrigger onClick={onClickCancelRecord} />
        </DialogContent>
      </DialogRoot>
    );
  } else if (button === 'modifcation') {
    return (
      <DialogRoot placement={'center'}>
        <DialogTrigger asChild>
          <Button
            css={css`
              background-color: limegreen;
              border-width: 1px;
              border-color: black;
              color: white;
              cursor: pointer;
              padding: 6px 10px; /* ボタンを小さくするためにパディングを調整 */
              font-size: 18px; /* フォントサイズを小さくする */
              &:hover {
                background-color: darkgreen;
              }
            `}
            data-testid="modify-registration"
          >
            編集
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>記録編集</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <div>
              {/* 最初の onSubmit: フォーム送信時に実行されるイベントハンドラ
                                        handleSubmit は、React Hook Form の関数で、フォームの送信を処理するために使用される
                                        二番目の onSubmit: バリデーション成功後にデータを処理するユーザー定義関数 */}
              <form onSubmit={handleSubmit(onSubmitModify)}>
                <Box p={4} borderWidth={1} borderRadius="lg" boxShadow="lg">
                  <Stack gap="4" align="flex-start" maxW="sm">
                    <div style={{ width: '100%' }}>
                      <label htmlFor="studyContent" css={css``}>
                        学習内容
                      </label>
                      <Input
                        id="studyContent"
                        type="text"
                        width="100%"
                        {...register('studyContent', {
                          required: '内容の入力は必須です',
                        })}
                      />
                      {errors['studyContent'] && (
                        <Text color="red.500">
                          {errors['studyContent'].message}
                        </Text>
                      )}
                    </div>

                    <div>
                      <label htmlFor="studyHour" css={css``}>
                        学習時間
                      </label>
                      <Input
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
                        <Text color="red.500">
                          {errors['studyHour'].message}
                        </Text>
                      )}
                    </div>

                    <div>
                      {studyContent && studyHour && studyHour >= 0 ? (
                        <DialogActionTrigger asChild>
                          <Button
                            type="submit"
                            data-testid="submit"
                            mr={4}
                            css={css`
                              background-color: deepskyblue; /* 明るい青色に変更 */
                              border-width: 1px;
                              border-color: black;
                              color: white;
                              cursor: pointer;
                              padding: 6px 10px; /* ボタンを小さくするためにパディングを調整 */
                              /* font-size: 12px;フォントサイズを小さくする */
                              width: 80px;
                              &:hover {
                                background-color: darkslategray;
                              }
                            `}
                          >
                            保存
                          </Button>
                        </DialogActionTrigger>
                      ) : (
                        <Button
                          type="submit"
                          data-testid="submit-failure"
                          mr={4}
                          css={css`
                            background-color: deepskyblue; /* 明るい青色に変更 */
                            border-width: 1px;
                            border-color: black;
                            color: white;
                            cursor: pointer;
                            padding: 6px 10px; /* ボタンを小さくするためにパディングを調整 */
                            /* font-size: 12px; フォントサイズを小さくする */
                            width: 80px;
                            &:hover {
                              background-color: darkslategray;
                            }
                          `}
                        >
                          保存
                        </Button>
                      )}

                      <DialogActionTrigger asChild>
                        <Button
                          css={css`
                            background-color: firebrick;
                            border-width: 1px;
                            border-color: black;
                            color: white;
                            cursor: pointer;
                            padding: 6px 10px; /* ボタンを小さくするためにパディングを調整 */
                            font-size: 12px; /* フォントサイズを小さくする */
                            width: 80px;
                            &:hover {
                              background-color: darkred;
                            }
                          `}
                          onClick={onClickCancelRecord}
                        >
                          キャンセル
                        </Button>
                      </DialogActionTrigger>
                    </div>
                  </Stack>
                </Box>
              </form>
            </div>
          </DialogBody>
          <DialogCloseTrigger onClick={onClickCancelRecord} />
        </DialogContent>
      </DialogRoot>
    );
  }
};

export default RegistrationDialog;
