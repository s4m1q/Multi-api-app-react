// src/components/ErrorDisplay.tsx
interface Props {
  message: string;
}

const ErrorDisplay = ({ message }: Props) => (
  <div className="error">{message}</div>
);

export default ErrorDisplay;