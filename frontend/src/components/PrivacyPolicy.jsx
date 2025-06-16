import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './shared/Navbar';
import Footer from './shared/Footer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Globe, 
  FileText,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      icon: Eye,
      title: "Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "We collect information you provide directly to us, such as when you create an account, apply for jobs, or contact us. This may include your name, email address, phone number, resume, work experience, education, and other professional information."
        },
        {
          subtitle: "Usage Information",
          text: "We automatically collect certain information about your use of our services, including your IP address, browser type, operating system, pages visited, time spent on pages, and other usage statistics."
        },
        {
          subtitle: "Device Information",
          text: "We may collect information about the device you use to access our services, including device type, operating system, browser type, and unique device identifiers."
        }
      ]
    },
    {
      icon: Users,
      title: "How We Use Your Information",
      content: [
        {
          subtitle: "Providing Services",
          text: "We use your information to provide, maintain, and improve our services, including job matching, application processing, and communication between job seekers and employers."
        },
        {
          subtitle: "Communication",
          text: "We use your contact information to send you important updates about your account, job applications, and relevant opportunities. You can opt out of marketing communications at any time."
        },
        {
          subtitle: "Analytics and Improvement",
          text: "We analyze usage patterns to improve our platform, develop new features, and provide better user experiences."
        }
      ]
    },
    {
      icon: Globe,
      title: "Information Sharing",
      content: [
        {
          subtitle: "With Employers",
          text: "When you apply for a job, we share your application information with the relevant employer. This includes your resume, cover letter, and any other information you provide during the application process."
        },
        {
          subtitle: "Service Providers",
          text: "We may share information with trusted third-party service providers who help us operate our platform, such as cloud hosting providers, email services, and analytics tools."
        },
        {
          subtitle: "Legal Requirements",
          text: "We may disclose your information if required by law, court order, or government request, or to protect our rights, property, or safety."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        {
          subtitle: "Encryption",
          text: "We use industry-standard encryption to protect your data both in transit and at rest. All sensitive information is encrypted using SSL/TLS protocols."
        },
        {
          subtitle: "Access Controls",
          text: "We implement strict access controls to ensure that only authorized personnel can access your personal information. All access is logged and monitored."
        },
        {
          subtitle: "Regular Security Audits",
          text: "We conduct regular security audits and assessments to identify and address potential vulnerabilities in our systems."
        }
      ]
    },
    {
      icon: Calendar,
      title: "Data Retention",
      content: [
        {
          subtitle: "Account Data",
          text: "We retain your account information for as long as your account is active or as needed to provide you services. You can delete your account at any time."
        },
        {
          subtitle: "Application Data",
          text: "Job application data is retained for a reasonable period to facilitate the hiring process and for legal compliance purposes."
        },
        {
          subtitle: "Analytics Data",
          text: "Aggregated and anonymized analytics data may be retained indefinitely for research and improvement purposes."
        }
      ]
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: [
        {
          subtitle: "Access and Update",
          text: "You have the right to access, update, or correct your personal information at any time through your account settings."
        },
        {
          subtitle: "Data Portability",
          text: "You can request a copy of your personal data in a structured, machine-readable format."
        },
        {
          subtitle: "Deletion",
          text: "You can request deletion of your personal information, subject to certain legal and contractual obligations."
        }
      ]
    }
  ];

  const contactInfo = {
    email: "privacy@dreamdesk.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Street, San Francisco, CA 94105"
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
              Privacy <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Policy</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              We are committed to protecting your privacy and ensuring the security of your personal information.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Last updated: {new Date().toLocaleDateString()}</span>
              <span>•</span>
              <span>Version 1.0</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <section.icon className="w-6 h-6 text-primary" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {section.content.map((item, idx) => (
                      <div key={idx}>
                        <h4 className="font-semibold text-foreground mb-2">{item.subtitle}</h4>
                        <p className="text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Cookies Policy */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-primary" />
                  Cookies and Tracking Technologies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We use cookies and similar tracking technologies to enhance your experience on our platform. 
                  These technologies help us remember your preferences, analyze usage patterns, and provide 
                  personalized content.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Essential Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      These cookies are necessary for the website to function properly and cannot be disabled.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Analytics Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      These cookies help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Marketing Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      These cookies are used to deliver relevant advertisements and track marketing campaigns.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Preference Cookies</h4>
                    <p className="text-sm text-muted-foreground">
                      These cookies remember your preferences and settings for a better experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Children's Privacy */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  Children's Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Our services are not intended for children under the age of 16. We do not knowingly collect 
                  personal information from children under 16. If we become aware that we have collected 
                  personal information from a child under 16, we will take steps to delete such information 
                  promptly.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* International Transfers */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-primary" />
                  International Data Transfers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Your information may be transferred to and processed in countries other than your own. 
                  We ensure that such transfers comply with applicable data protection laws and that your 
                  information receives adequate protection through appropriate safeguards.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Changes to Policy */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  Changes to This Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy from time to time to reflect changes in our practices 
                  or for other operational, legal, or regulatory reasons. We will notify you of any 
                  material changes by posting the new Privacy Policy on this page and updating the 
                  "Last updated" date.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-0 shadow-lg bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="w-6 h-6 text-primary" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Address</p>
                      <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy; 