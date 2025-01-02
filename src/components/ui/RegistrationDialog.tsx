import React, { ReactNode } from 'react';
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
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { Record } from '@/domain/record';
import supabase from '@/utils/supabase';

interface RegistrationDialogProps {
  // どの書き方でもOK
  // fetchData: () => Promise<void>;
  // fetchData: () => ReactNode;
  fetchData: () => void;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({
  fetchData,
}) => {
  // この書き方でもOK
  // const RegistrationDialog = ({ fetchData }:RegistrationDialogProps) => {
  interface FormValues {
    studyContent: string;
    studyHour: number | null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>();

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
  // 監視用のwatchを定義
  const studyContent = watch('studyContent', '');
  const studyHour = watch('studyHour', null);

  return (
    <DialogRoot placement={'center'}>
      <DialogTrigger asChild>
        <Button colorScheme="teal" data-testid="registration" mb={4}>
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
                {errors['studyHour'] && <p>{errors['studyHour'].message}</p>}
              </div>

              <div>
                {studyContent && studyHour && studyHour >= 0 ? (
                  <DialogActionTrigger asChild>
                    <button type="submit" data-testid="submit">
                      保存
                    </button>
                  </DialogActionTrigger>
                ) : (
                  <button type="submit" data-testid="submit-failure">
                    保存
                  </button>
                )}

                <DialogActionTrigger asChild>
                  <Button color="red" onClick={onClickCancelRecord}>
                    キャンセル
                  </Button>
                </DialogActionTrigger>
              </div>
            </form>
          </div>
        </DialogBody>
        <DialogCloseTrigger onClick={onClickCancelRecord} />
      </DialogContent>
    </DialogRoot>
  );
};

export default RegistrationDialog;
