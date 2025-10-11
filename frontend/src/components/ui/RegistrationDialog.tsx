/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Dispatch, SetStateAction } from 'react';
import {
        DialogBody,
        // DialogCloseTrigger,
        DialogContent,
        DialogHeader,
        DialogRoot,
        DialogTitle,
        DialogTrigger,
} from '@/components/ui/dialog';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Record } from '@shared/record.ts';
import { UpdateRecord, GetAllRecords, CreateRecord as addTodoApi } from "@/lib/recordApi";
// import { CreateRecord as addTodoApi } from "@/lib/record.ts";

interface RegistrationDialogProps {
        item?: Record;
        button?: string;
        setData: Dispatch<SetStateAction<Record[]>>;
        fetchData: () => void;
}

interface FormValues {
        studyId: string;
        studyContent: string;
        studyHour: number | null;
}

const RegistrationDialog: React.FC<RegistrationDialogProps> = ({
        item,
        button,
        setData,
        fetchData,
}) => {
        const [isOpen, setIsOpen] = useState(false);
        const isRegistration = button === 'registration';

        // react-hook-form は、Reactでフォームを簡単・効率的に扱うためのライブラリ
        // useForm というフックを使って、フォームの状態管理やバリデーションを行う
        const {
                register,         // input要素をフォーム管理に登録
                handleSubmit,     // 送信時のバリデーションとデータ取得
                formState: { errors }, // バリデーションエラー情報
                reset,            // フォーム値のリセット
                setValue,         // フォーム値の手動セット
        } = useForm<FormValues>();

        useEffect(() => {
                if (item) {
                        setValue('studyId', item.id);
                        setValue('studyContent', item.title);
                        setValue('studyHour', item.time);
                }
        }, [item, setValue]);

        useEffect(() => {
                if (isOpen && item) {
                        reset({
                                studyId: item.id,
                                studyContent: item.title,
                                studyHour: item.time,
                        });
                }
        }, [isOpen, item, reset]);

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
                setIsOpen(false); // モーダルを閉じる
        };

        const updateRecord = async (id: string, title: string, time: number) => {
                try {
                        // backend の PUT /records/:id を呼び出す
                        await UpdateRecord(id, title, time);

                        // 更新後に全データを再取得
                        const todoRecord = await GetAllRecords();
                        setData(todoRecord);
                        fetchData();
                } catch (error) {
                        if (error instanceof Error) {
                                alert(error.message);
                        } else {
                                alert("An unknown error occurred");
                        }
                }
        };

        // dataには以下が入っている
        // setValue('studyId', item.id);
        // setValue('studyContent', item.title);
        // setValue('studyHour', item.time);
        const onSubmitModify: SubmitHandler<FormValues> = async (data) => {
                // const studyId = data.studyId;
                const studyId = String(data.studyId); // string に変換
                const studyContent = data.studyContent;
                const studyHour = Number(data.studyHour); // number に変換
                if (studyHour === null || isNaN(studyHour)) {
                        return;
                }
                // 既存のレコードを修正する処理
                await updateRecord(studyId, studyContent, studyHour);
                reset({
                        studyContent: '',
                        studyHour: null,
                });
                setIsOpen(false); // モーダルを閉じる
        };

        return (
                <DialogRoot
                        placement="center"
                        open={isOpen}
                        onOpenChange={(details) => setIsOpen(details.open)}
                >
                        <DialogTrigger asChild>
                                <button
                                        data-testid={isRegistration ? "registration" : "modify-registration"}
                                        className={
                                                isRegistration
                                                        ? "bg-sky-500 text-white border border-black px-2 py-1 text-sm cursor-pointer hover:bg-slate-800 transition-colors rounded"
                                                        : "bg-lime-500 text-white border border-black px-3 py-1.5 text-lg cursor-pointer hover:bg-green-800 transition-colors rounded"
                                        }
                                >
                                        {isRegistration ? "登録" : "編集"}
                                </button>
                        </DialogTrigger>
                        <DialogContent className="bg-white p-6 rounded-lg shadow-lg">
                                <DialogHeader>
                                        <DialogTitle className="text-xl font-bold">
                                                {isRegistration ? "新規登録" : "記録編集"}
                                        </DialogTitle>
                                </DialogHeader>

                                <DialogBody>
                                        <form onSubmit={handleSubmit(isRegistration ? onSubmit : onSubmitModify)}>
                                                <div className="p-4 border border-gray-300 rounded-lg shadow-lg max-w-sm space-y-4">
                                                        <div className="w-full">
                                                                <label
                                                                        htmlFor={isRegistration ? "studyContent" : "studyContentModify"}
                                                                        className="block mb-1 font-medium"
                                                                >
                                                                        学習内容
                                                                </label>
                                                                <input
                                                                        id={isRegistration ? "studyContent" : "studyContentModify"}
                                                                        type="text"
                                                                        className={
                                                                                "w-full border border-gray-400 rounded px-2 py-1 focus:outline-none focus:ring " +
                                                                                (isRegistration ? "focus:ring-sky-300" : "focus:ring-lime-300")
                                                                        }
                                                                        {...register('studyContent', { required: '内容の入力は必須です' })}
                                                                />
                                                                {errors.studyContent && (
                                                                        <p className="text-red-500 text-sm mt-1">{errors.studyContent.message}</p>
                                                                )}
                                                        </div>
                                                        <div>
                                                                <label
                                                                        htmlFor={isRegistration ? "studyHour" : "studyHourModify"}
                                                                        className="block mb-1 font-medium"
                                                                >
                                                                        学習時間
                                                                </label>
                                                                <input
                                                                        id={isRegistration ? "studyHour" : "studyHourModify"}
                                                                        type="number"
                                                                        className={
                                                                                "w-full border border-gray-400 rounded px-2 py-1 focus:outline-none focus:ring " +
                                                                                (isRegistration ? "focus:ring-sky-300" : "focus:ring-lime-300")
                                                                        }
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
                                                                        data-testid={isRegistration ? "submit" : "submit-modify"}
                                                                        className="bg-sky-500 text-white border border-black px-3 py-1.5 w-20 hover:bg-slate-800 transition-colors rounded"
                                                                >
                                                                        保存
                                                                </button>
                                                                <button
                                                                        type="button"
                                                                        onClick={() => {
                                                                                onClickCancelRecord();
                                                                                setIsOpen(false);
                                                                        }}
                                                                        className="bg-red-500 text-white border border-black px-3 py-1.5 w-20 hover:bg-red-800 transition-colors rounded"
                                                                >
                                                                        キャンセル
                                                                </button>
                                                        </div>
                                                </div>
                                        </form>
                                </DialogBody>
                        </DialogContent>
                </DialogRoot>
        );
};

export default RegistrationDialog;
