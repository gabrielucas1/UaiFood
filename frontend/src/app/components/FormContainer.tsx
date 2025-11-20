interface FormContainerProps {
  children: React.ReactNode;
}

// Componente que cria o layout básico da página
export default function FormContainer({ children }: FormContainerProps) {
  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}