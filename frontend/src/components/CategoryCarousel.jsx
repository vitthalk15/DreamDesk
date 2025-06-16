import React from 'react';
import { motion } from 'framer-motion';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';
import { Briefcase, Code, Database, Palette, Globe, Cpu } from 'lucide-react';

const categories = [
    {
        name: "Frontend Developer",
        icon: Code,
        description: "React, Vue, Angular"
    },
    {
        name: "Backend Developer",
        icon: Database,
        description: "Node.js, Python, Java"
    },
    {
        name: "Data Science",
        icon: Cpu,
        description: "ML, AI, Analytics"
    },
    {
        name: "Graphic Designer",
        icon: Palette,
        description: "UI/UX, Creative"
    },
    {
        name: "FullStack Developer",
        icon: Globe,
        description: "End-to-end development"
    },
    {
        name: "DevOps Engineer",
        icon: Briefcase,
        description: "Cloud, CI/CD, Infrastructure"
    }
];

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const searchJobHandler = (category) => {
        dispatch(setSearchedQuery(category.name));
        navigate("/browse");
    }

    return (
        <div className="py-20">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Popular Job Categories
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Explore trending job categories and find your perfect match
                </p>
            </motion.div>
            
            <Carousel className="w-full max-w-6xl mx-auto">
                <CarouselContent className="-ml-2 md:-ml-4">
                    {categories.map((category, index) => (
                        <CarouselItem key={category.name} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                <Button 
                                    onClick={() => searchJobHandler(category)} 
                                    variant="outline" 
                                    className="w-full h-auto p-6 flex flex-col items-center gap-3 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
                                >
                                    <category.icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                    <div className="text-center">
                                        <div className="font-semibold text-base">{category.name}</div>
                                        <div className="text-xs text-muted-foreground group-hover:text-primary-foreground/80">
                                            {category.description}
                                        </div>
                                    </div>
                                </Button>
                            </motion.div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel