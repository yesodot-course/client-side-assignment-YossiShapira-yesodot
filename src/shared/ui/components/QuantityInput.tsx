interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
}

export function QuantityInput({ value, onChange }: QuantityInputProps): JSX.Element {
  return (
    <input
      type="number"
      min={1}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  );
}