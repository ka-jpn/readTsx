interface ButtonProps {
  label: string;
  onClick: () => void;
}

// コンポーネントを export
export function MyButton({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} style="padding: 10px; background: #007bff; color: white;">
      {label}
    </button>
  );
}