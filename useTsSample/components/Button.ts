interface ButtonProps {
  label: string;
  onClick: () => void;
}

// コンポーネントを export
export function MyButton({ label, onClick }: ButtonProps) {
  const elem = document.createElement('button');
  elem.setAttribute('style', 'padding: 10px; background: #007bff; color: white;')
  elem.addEventListener('click',onClick)
  elem.appendChild(document.createTextNode(label));
  return elem;
}