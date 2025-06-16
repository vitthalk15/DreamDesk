import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Search, 
  HelpCircle, 
  BookOpen, 
  MessageSquare, 
  Mail, 
  Phone,
  ChevronDown,
  ChevronUp,
  FileText,
  Users,
  Settings,
  Shield,
  CreditCard
} from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const categories = [
    {
      icon: Users,
      title: "Getting Started",
      description: "Learn the basics of using DreamDesk",
      color: "text-blue-600"
    },
    {
      icon: FileText,
      title: "Job Applications",
      description: "How to apply for jobs and manage applications",
      color: "text-green-600"
    },
    {
      icon: Settings,
      title: "Account Settings",
      description: "Manage your profile and preferences",
      color: "text-purple-600"
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Keep your account safe and secure",
      color: "text-orange-600"
    },
    {
      icon: CreditCard,
      title: "Billing & Payments",
      description: "Information about our pricing and payments",
      color: "text-red-600"
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "How to communicate with employers",
      color: "text-indigo-600"
    }
  ];

  const faqs = [
    {
      category: "Getting Started",
      question: "How do I create an account?",
      answer: "Click on the 'Sign Up' button in the top right corner of the homepage. Fill in your details including name, email, password, and choose your role (Job Seeker or Recruiter). Verify your email address to complete the registration process."
    },
    {
      category: "Getting Started",
      question: "What's the difference between Job Seeker and Recruiter accounts?",
      answer: "Job Seeker accounts are for individuals looking for employment opportunities. They can browse jobs, apply for positions, and manage their applications. Recruiter accounts are for companies and hiring managers who want to post job openings and manage applications."
    },
    {
      category: "Job Applications",
      question: "How do I apply for a job?",
      answer: "Browse available jobs on our platform, click on a job that interests you, and click the 'Apply Now' button. Make sure you're logged in first. You'll need to upload your resume and may need to fill out additional information depending on the job requirements."
    },
    {
      category: "Job Applications",
      question: "Can I save jobs to apply later?",
      answer: "Yes! When viewing a job, you can click the 'Save Job' button to add it to your saved jobs list. You can access your saved jobs from your profile dashboard and apply to them later."
    },
    {
      category: "Account Settings",
      question: "How do I update my profile information?",
      answer: "Go to your Profile page from the navigation menu. You can update your personal information, work experience, education, skills, and upload a new profile picture. Don't forget to save your changes!"
    },
    {
      category: "Account Settings",
      question: "How do I change my password?",
      answer: "Go to your Profile page and look for the 'Change Password' section. Enter your current password and your new password twice to confirm. Click 'Update Password' to save the changes."
    },
    {
      category: "Security & Privacy",
      question: "Is my personal information secure?",
      answer: "Yes, we take security seriously. We use industry-standard encryption to protect your data, and we never share your personal information with third parties without your consent. You can review our Privacy Policy for more details."
    },
    {
      category: "Security & Privacy",
      question: "How do I enable two-factor authentication?",
      answer: "Go to your Profile page and look for the Security section. Click on 'Enable Two-Factor Authentication' and follow the setup instructions. This adds an extra layer of security to your account."
    },
    {
      category: "Communication",
      question: "How do I contact an employer?",
      answer: "After applying for a job, you can communicate with the employer through our messaging system. Go to your Applications page and click on the job to access the messaging feature."
    },
    {
      category: "Communication",
      question: "Will employers see my contact information?",
      answer: "Your contact information is only shared with employers after you apply for their job posting. You can control what information is visible in your profile settings."
    }
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Get instant help from our support team",
      action: "Start Chat",
      color: "text-blue-600"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      action: "Send Email",
      color: "text-green-600"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Call us during business hours",
      action: "Call Now",
      color: "text-purple-600"
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index) => {
    setExpandedFaq(expandedFaq === index ? null : index);
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
              How can we <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">help?</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Find answers to common questions or get in touch with our support team.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Help Categories</h2>
            <p className="text-muted-foreground">Find help by category</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg bg-card hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <category.icon className={`w-12 h-12 mx-auto mb-4 ${category.color}`} />
                    <h3 className="font-semibold text-foreground mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              {searchQuery ? `Search results for "${searchQuery}"` : "Find answers to common questions"}
            </p>
          </motion.div>

          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-card">
                  <CardContent className="p-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{faq.category}</span>
                        </div>
                        <h3 className="font-semibold text-foreground">{faq.question}</h3>
                      </div>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="px-6 pb-6">
                        <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFaqs.length === 0 && searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <HelpCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find any help articles matching "{searchQuery}"
              </p>
              <Button 
                onClick={() => setSearchQuery('')}
                variant="outline"
              >
                Clear Search
              </Button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Support Options */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground">Get in touch with our support team</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <motion.div
                key={option.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg bg-card hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <option.icon className={`w-12 h-12 mx-auto mb-4 ${option.color}`} />
                    <h3 className="font-semibold text-foreground mb-2">{option.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{option.description}</p>
                    <Button 
                      variant="outline" 
                      className="w-full"
                    >
                      {option.action}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">Additional Resources</h2>
            <p className="text-muted-foreground">More ways to get help and learn</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-primary" />
                  User Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive guide to using all features of DreamDesk platform.
                </p>
                <Button variant="outline">Read Guide</Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-primary" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Step-by-step video tutorials for common tasks and features.
                </p>
                <Button variant="outline">Watch Videos</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HelpCenter; 