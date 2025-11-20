import Image from 'next/image';

interface FormHeaderProps {
  title: string;
  subtitle: string;
}

// Componente para mostrar logo e título da página
export default function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <div className="text-center mb-6">
      <Image 
        src="/delivery-logo.svg" 
        alt="UaiFood" 
        width={50} 
        height={50}
        className="mx-auto mb-4"
      />
      <h1 className="text-2xl font-bold text-gray-800">
        {title}
      </h1>
      <p className="text-gray-600 text-sm">
        {subtitle}
      </p>
    </div>
  );
}