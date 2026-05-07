import {
  Heart, Activity, Scissors, Baby, Brain,
  Users, Droplets, FlaskConical, Stethoscope, Zap,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Heart,
  Activity,
  Scissors,
  Baby,
  Brain,
  Users,
  Droplets,
  FlaskConical,
  Stethoscope,
  Zap,
};

interface DeptIconProps {
  name: string;
  size?: number;
  className?: string;
}

export default function DeptIcon({ name, size = 28, className = 'text-blue-600' }: DeptIconProps) {
  const Icon = iconMap[name] ?? Activity;
  return <Icon size={size} className={className} />;
}
