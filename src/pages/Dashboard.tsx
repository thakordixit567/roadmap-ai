import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { RoadmapCard } from '@/components/RoadmapCard';
import { Loader2, LogOut, MapIcon, Plus, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Roadmap {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty_level: string;
  duration: string;
  content: any;
  created_at: string;
}

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchRoadmaps();
    }
  }, [user]);

  const fetchRoadmaps = async () => {
    try {
      const { data, error } = await supabase
        .from('roadmaps')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoadmaps(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error loading roadmaps',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapIcon className="w-8 h-8 text-primary" />
            <h1 className="text-2xl font-display font-bold bg-gradient-primary bg-clip-text text-transparent">
              RoadmapAI
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => navigate('/generate')} className="gap-2">
              <Plus className="w-4 h-4" />
              New Roadmap
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">Your Roadmaps</h2>
          <p className="text-muted-foreground">
            Track your learning journey and explore new paths
          </p>
        </div>

        {roadmaps.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-display font-semibold mb-2">No roadmaps yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first AI-powered learning roadmap
            </p>
            <Button onClick={() => navigate('/generate')} className="gap-2">
              <Plus className="w-4 h-4" />
              Generate Roadmap
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                title={roadmap.title}
                description={roadmap.description}
                topic={roadmap.topic}
                difficultyLevel={roadmap.difficulty_level}
                duration={roadmap.duration}
                createdAt={roadmap.created_at}
                onClick={() => setSelectedRoadmap(roadmap)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Roadmap Detail Dialog */}
      <Dialog open={!!selectedRoadmap} onOpenChange={() => setSelectedRoadmap(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">{selectedRoadmap?.title}</DialogTitle>
            <DialogDescription>{selectedRoadmap?.description}</DialogDescription>
          </DialogHeader>
          {selectedRoadmap && (
            <div className="space-y-6 mt-4">
              <div className="flex flex-wrap gap-3">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {selectedRoadmap.topic}
                </Badge>
                <Badge variant="outline">
                  {selectedRoadmap.difficulty_level}
                </Badge>
                <Badge variant="outline">
                  {selectedRoadmap.duration}
                </Badge>
              </div>
              
              <div className="prose prose-sm max-w-none">
                {selectedRoadmap.content.phases?.map((phase: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">{phase.title}</h3>
                    <p className="text-muted-foreground mb-3">{phase.description}</p>
                    {phase.milestones && (
                      <ul className="space-y-2">
                        {phase.milestones.map((milestone: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{milestone}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Badge({ children, variant = 'default', className = '' }: { children: React.ReactNode; variant?: 'default' | 'outline'; className?: string }) {
  const baseStyles = 'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors';
  const variantStyles = variant === 'outline' 
    ? 'border border-border' 
    : 'bg-primary text-primary-foreground';
  
  return (
    <span className={`${baseStyles} ${variantStyles} ${className}`}>
      {children}
    </span>
  );
}
