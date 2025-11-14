import { ChallengeLevel } from "@/types/challenges.types";

import { Badge } from "@/components/ui/badge"

const difficultyLevelStyles: Record<ChallengeLevel, {label: string, style: string}> = {
  EASY: {
    label: 'Fácil',
    style: 'bg-success text-success-foreground',
  },
  MEDIUM: {
    label: 'Médio',
    style: 'bg-warning text-warning-foreground',
  },
  HARD: {
    label: 'Difícil',
    style: 'bg-accent text-accent-foreground',
  },
  PRO: {
    label: 'PRO',
    style: 'bg-complementary text-complementary-foreground',
  },
}

interface DifficultyLevelBadgeProps {
  level: ChallengeLevel;
  className?: string;
}

export const DifficultyLevelBadge = ({level, className}: DifficultyLevelBadgeProps) => {
  return (
    <Badge className={`${difficultyLevelStyles[level].style} ${className}`}>
      {difficultyLevelStyles[level].label}
    </Badge>
  )
}
