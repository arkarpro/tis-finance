import { Link } from 'react-router-dom';
import { ArrowLeft, Construction } from 'lucide-react';

interface PagePlaceholderProps {
  title: string;
  description: string;
  icon?: React.ElementType;
}

export default function PagePlaceholder({ title, description, icon: Icon = Construction }: PagePlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-5">
        <Icon className="w-10 h-10 text-slate-400" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md mb-6">{description}</p>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium">
        <Construction className="w-4 h-4" />
        Module under construction
      </div>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
    </div>
  );
}
