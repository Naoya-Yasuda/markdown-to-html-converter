# Markdown to HTML Converter

MarkdownファイルをHTMLに変換するCLIツールです。

## インストール

```bash
npm install
```

## ビルド

```bash
npm run build
```

## 使用方法

### 単一ファイルの変換
```bash
npm start <markdownファイルのパス>
```

例：
```bash
npm start ./example.md
```

### 複数ファイルの変換
```bash
npm start <markdownファイルのパス1> <markdownファイルのパス2> ...
```

例：
```bash
npm start ./example.md ./another.md
```

### GitHub Pagesへのデプロイ
変換されたHTMLファイルは`docs`ディレクトリに保存されます。GitHub Pagesで公開するには：

1. すべてのMarkdownファイルを変換します
2. 変更をコミットしてプッシュします
3. GitHubリポジトリの設定で、GitHub Pagesのソースとして`docs`フォルダを選択します

または、以下のコマンドを使用して`gh-pages`ブランチにデプロイすることもできます：
```bash
npm run deploy
```

## 機能

- MarkdownファイルをHTMLに変換
- カスタムテンプレートを使用したHTML生成
- シンプルで使いやすいCLIインターフェース
