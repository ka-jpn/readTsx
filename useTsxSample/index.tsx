// 別のTSXファイルを相対パスでインポート可能
import { MyButton } from './components/Button.tsx';

const handleHello = () => alert("動的にトランスパイルしたTSXのボタンが押されました！");

const app = (
  <div>
    <h1>メイン画面</h1>
    {/* 自作コンポーネント関数の呼び出し */}
    {MyButton({ label: "ダイアログを表示する", onClick: handleHello })}
  </div>
);

document.body.append(app);
