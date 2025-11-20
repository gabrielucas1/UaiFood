interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: string;
  required?: boolean;
  className?: string; // ← NOVO: Para permitir classes CSS customizadas
}

// Componente para criar campos de input padronizados
export default function FormInput({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  icon, 
  required = false,
  className = '' // ← NOVO
}: FormInputProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm 
          focus:outline-none focus:ring-2 focus:ring-green-500 
          placeholder-gray-400 transition-colors
          ${className || 'border-gray-300'}
        `.trim()}
      />
    </div>
  );
}