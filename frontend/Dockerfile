# ベースイメージ
FROM node:16-alpine

# 作業ディレクトリを設定
WORKDIR /app

# 必要な依存関係をインストール
COPY package.json /app/
RUN npm install

# ソースコードをコピー
COPY . .

# 必要な環境変数を設定
ENV NODE_ENV=production

# 必要なLeafletのスタイルをインストール可能にする
RUN npm install leaflet

# プロダクションビルドを実行
RUN npm run build

# 静的サーバーをインストール
RUN npm install -g serve

# アプリケーションを提供
CMD ["serve", "-s", "build", "-l", "3000"]

