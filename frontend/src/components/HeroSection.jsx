import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { Search, Briefcase, Users, TrendingUp, Sparkles } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { allJobs } = useSelector(store => store.job);

    const searchJobHandler = () => {
        if (query.trim()) {
            dispatch(setSearchedQuery(query));
            navigate("/browse");
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            searchJobHandler();
        }
    }

    // Calculate real stats from data
    const totalJobs = allJobs.length;
    const totalApplications = allJobs.reduce((sum, job) => sum + (job.applications?.length || 0), 0);
    const successRate = totalJobs > 0 ? Math.round((totalApplications / totalJobs) * 100) : 0;

    const stats = [
        { 
            icon: Briefcase, 
            value: `${totalJobs}+`, 
            label: "Active Jobs",
            description: "Available positions"
        },
        { 
            icon: Users, 
            value: `${totalApplications}+`, 
            label: "Total Applications",
            description: "Job applications"
        },
        { 
            icon: TrendingUp, 
            value: `${successRate}%`, 
            label: "Engagement Rate",
            description: "Application per job"
        }
    ];

    return (
        <section className="relative overflow-hidden py-20 px-4">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
            
            {/* Floating Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    animate={{ 
                        y: [0, -20, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{ 
                        duration: 6, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
                />
                <motion.div
                    animate={{ 
                        y: [0, 20, 0],
                        rotate: [0, -5, 0]
                    }}
                    transition={{ 
                        duration: 8, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                    }}
                    className="absolute top-40 right-20 w-32 h-32 bg-purple-500/10 rounded-full blur-xl"
                />
            </div>

            <div className="relative max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm border border-primary/20">
                        <Sparkles className="w-4 h-4" />
                        Your #1 Job Search Destination
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
                >
                    Search, Apply & <br />
                    <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Get Your Dream Jobs
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
                >
                    Discover thousands of job opportunities with all the information you need. 
                    Your future starts here.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="flex flex-col sm:flex-row w-full max-w-2xl mx-auto mb-12"
                >
                    <div className="relative flex-1">
                        <div className="relative flex items-center bg-background border border-border rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <Search className="absolute left-4 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Find your dream jobs..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                            />
                            <Button 
                                onClick={searchJobHandler}
                                className="rounded-r-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 mr-1 my-1"
                                disabled={!query.trim()}
                            >
                                <Search className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                            className="text-center p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg"
                        >
                            <stat.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                            <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                            <div className="text-xs text-muted-foreground/70 mt-1">{stat.description}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

export default HeroSection