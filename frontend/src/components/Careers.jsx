import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Users, 
  Heart, 
  Zap, 
  Award, 
  Coffee,
  BookOpen,
  DollarSign,
  Home,
  Clock,
  Send,
  MapPin,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { useNotification } from './providers/NotificationProvider';

const Careers = () => {
  const { showSuccess, showError } = useNotification();
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: null,
    coverLetter: ''
  });

  const openPositions = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "5+ years",
      salary: "₹15,00,000 - ₹25,00,000",
      description: "We're looking for a passionate Full Stack Developer to join our engineering team and help build the future of job platforms.",
      requirements: [
        "Strong experience with React, Node.js, and MongoDB",
        "Experience with cloud platforms (AWS/Azure/GCP)",
        "Knowledge of microservices architecture",
        "Excellent problem-solving skills",
        "Team player with strong communication skills"
      ]
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹12,00,000 - ₹20,00,000",
      description: "Join our product team to shape the future of our platform and create amazing user experiences.",
      requirements: [
        "Experience in product management for SaaS platforms",
        "Strong analytical and data-driven decision making",
        "Excellent user research and UX skills",
        "Experience with agile methodologies",
        "Strong stakeholder management skills"
      ]
    },
    {
      id: 3,
      title: "UX/UI Designer",
      department: "Design",
      location: "San Francisco, CA",
      type: "Full-time",
      experience: "2+ years",
      salary: "₹8,00,000 - ₹15,00,000",
      description: "Help us create beautiful and intuitive user experiences that delight our users.",
      requirements: [
        "Strong portfolio showcasing web and mobile designs",
        "Experience with Figma, Sketch, or similar tools",
        "Understanding of user-centered design principles",
        "Experience with design systems",
        "Strong collaboration skills"
      ]
    }
  ];

  const cultureValues = [
    {
      icon: Heart,
      title: "Passion",
      description: "We're passionate about connecting people with opportunities"
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe great things happen when we work together"
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We constantly push boundaries and embrace new ideas"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in everything we do"
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Salary",
      description: "We offer competitive salaries with equity options"
    },
    {
      icon: Heart,
      title: "Health Benefits",
      description: "Comprehensive health, dental, and vision insurance"
    },
    {
      icon: Home,
      title: "Remote Work",
      description: "Flexible work arrangements and remote options"
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work when you're most productive"
    },
    {
      icon: BookOpen,
      title: "Learning Budget",
      description: "Annual budget for courses, conferences, and books"
    },
    {
      icon: Coffee,
      title: "Team Events",
      description: "Regular team building and social events"
    }
  ];

  const handleApply = (job) => {
    setSelectedJob(job);
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    
    if (!applicationData.name || !applicationData.email || !applicationData.phone) {
      showError('Please fill in all required fields', 'career_application_validation');
      return;
    }

    showSuccess(`Application submitted successfully for ${selectedJob.title}! We'll get back to you soon.`, 'career_application_success');
    setShowApplicationForm(false);
    setApplicationData({ name: '', email: '', phone: '', resume: null, coverLetter: '' });
  };

  const handleFileChange = (e) => {
    setApplicationData({
      ...applicationData,
      resume: e.target.files[0]
    });
  };

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
              Join Our <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Team</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Help us revolutionize the way people find their dream careers. Join a team that's passionate about making a difference.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
              View Open Positions
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Culture & Values */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Culture & Values</h2>
            <p className="text-muted-foreground">The principles that guide our team and culture</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cultureValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
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

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Work With Us?</h2>
            <p className="text-muted-foreground">We take care of our team with amazing benefits</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <benefit.icon className="w-8 h-8 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Open Positions</h2>
            <p className="text-muted-foreground">Join our mission to connect talent with opportunities</p>
          </motion.div>

          <div className="space-y-6">
            {openPositions.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-foreground">{job.title}</h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{job.department}</span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Briefcase className="w-4 h-4" />
                            {job.type}
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            {job.experience}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-4 h-4" />
                            {job.salary}
                          </div>
                        </div>
                        
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.slice(0, 3).map((req, idx) => (
                            <span key={idx} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                              {req.split(' ').slice(0, 3).join(' ')}...
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button 
                          onClick={() => handleApply(job)}
                          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Apply Now
                        </Button>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Modal */}
      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-card rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <CardHeader>
              <CardTitle>Apply for {selectedJob.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name *</label>
                  <input
                    type="text"
                    value={applicationData.name}
                    onChange={(e) => setApplicationData({...applicationData, name: e.target.value})}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Email *</label>
                  <input
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => setApplicationData({...applicationData, email: e.target.value})}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Phone *</label>
                  <input
                    type="tel"
                    value={applicationData.phone}
                    onChange={(e) => setApplicationData({...applicationData, phone: e.target.value})}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
                    required
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Resume</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-foreground">Cover Letter</label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({...applicationData, coverLetter: e.target.value})}
                    rows={4}
                    className="w-full mt-1 p-2 border border-border rounded-md bg-background text-foreground"
                    placeholder="Tell us why you're interested in this position..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
                  >
                    Submit Application
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Careers; 