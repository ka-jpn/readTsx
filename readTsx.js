'use strict';
// @ts-ignore
import * as esbuild from 'https://cdn.jsdelivr.net/npm/esbuild-wasm@0.28.1/esm/browser.js';
/** @typedef {HTMLElement | string | number | boolean | null | undefined} FlatElem */
/**
 * JSXの要素をパースして実際のDOM要素を生成するファクトリ関数
 * @param {string} tag タグ名
 * @param {Record<string, ((evt: Event) => void) | string> | null} attrs 属性やイベントハンドラ
 * @param {...FlatElem | FlatElem[] | any[]} children 子要素
 * @returns {HTMLElement} 生成されたHTML要素
 */
const createDOM = (tag, attrs, ...children) => {
  const el = document.createElement(tag);
  attachAttribute(el,attrs);
  appendChildren(el,...children);
  return el;
  /** @param {HTMLElement} element, @param {Record<string, ((evt: Event) => void) | string> | null} attrs */
  function attachAttribute(element, attrs){
    for (const [key, value] of Object.entries(attrs ?? {})) {
      if (value === false || value == null) { continue; }
      if (typeof value === "function") { element.addEventListener(key.substring(2).toLowerCase(), value); }
      else if (value === true) { element.setAttribute(key, String(value)); }
      else if (key === "className" || key === "class") { element.className = value; } 
      else { element.setAttribute(key, value); }
    }
  }
  /** @param {HTMLElement} element, @param {...FlatElem | FlatElem[] | any[]} children */
  function appendChildren(element,...children){
    /** @type {FlatElem[]} */
    const flatChildren = children.flat(Infinity);
    flatChildren.forEach(child=>appendChild(element,child));
    /** @param {HTMLElement} element, @param {FlatElem} child */
    function appendChild(element,child){
      if(typeof child === "string"){element.appendChild(document.createTextNode(child));}
      else if(typeof child === "number"){element.appendChild(document.createTextNode(child.toString()));}
      else if(child instanceof HTMLElement){element.appendChild(child);}
    }
  }
};
/** @param {string} filePath */
const bundleAndExecuteTSX = async (filePath) => {
  try {
    // esbuild.build を使用して、依存する複数ファイルを1つに結合（バンドル）
    const result = await esbuild.build({
      entryPoints: [filePath],
      bundle: true,            // 複数ファイルを1つにまとめる設定
      write: false,            // メモリ上（結果オブジェクト内）に出力する
      target: 'esnext',
      format: 'esm',           // ESモジュール形式で出力
      jsxFactory: 'createDOM',
      plugins: [{
        name: 'http-fetch-plugin',
        /** @param {any} build */
        setup(build) {
          // 相対パスのインポート（./や../）を正しく解決する
          build.onResolve({ filter: /^\./ }, 
            /** @param {any} args */
            (args) => {
              const parentUrl = new URL(args.importer, window.location.href);
              const resolvedUrl = new URL(args.path, parentUrl.href);
              return { path: resolvedUrl.pathname + resolvedUrl.search };
            }
          );
          // ファイルの実際の中身をブラウザの fetch で取得して esbuild に渡す
          build.onLoad({ filter: /.*/ }, 
            /** @param {any} args */
            async (args) => {
              const response = await fetch(args.path);
              if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
              return { contents: await response.text(), loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts' };
            }
          );
        }
      }]
    });
    // バンドルされた単一のJSコードを取得
    const bundledCode = result.outputFiles[0].text;
    // Blob を生成して動的 import() で実行
    const url = URL.createObjectURL(new Blob([bundledCode], { type: "text/javascript" }));
    try { await import(url); } finally { URL.revokeObjectURL(url); }
  } catch (error) { console.error('TSX Bundle/Execute Error:', error); }
}
/** @param {string | null | undefined} entryPointFilePath */
const execute = async (entryPointFilePath) => {
  // トランスパイルと実行
  if (entryPointFilePath) { await bundleAndExecuteTSX(entryPointFilePath); } else { console.error('readTsx.js error: script タグに data-main 属性が指定されていません。'); }
}
const init = async () => {
// esbuildの初期化
  await esbuild.initialize({ wasmURL: 'https://cdn.jsdelivr.net/npm/esbuild-wasm@0.28.1/esbuild.wasm' });
  /** @type {any} */ (globalThis).createDOM = createDOM;
}
// ↑定義コード
// ↓実行コード
await init();
await execute(document.querySelector('script[data-main]')?.getAttribute('data-main'));
