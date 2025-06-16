import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Users, 
  Building2, 
  Briefcase, 
  Target, 
  Award, 
  Heart, 
  Globe, 
  Zap,
  CheckCircle,
  TrendingUp,
  Shield,
  Lightbulb
} from 'lucide-react';
import axios from 'axios';
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant';

const AboutUs = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalCompanies: 0,
    totalApplications: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch jobs count
        const jobsRes = await axios.get(`${JOB_API_END_POINT}/get`);
        const totalJobs = jobsRes.data.jobs?.length || 0;

        // Fetch companies count
        const companiesRes = await axios.get(`${COMPANY_API_END_POINT}/get`);
        const totalCompanies = companiesRes.data.companies?.length || 0;

        // Calculate total applications
        const totalApplications = jobsRes.data.jobs?.reduce((acc, job) => {
          return acc + (job.applications?.length || 0);
        }, 0) || 0;

        setStats({
          totalJobs,
          totalCompanies,
          totalApplications,
          activeUsers: Math.floor(totalApplications * 0.8) // Estimate based on applications
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const features = [
    {
      icon: Target,
      title: "Smart Job Matching",
      description: "AI-powered job recommendations based on your skills and preferences"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your data is protected with enterprise-grade security measures"
    },
    {
      icon: Zap,
      title: "Fast & Efficient",
      description: "Quick application process with instant notifications"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connect with companies worldwide and expand your opportunities"
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "User-Centric",
      description: "We put our users first, ensuring the best experience possible"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Committed to delivering excellence in every interaction"
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "Continuously innovating to stay ahead of industry trends"
    },
    {
      icon: CheckCircle,
      title: "Transparency",
      description: "Open and honest communication with all our stakeholders"
    }
  ];

  const team = [
    {
      name: "Vitthal K",
      role: "Founder & CEO",
      description: "Passionate about connecting talent with opportunities",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Development Team",
      role: "Engineering",
      description: "Building the future of job platforms",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              About <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">DreamDesk</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We're revolutionizing the way people find their dream careers and companies discover exceptional talent.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              Join Our Mission
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Impact</h2>
            <p className="text-muted-foreground">Connecting talent with opportunities worldwide</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Briefcase, label: "Active Jobs", value: stats.totalJobs, color: "text-blue-600" },
              { icon: Building2, label: "Companies", value: stats.totalCompanies, color: "text-green-600" },
              { icon: Users, label: "Applications", value: stats.totalApplications, color: "text-purple-600" },
              { icon: Target, label: "Active Users", value: stats.activeUsers, color: "text-orange-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <Card className="border-0 shadow-lg bg-card">
                  <CardContent className="p-6">
                    <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-3xl font-bold text-foreground mb-1">
                      {loading ? "..." : stat.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6 text-primary" />
                    Our Mission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To democratize access to career opportunities by creating a seamless platform 
                    that connects talented individuals with innovative companies, fostering growth 
                    and success for both parties.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-primary" />
                    Our Vision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    To become the world's most trusted platform for career development, 
                    where every individual can find their dream job and every company 
                    can discover exceptional talent.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose DreamDesk?</h2>
            <p className="text-muted-foreground">Discover what makes us different</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Values</h2>
            <p className="text-muted-foreground">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg bg-card">
                  <CardContent className="p-6 text-center">
                    <value.icon className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground">The passionate people behind DreamDesk</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="border-0 shadow-lg bg-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <p className="text-primary font-medium">{member.role}</p>
                        <p className="text-sm text-muted-foreground mt-1">{member.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs; 