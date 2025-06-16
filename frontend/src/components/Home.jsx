import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs();
  const { user } = useSelector(store => store.auth);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.role === 'recruiter') {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20"
    >
      <Navbar />
      
      <motion.div variants={itemVariants}>
        <HeroSection />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <CategoryCarousel />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <LatestJobs />
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Footer />
      </motion.div>
    </motion.div>
  )
}

export default Home