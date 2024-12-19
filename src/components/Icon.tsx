import { 
  AcademicCapIcon, BriefcaseIcon, CameraIcon, ChartBarIcon,
  CogIcon, DocumentIcon, HomeIcon, LightBulbIcon,
  PencilIcon, ShoppingBagIcon, UserGroupIcon, WrenchIcon
} from '@heroicons/react/24/outline';

const icons = {
  'academic': AcademicCapIcon,
  'briefcase': BriefcaseIcon,
  'camera': CameraIcon,
  'chart': ChartBarIcon,
  'cog': CogIcon,
  'document': DocumentIcon,
  'home': HomeIcon,
  'lightbulb': LightBulbIcon,
  'pencil': PencilIcon,
  'shopping': ShoppingBagIcon,
  'users': UserGroupIcon,
  'wrench': WrenchIcon
};

interface IconProps {
  name: keyof typeof icons;
  className?: string;
}

export function Icon({ name, className = "h-6 w-6" }: IconProps) {
  const IconComponent = icons[name];
  return IconComponent ? <IconComponent className={className} /> : null;
}
