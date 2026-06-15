// 別のTSファイルを相対パスでインポート可能
import { MyButton } from './components/Button.ts';

const handleHello = () => alert("動的にトランスパイルしたtypescriptのボタンが押されました！");

function app() {
  const elem = document.createElement('div');
  elem.appendChild(headElem());
  //インポートされたMyButtonを呼び出す
  elem.appendChild(MyButton({ label: "ダイアログを表示する", onClick: handleHello }));
  return elem;
  function headElem(){
    const elem = document.createElement('h1');
    elem.appendChild(document.createTextNode('メイン画面'));
    return elem;
  }
}

document.body.append(app());
