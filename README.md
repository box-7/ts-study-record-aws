# 学習記録一覧アプリ
学習一覧アプリです。

# できること
タイトル(学習内容)、時間(学習時間)の登録、編集、削除  
学習合計時間の表示  
(WEBエンジニアになるために必要な学習時間は1000時間と言われており、  
学習時間の合計を記録できます)

# 環境設定方法
supabaseに登録してください。  
https://supabase.com/

supabaseでプロジェクトを作成し、以下カラムを作成してください。  
id: uuid  
title: string  
time: number  

プロジェクト直下に「.envファイル」を作成してください。  
<!-- .envに、VITE_SUPABASE_URL、VITE_SUPABASE_ANON_KEYを設定してください。   -->

# 起動の仕方
プロジェクトディレクトリに移動し、npm run dev を打ち込んでください。  
以下画面が立ち上がります。  

![image](https://github.com/user-attachments/assets/61ac3072-ecb5-488c-a68a-4391eb5f1ed6)

![image](https://github.com/user-attachments/assets/95626a5d-da80-4793-b171-40567cfc8362)
