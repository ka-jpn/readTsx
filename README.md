# readTsx - Dynamic TSX Multi-Loader
TSXファイルをブラウザで動的にトランスパイルして実行するスクリプト  

## 使い方
readTsx.jsをhtmlから読み込むだけでtsxを動的にトランスパイルして実行できます  

ここからダウンロードが必要なファイルは readTsx.js だけです  
あとはあなたの.htmlと.tsxファイル  

index.htmlとreadTsx.jsとindex.tsxが同じフォルダにある場合、index.htmlに以下を記述  
```<script defer type="module" src="./readTsx.js" data-main="./index.tsx"></script>```  
readTs.jsxや.tsxのパスが違う場合はそのパスに書き換えるだけ  

data-mainに指定した.tsxから他の.tsxを参照していても正常にトランスパイルして実行します  
TSXの他にtypescript(.ts)にも対応しています  

サンプルとして
typescriptを複数読み込む useTsSample と  
TSXを複数読み込む useTsxSample があります  
