import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  children: ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <Card
      className={cn(
        'border-border/50 shadow-lg backdrop-blur-sm',
        'bg-card/95 hover:bg-card/100 transition-all duration-300',
        className,
      )}
    >
      {children}
    </Card>
  );
}

export default AuthCard;
