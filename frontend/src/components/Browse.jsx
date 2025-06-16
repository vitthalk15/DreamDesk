import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { Search, Briefcase, AlertCircle } from 'lucide-react'

// const randomJobs = [1, 2,45];

const Browse = () => {
    useGetAllJobs();
    const {allJobs, searchedQuery} = useSelector(store=>store.job);
    const dispatch = useDispatch();
    
    useEffect(()=>{
        return ()=>{
            dispatch(setSearchedQuery(""));
        }
    },[dispatch])
    
    const filteredJobs = searchedQuery 
        ? allJobs.filter(job => 
            job.title.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job.description.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchedQuery.toLowerCase()) ||
            job.company?.name.toLowerCase().includes(searchedQuery.toLowerCase())
          )
        : allJobs;
    
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className='max-w-7xl mx-auto px-4 py-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Search className="w-6 h-6 text-primary" />
                        <h1 className='text-3xl font-bold text-foreground'>
                            {searchedQuery ? `Search Results for "${searchedQuery}"` : 'Browse All Jobs'}
                        </h1>
                    </div>
                    <p className="text-muted-foreground">
                        {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
                    </p>
                </motion.div>
                
                {filteredJobs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-16"
                    >
                        <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            {searchedQuery ? 'No jobs found' : 'No jobs available'}
                        </h3>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            {searchedQuery 
                                ? `No jobs match your search for "${searchedQuery}". Try adjusting your search terms.`
                                : 'There are currently no job postings available. Please check back later.'
                            }
                        </p>
                    </motion.div>
                ) : (
                    <motion.div 
                        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        {filteredJobs.map((job, index) => (
                            <motion.div
                                key={job._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Job job={job} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Browse