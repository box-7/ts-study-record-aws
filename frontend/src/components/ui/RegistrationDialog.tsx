/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { Dispatch, SetStateAction } from 'react';
import {
        // DialogActionTrigger,
        DialogBody,
        DialogCloseTrigger,
        DialogContent,
        // DialogFooter,
        DialogHeader,
        DialogRoot,
        DialogTitle,
        DialogTrigger,
} from '@/components/ui/dialog';

// import {
//         Box,
//         Button,
//         Heading,
//         Table,
//         Input,
//         Stack,
//         NumberInputLabel,
//         Text,
// } from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';

import { Record } from '@/domain/record';
import supabase from '@/utils/supabase';
// import { css } from '@emotion/react';
import { GetAllRecords } from '@/lib/record';
import { addTodo as addTodoApi } from "../../lib/record";
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
                // watch,
                setValue,
        } = useForm<FormValues>();

        useEffect(() => {
                if (item) {
                        setValue('studyId', item.id);
                        setValue('studyContent', item.title);
                        setValue('studyHour', item.time);
                }
        }, [item, setValue]);

        // フォーム送信時に呼ぶ関数
        const addTodo = async (title: string, time: number) => {
                try {
                        // record.ts の addTodo を呼び出す
                        await addTodoApi(title, time);

                        // データを再取得してUI更新
                        fetchData();
                } catch (error) {
                        if (error instanceof Error) {
                                console.error("レコード追加エラー:", error.message);
                                alert("レコードの追加に失敗しました");
                        } else {
                                console.error("Unknown error");
                                alert("レコードの追加に失敗しました");
                        }
                }
        };

        const onClickCancelRecord = () => {
                reset({
                        studyContent: '',
                        studyHour: null,
                });
        };

        const onSubmit: SubmitHandler<FormValues> = async (data) => {
                const studyContent = data.studyContent;
                // const studyHour = data.studyHour;
                 const studyHour = Number(data.studyHour); // number に変換
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
        // const studyContent = watch('studyContent', '');
        // const studyHour = watch('studyHour', null);


        if (button === 'registration') {
                return (
                        <DialogRoot placement="center">
                                <DialogTrigger asChild>
                                        <button
                                                data-testid="registration"
                                                className="bg-sky-500 text-white border border-black px-2 py-1 text-sm cursor-pointer hover:bg-slate-800 transition-colors rounded"
                                        >
                                                登録
                                        </button>
                                </DialogTrigger>
                                <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
                                        <DialogHeader>
                                                <DialogTitle className="text-xl font-bold">新規登録</DialogTitle>
                                        </DialogHeader>

                                        <DialogBody>
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                        <div className="p-4 border border-gray-300 rounded-lg shadow-lg max-w-sm space-y-4">
                                                                <div className="w-full">
                                                                        <label htmlFor="studyContent" className="block mb-1 font-medium">
                                                                                学習内容
                                                                        </label>
                                                                        <input
                                                                                id="studyContent"
                                                                                type="text"
                                                                                className="w-full border border-gray-400 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-sky-300"
                                                                                {...register('studyContent', { required: '内容の入力は必須です' })}
                                                                        />
                                                                        {errors.studyContent && (
                                                                                <p className="text-red-500 text-sm mt-1">{errors.studyContent.message}</p>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label htmlFor="studyHour" className="block mb-1 font-medium">
                                                                                学習時間
                                                                        </label>
                                                                        <input
                                                                                id="studyHour"
                                                                                type="number"
                                                                                className="w-full border border-gray-400 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-sky-300"
                                                                                {...register('studyHour', {
                                                                                        required: '時間の入力は必須です',
                                                                                        min: { value: 0, message: '時間は0以上である必要があります' },
                                                                                })}
                                                                        />
                                                                        {errors.studyHour && (
                                                                                <p className="text-red-500 text-sm mt-1">{errors.studyHour.message}</p>
                                                                        )}
                                                                </div>

                                                                <div className="flex space-x-2">
                                                                        <button
                                                                                type="submit"
                                                                                data-testid="submit"
                                                                                className="bg-sky-500 text-white border border-black px-3 py-1.5 w-20 hover:bg-slate-800 transition-colors rounded"
                                                                        >
                                                                                保存
                                                                        </button>

                                                                        <button
                                                                                type="button"
                                                                                onClick={onClickCancelRecord}
                                                                                className="bg-red-500 text-white border border-black px-3 py-1.5 w-20 hover:bg-red-800 transition-colors rounded"
                                                                        >
                                                                                キャンセル
                                                                        </button>
                                                                </div>
                                                        </div>
                                                </form>
                                        </DialogBody>

                                        <DialogCloseTrigger onClick={onClickCancelRecord} />
                                </DialogContent>
                        </DialogRoot>
                );
        } else if (button === 'modifcation') {
                return (
                        <DialogRoot placement="center">
                                <DialogTrigger asChild>
                                        <button
                                                data-testid="modify-registration"
                                                className="bg-lime-500 text-white border border-black px-3 py-1.5 text-lg cursor-pointer hover:bg-green-800 transition-colors rounded"
                                        >
                                                編集
                                        </button>
                                </DialogTrigger>

                                <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
                                        <DialogHeader>
                                                <DialogTitle className="text-xl font-bold">記録編集</DialogTitle>
                                        </DialogHeader>

                                        <DialogBody>
                                                <form onSubmit={handleSubmit(onSubmitModify)}>
                                                        <div className="p-4 border border-gray-300 rounded-lg shadow-lg max-w-sm space-y-4">
                                                                <div className="w-full">
                                                                        <label htmlFor="studyContentModify" className="block mb-1 font-medium">
                                                                                学習内容
                                                                        </label>
                                                                        <input
                                                                                id="studyContentModify"
                                                                                type="text"
                                                                                className="w-full border border-gray-400 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-lime-300"
                                                                                {...register('studyContent', { required: '内容の入力は必須です' })}
                                                                        />
                                                                        {errors.studyContent && (
                                                                                <p className="text-red-500 text-sm mt-1">{errors.studyContent.message}</p>
                                                                        )}
                                                                </div>

                                                                <div>
                                                                        <label htmlFor="studyHourModify" className="block mb-1 font-medium">
                                                                                学習時間
                                                                        </label>
                                                                        <input
                                                                                id="studyHourModify"
                                                                                type="number"
                                                                                className="w-full border border-gray-400 rounded px-2 py-1 focus:outline-none focus:ring focus:ring-lime-300"
                                                                                {...register('studyHour', {
                                                                                        required: '時間の入力は必須です',
                                                                                        min: { value: 0, message: '時間は0以上である必要があります' },
                                                                                })}
                                                                        />
                                                                        {errors.studyHour && (
                                                                                <p className="text-red-500 text-sm mt-1">{errors.studyHour.message}</p>
                                                                        )}
                                                                </div>

                                                                <div className="flex space-x-2">
                                                                        <button
                                                                                type="submit"
                                                                                data-testid="submit-modify"
                                                                                className="bg-sky-500 text-white border border-black px-3 py-1.5 w-20 hover:bg-slate-800 transition-colors rounded"
                                                                        >
                                                                                保存
                                                                        </button>

                                                                        <button
                                                                                type="button"
                                                                                onClick={onClickCancelRecord}
                                                                                className="bg-red-500 text-white border border-black px-3 py-1.5 w-20 hover:bg-red-800 transition-colors rounded"
                                                                        >
                                                                                キャンセル
                                                                        </button>
                                                                </div>
                                                        </div>
                                                </form>
                                        </DialogBody>

                                        <DialogCloseTrigger onClick={onClickCancelRecord} />
                                </DialogContent>
                        </DialogRoot>
                );
        }


};

export default RegistrationDialog;
