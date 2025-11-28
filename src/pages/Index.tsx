import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { MapIcon, Sparkles, TrendingUp, Zap, CheckCircle2 } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Generation',
      description: 'Advanced AI creates personalized learning paths tailored to your goals and skill level',
    },
    {
      icon: TrendingUp,
      title: 'Structured Progress',
      description: 'Break down complex topics into manageable phases with clear milestones',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Generate comprehensive roadmaps in seconds, not hours',
    },
  ];

  const benefits = [
    'Personalized learning paths',
    'Clear milestone tracking',
    'Multiple difficulty levels',
    'Save and access anytime',
    'Google sign-in support',
    'Completely free to start',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center gap-2 mb-6">
              <MapIcon className="w-12 h-12 text-primary" />
              <h1 className="text-5xl md:text-7xl font-display font-bold bg-gradient-hero bg-clip-text text-transparent">
                RoadmapAI
              </h1>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
              Your Journey to Mastery,
              <br />
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Powered by AI
              </span>
            </h2>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Generate personalized learning roadmaps for any skill or topic. 
              Let AI guide your path from beginner to expert.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                onClick={() => navigate('/auth')}
                className="gap-2 text-lg px-8 py-6 shadow-strong hover:shadow-medium transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/auth')}
                className="text-lg px-8 py-6"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Why Choose RoadmapAI?
            </h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Transform your learning journey with intelligent, structured roadmaps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-gradient-card border border-border/50 shadow-soft hover:shadow-medium transition-all duration-300 hover:scale-105"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h4 className="text-xl font-display font-semibold mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Everything You Need to Succeed
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Start Your Journey?
          </h3>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join thousands of learners using AI to achieve their goals
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate('/auth')}
            className="gap-2 text-lg px-8 py-6 shadow-strong"
          >
            <Sparkles className="w-5 h-5" />
            Create Your First Roadmap
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapIcon className="w-5 h-5 text-primary" />
            <span className="font-display font-semibold text-foreground">RoadmapAI</span>
          </div>
          <p className="text-sm">
            Powered by AI • Built for learners
          </p>
        </div>
      </footer>
    </div>
  );
}
