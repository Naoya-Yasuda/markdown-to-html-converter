import * as fs from 'fs';
import { marked } from 'marked';
import * as path from 'path';
import { glob } from 'glob';

const outputDir = path.join(process.cwd(), 'docs');

// コマンドライン引数からMarkdownファイルのパスを取得
const markdownPaths = process.argv.slice(2);

if (markdownPaths.length === 0) {
    console.error('使用方法: npm start <markdownファイルのパス1> [markdownファイルのパス2] ...');
    process.exit(1);
}

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`出力ディレクトリを作成しました: ${outputDir}`);
}

function convertMarkdown(markdownPath: string): { fileName: string, htmlPath: string } {
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
            .replace(/\{\{title\}\}/g, fileName)
            .replace('{{content}}', htmlContent);

        // 出力ファイル名を生成
        const htmlPath = path.join(outputDir, `${fileName}.html`);

        // HTMLファイルを保存
        fs.writeFileSync(htmlPath, finalHtml);

        console.log(`変換が完了しました: ${htmlPath}`);
        return { fileName, htmlPath };
    } catch (error) {
        console.error(`ファイル "${markdownPath}" の変換中にエラーが発生しました:`, error);
        throw error;
    }
}

function generateNavigationLinks(convertedFiles: Array<{ fileName: string, htmlPath: string }>): string {
    let navLinks = '<div class="navigation"><ul>\n';
    
    navLinks += `<li><a href="index.html">ホーム</a></li>\n`;
    
    convertedFiles.forEach(file => {
        const htmlFileName = path.basename(file.htmlPath);
        navLinks += `<li><a href="${htmlFileName}">${file.fileName}</a></li>\n`;
    });
    
    navLinks += '</ul></div>';
    return navLinks;
}

try {
    const convertedFiles: Array<{ fileName: string, htmlPath: string }> = [];
    
    for (const markdownPath of markdownPaths) {
        try {
            const result = convertMarkdown(markdownPath);
            convertedFiles.push(result);
        } catch (error) {
            console.error(`ファイル "${markdownPath}" の処理中にエラーが発生しました。他のファイルの処理を継続します。`);
        }
    }
    
    if (convertedFiles.length === 0) {
        console.error('変換できたファイルはありません。');
        process.exit(1);
    }
    
    const navLinks = generateNavigationLinks(convertedFiles);
    
    for (const file of convertedFiles) {
        let htmlContent = fs.readFileSync(file.htmlPath, 'utf-8');
        htmlContent = htmlContent.replace('<body>', '<body>\n' + navLinks);
        fs.writeFileSync(file.htmlPath, htmlContent);
    }
    
    const indexTemplate = fs.readFileSync(path.join(__dirname, '../src/template.html'), 'utf-8');
    let indexContent = '<h1>Markdown to HTML Converter - ファイル一覧</h1>\n<ul>';
    
    convertedFiles.forEach(file => {
        const htmlFileName = path.basename(file.htmlPath);
        indexContent += `<li><a href="${htmlFileName}">${file.fileName}</a></li>\n`;
    });
    
    indexContent += '</ul>';
    
    const indexHtml = indexTemplate
        .replace(/\{\{title\}\}/g, 'Markdown Files Index')
        .replace('{{content}}', indexContent);
    
    const indexPath = path.join(outputDir, 'index.html');
    fs.writeFileSync(indexPath, indexHtml.replace('<body>', '<body>\n' + navLinks));
    
    console.log(`インデックスファイルを生成しました: ${indexPath}`);
    console.log(`GitHub Pagesで公開するには、リポジトリの設定で "docs" フォルダを公開するように設定してください。`);
} catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
}
