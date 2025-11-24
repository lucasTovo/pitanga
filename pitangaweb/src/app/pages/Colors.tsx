import { ThemeToggle } from "@/app/components/ThemeToggle";
import { Card, CardContent } from "@/components/ui/card";

const themeColors = [
  { name: '--primary', className: 'bg-primary text-primary-foreground' },
  { name: '--secondary', className: 'bg-secondary text-secondary-foreground' },
  { name: '--accent', className: 'bg-accent text-accent-foreground' },
  { name: '--complementary', className: 'bg-complementary text-neutral-50' },
  { name: '--success', className: 'bg-success text-success-foreground' },
  { name: '--error', className: 'bg-error text-error-foreground' },
  { name: '--warning', className: 'bg-warning text-warning-foreground' },

  { name: '--background', className: 'bg-background text-foreground' },
  { name: '--card', className: 'bg-card text-card-foreground'},
  { name: '--popover', className: 'bg-popover text-popover-foreground'},
  { name: '--muted', className: 'bg-muted text-muted-foreground' },
  { name: '--destructive', className: 'bg-destructive text-destructive-foreground' },

  { name: '--border', className: 'bg-border' },
  { name: '--input', className: 'bg-input' },
  { name: '--ring', className: 'bg-ring text-neutral-50' },

  { name: '--chart-1', className: 'bg-chart-1' },
  { name: '--chart-2', className: 'bg-chart-2' },
  { name: '--chart-3', className: 'bg-chart-3' },
  { name: '--chart-4', className: 'bg-chart-4' },
  { name: '--chart-5', className: 'bg-chart-5' },

  { name: '--radius', className: 'bg-radius' },
]

export const Colors = () => {
  return (
    <div>
      <ThemeToggle />
      {themeColors.map(({ name, className }) => (
        <Card key={name} className="overflow-hidden shadow-md">
            <CardContent className={`p-3 flex flex-col gap-1 text-sm` + ` ${className}`}>
              <span className="font-semibold">{name}</span>
            </CardContent>
          </Card>
      ))}
    </div>
  );
};
