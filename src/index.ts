import * as fs from 'fs';
import { marked } from 'marked';
import * as path from 'path';

// コマンドライン引数からMarkdownファイルのパスを取得
const markdownPath = process.argv[2];

if (!markdownPath) {
    console.error('使用方法: npm start <markdownファイルのパス>');
    process.exit(1);
}

try {
    // Markdownファイルを読み込む
    const markdownContent = fs.readFileSync(markdownPath, 'utf-8');

    // テンプレートを読み込む
    const template = fs.readFileSync(path.join(__dirname, '../src/template.html'), 'utf-8');

    // MarkdownをHTMLに変換
    const htmlContent = marked(markdownContent);

    // ファイル名を取得（拡張子なし）
    const fileName = path.basename(markdownPath, path.extname(markdownPath));

    // テンプレートにコンテンツを挿入
    const finalHtml = template
        .replace('{{title}}', fileName)
        .replace('{{content}}', htmlContent);

    // 出力ファイル名を生成
    const outputPath = path.join(
        path.dirname(markdownPath),
        `${fileName}.html`
    );

    // HTMLファイルを保存
    fs.writeFileSync(outputPath, finalHtml);

    console.log(`変換が完了しました: ${outputPath}`);
} catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
}