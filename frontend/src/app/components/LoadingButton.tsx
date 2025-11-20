interface LoadingButtonProps {
  isLoading: boolean;
  loadingText: string;
  children: React.ReactNode;
}

// Componente para botão que mostra loading quando está carregando
export default function LoadingButton({ isLoading, loadingText, children }: LoadingButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50"
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
}