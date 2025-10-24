
// /etc/nginx/nginx.conf

nginxについてまとめ(導入編)  
https://qiita.com/morrr/items/929e9cb35914a7f3a652  
nginxについてまとめ(設定編)  
https://qiita.com/morrr/items/7c97f0d2e46f7a8ec967  

```
#  For more information on configuration, see:
#  * Official English Documentation: http://nginx.org/en/docs/
#    * Official Russian Documentation: http://nginx.org/ru/docs/


// nginxユーザを設定
user nginx;
//  利用可能なCPUコア数に応じてワーカープロセス数を自動設定する
worker_processes auto;
// エラーログを /var/log/nginx/error.log に「notice」レベルで出力する
error_log /var/log/nginx/error.log notice;
// NginxのプロセスID（PID）ファイルを /run/nginx.pid に保存する
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.

// 配下の .conf ファイル（動的モジュール設定）を読み込む
include /usr/share/nginx/modules/*.conf;

// Nginxの各ワーカーが同時に1024接続まで処理できるようにする設定
events {
        worker_connections 1024;
}

http {
        // アクセスログの出力フォーマットを定義
        - `$remote_addr` : クライアントのIPアドレス
        - `$remote_user` : 認証ユーザー名（なければ `-`）
        - `$time_local` : ログ記録時のローカル時刻
        - `$request` : リクエスト内容（例: GET /index.html HTTP/1.1）
        - `$status` : HTTPステータスコード
        - `$body_bytes_sent` : 送信したレスポンスボディのバイト数
        - `$http_referer` : リファラー（参照元URL）
        - `$http_user_agent` : ユーザーエージェント（ブラウザ情報）
        - `$http_x_forwarded_for` : プロキシ経由時の元のIPアドレス

        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

        // access_log：アクセスログの出力先とフォーマットを指定
        // /var/log/nginx/access.log：ログファイルの保存場所
        // main：log_format で定義したフォーマット名
        access_log  /var/log/nginx/access.log  main;

        // 静的ファイルの送信を最適化し、効率的にファイルを配信する設定
        sendfile            on;
        // TCPパケットの送信タイミングを最適化し、レスポンスのパフォーマンスを向上させる設定
        tcp_nopush          on;
        // クライアントとのKeep-Alive接続のタイムアウト時間（秒）。長めにすると再接続の負荷が減る
        keepalive_timeout   65;
        // MIMEタイプのハッシュテーブルの最大サイズ。多くの拡張子に対応できるようにする設定
        types_hash_max_size 4096;

        // include /etc/nginx/mime.types; : 拡張子ごとのMIMEタイプ定義ファイルを読み込む設定
        // default_type application/octet-stream; : MIMEタイプが不明な場合のデフォルト値（バイナリデータとして扱う）
        include             /etc/nginx/mime.types;
        default_type        application/octet-stream;

        # Load modular configuration files from the /etc/nginx/conf.d directory.
        # See http://nginx.org/en/docs/ngx_core_module.html#include
        # for more information.

        // include /etc/nginx/conf.d/*.conf; : /etc/nginx/conf.d/ ディレクトリ配下のすべての .conf 設定ファイルを読み込む設定
        include /etc/nginx/conf.d/*.conf;

        // serverブロック（HTTP用）: 80番ポートで待ち受け、aws-intro-sample777.comへのアクセスをHTTPSへリダイレクトする設定
        server {
                listen 80;
                server_name aws-intro-sample777.com www.aws-intro-sample777.com;

                # HTTPからHTTPSへリダイレクト（任意）
                // 301 は「恒久的なリダイレクト（Moved Permanently）」のステータスコード
                // $host はリクエストされたホスト名（例: aws-intro-sample777.com）
                // $request_uri はリクエストされたパスやクエリ（例: /index.html?foo=bar）
                return 301 https://$host$request_uri;
        }

        # HTTPS (443) の www をリダイレクト
        server {
                listen 443 ssl;
                server_name www.aws-intro-sample777.com;

                ssl_certificate /etc/letsencrypt/live/aws-intro-sample777.com/fullchain.pem;
                ssl_certificate_key /etc/letsencrypt/live/aws-intro-sample777.com/privkey.pem;

                return 301 https://aws-intro-sample777.com$request_uri;
        }

        // serverブロック（HTTPS用）: 443番ポートで待ち受け、aws-intro-sample777.comへのHTTPSアクセスを処理する設定
        server {
                listen 443 ssl;
                server_name aws-intro-sample777.com;

                // Let's Encryptで取得したSSL証明書と秘密鍵のパスを指定
                ssl_certificate /etc/letsencrypt/live/aws-intro-sample777.com/fullchain.pem;
                ssl_certificate_key /etc/letsencrypt/live/aws-intro-sample777.com/privkey.pem;

                // フロントエンドの静的ファイル（ビルド成果物）を公開するディレクトリ
                root /home/ec2-user/ts-study-record-aws/frontend/dist;
                index index.html;

                // location /records: /records へのリクエストをバックエンドAPI（localhost:4000）へリバースプロキシする設定
                location /records {
                        // リクエストをバックエンドサーバー（Node.jsなど）に転送
                        // backend/server.ts
                        // → Nginx が「受け取り役」で、Nginx 自身が バックエンドサーバーにリクエストを代理送信
                        proxy_pass http://localhost:4000;
                        // 元のホスト名をバックエンドに渡す
                        proxy_set_header Host $host;
                        // クライアントのIPアドレスをバックエンドに渡す
                        proxy_set_header X-Real-IP $remote_addr;
                        // プロキシ経由時の元のIPアドレスを渡す
                        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                        // リクエストのプロトコル（http/https）を渡す
                        proxy_set_header X-Forwarded-Proto $scheme;
                }

                // location /: フロントエンドのSPA（Reactなど）用のルーティング設定
                location / {
                        // ファイルがなければ index.html を返す（SPA対応）
                        try_files $uri $uri/ /index.html;
                }
        }
}
```


