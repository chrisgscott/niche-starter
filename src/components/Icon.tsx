import {
  Briefcase,
  Camera,
  FileText,
  Home,
  Lightbulb,
  PencilLine,
  ShoppingBag,
  Users,
  Wrench
} from 'lucide-react';

const icons = {
  'academic': FileText,
  'briefcase': Briefcase,
  'camera': Camera,
  'document': FileText,
  'home': Home,
  'lightbulb': Lightbulb,
  'pencil': PencilLine,
  'shopping': ShoppingBag,
  'users': Users,
  'wrench': Wrench
};

interface IconProps {
  name: keyof typeof icons;
  className?: string;
}

export function Icon({ name, className = '' }: IconProps) {
  const IconComponent = icons[name];
  return <IconComponent className={className} />;
}
