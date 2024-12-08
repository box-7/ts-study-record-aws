import { useState } from 'react';
// import './App.css'
import supabase from './utils/supabase';
import { useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const { data } = await supabase.from('study-record').select('*');
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    // fetchData().then(data => {
    //         // reduce: 配列の各要素に対して処理を行い、最終的に一つの値を返すメソッド
    //         // acc: 累積値を表します。初期値は0で、各要素を処理するたびにこの値に新しい値が加算される
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
        (acc, record) => acc + parseInt(record.time),
        0
      );
      setTotalTime(calculatedTotalTime);
    }
  }, [data]);

  const addTodo = async (title, time) => {
    const { data, error } = await supabase
      .from('study-record')
      .insert([{ title: title, time: time }])
      .select();
    if (error) {
      throw error;
    }
    fetchData(); // データを再取得して状態を更新
    // console.log("addTodo data",data);
    return data;
  };

  const handleDelete = async (id) => {
    try {
      await supabase.from('study-record').delete().eq('id', id);
      // const { data } = await supabase.from("study-record").select("*");
      // // console.log("data",data);
      // setData(data);
      fetchData();
    } catch (error) {
      alert(error.message);
    }
  };

  const [studyContent, setStudyContent] = useState('');
  const [studyHour, setStudyHour] = useState(0);
  const [error, setError] = useState('');
  const handleChange = (e) => {
    setStudyContent(e.target.value);
  };
  const handleChangeHour = (e) => {
    setStudyHour(e.target.value);
  };
  const onClickSetRecord = async () => {
    if (studyContent === '' || studyHour === '') {
      setError('入力されていない項目があります');
      return;
    }
    setError('');
    await addTodo(studyContent, studyHour);
    // 非同期なので、ここだとうまくいかない
    // fetchData();
    setStudyContent('');
    setStudyHour(0);
  };

  return (
    <>
      <h1>学習記録一覧!</h1>
      <p>
        <label htmlFor="study-content">学習内容</label>
        <input
          data-testid="study-content"
          id="study-content"
          type="text"
          value={studyContent}
          onChange={handleChange}
        />
      </p>
      <p>
        <label htmlFor="study-hour">学習時間</label>
        <input
          data-testid="study-hour"
          id="study-hour"
          type="number"
          value={studyHour}
          onChange={handleChangeHour}
        />
      </p>
      <p>入力されている学習内容: {studyContent}</p>
      <p>入力されている学習時間: {studyHour}時間</p>
      <button data-testid="add-record" onClick={onClickSetRecord}>
        登録
      </button>

      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : data && data.length > 0 ? (
          <div>
            {data.map((record) => (
              <p data-testid="record" key={record.id}>
                {record.title} {record.time}時間{' '}
                <button
                  data-testid="delete-button"
                  onClick={() => handleDelete(record.id)}
                >
                  削除
                </button>
              </p>
            ))}
          </div>
        ) : (
          <p>データがありません</p>
        )}
      </div>
      {error && <p>{error}</p>}

      <h2>合計時間: {totalTime} / 1000(h)</h2>
    </>
  );
}

export default App;
