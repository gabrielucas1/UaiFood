interface ErrorMessageProps {
  message: string;
}

// Componente para mostrar mensagens de erro
export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
      {message}
    </div>
  );
}