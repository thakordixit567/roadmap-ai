import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, TrendingUp } from 'lucide-react';

interface RoadmapCardProps {
  title: string;
  description?: string;
  topic: string;
  difficultyLevel: string;
  duration: string;
  createdAt: string;
  onClick?: () => void;
}

export function RoadmapCard({
  title,
  description,
  topic,
  difficultyLevel,
  duration,
  createdAt,
  onClick,
}: RoadmapCardProps) {
  const difficultyColors = {
    beginner: 'bg-green-500/10 text-green-500 border-green-500/20',
    intermediate: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    advanced: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  const difficultyColor = difficultyColors[difficultyLevel.toLowerCase() as keyof typeof difficultyColors] || difficultyColors.beginner;

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-strong hover:scale-[1.02] bg-gradient-card border-border/50 backdrop-blur-sm"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="font-display text-xl group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="mt-2 line-clamp-2">{description}</CardDescription>
            )}
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
            {topic}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Target className="w-4 h-4" />
            <Badge variant="outline" className={difficultyColor}>
              {difficultyLevel}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
