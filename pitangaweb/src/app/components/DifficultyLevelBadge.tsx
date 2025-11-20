import { ChallengeLevel } from "@/types/challenges.types";

import { Badge } from "@/components/ui/badge"

export const difficultyLevelStyles: Record<ChallengeLevel, {label: string, style: string}> = {
  EASY: {
    label: 'Fácil',
    style: 'text-success border-success',
  },
  MEDIUM: {
    label: 'Médio',
    style: 'text-warning border-warning',
  },
  HARD: {
    label: 'Difícil',
    style: 'text-accent border-accent',
  },
  PRO: {
    label: 'PRO',
    style: 'text-complementary border-complementary',
  },
}

interface DifficultyLevelBadgeProps {
  level: ChallengeLevel;
  className?: string;
}

export const DifficultyLevelBadge = ({level, className}: DifficultyLevelBadgeProps) => {
  return (
    <Badge variant='outline' className={`tracking-widest font-bold border-2 ${difficultyLevelStyles[level].style} ${className}`}>
      {difficultyLevelStyles[level].label}
    </Badge>
  )
}
