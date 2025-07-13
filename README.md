# LocalStorage Best Practice React Todo App

LocalStorageを用いたフロントエンドアプリケーションの、自分の中の最適解を示しました。

## [src/utils/store/index.ts](./src/utils/store/index.ts)

ローカルストレージを一括で管理する関数。

### LocalStorageのKeyを実質１キーのみで管理

ローカルマシンで開発していくと、複数の LocalStorage を使用した際にキーがコンフリクトする恐れがあります。そこで、１アプリケーションで 1 Key を使用し、複数のオブジェクトを格納したい際も１つの関数で呼び出しをすることができます。

### 型定義の厳格化

LocalStorageの値は必ずしも正しい値が格納されていることの保証はできません。少なくとも、この関数を使用すれば、意図しないデータをsetすることを最小限にとどめます。

get, setは、複数のストレージキーを自身で設定でき、取得、更新時は最大限型定義の恩恵を受けることができます。

```ts
/** `store` (property) get: <"todos">(key: "todos") => TodoItem[] */
const todos = store.get('todos');
```

## 初期セットアップ

```shell
# install package
npm ci

# serve
npm run dev
```

## ツール

```shell
# format
npm run prettier

# test (vitest)
npm run test
```
