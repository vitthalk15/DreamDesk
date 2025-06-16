import React from 'react'
import { motion } from 'framer-motion'
import Job from './Job';
import { useSelector } from 'react-redux'; 
import { Briefcase, AlertCircle, IndianRupee } from 'lucide-react'
import { Button } from './ui/button'
import { Bookmark, Calendar, MapPin } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

// const randomJobs = [1, 2, 3, 4, 5, 6, 7, 8];

const LatestJobs = () => {
    const {allJobs} = useSelector(store=>store.job);
    const navigate = useNavigate();
   
    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
        <div className='max-w-7xl mx-auto px-4 py-20'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>
                    <span className='text-primary'>Latest & Top </span> 
                    <span className="text-foreground">Job Openings</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Discover the most recent and trending job opportunities from top companies
                </p>
            </motion.div>
            
            {allJobs.length <= 0 ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16"
                >
                    <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">No jobs available</h3>
                    <p className="text-muted-foreground">Check back later for new opportunities</p>
                </motion.div>
            ) : (
                <motion.div 
                    className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    {allJobs.slice(0, 6).map((job, index) => (
                        <motion.div
                            key={job._id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                        >
                            <Job job={job} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    )
}

export default LatestJobs