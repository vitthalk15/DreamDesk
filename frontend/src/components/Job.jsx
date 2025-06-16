import React from 'react'
import { Button } from './ui/button'
import { Bookmark, Calendar, MapPin, IndianRupee } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const Job = ({job}) => {
    const navigate = useNavigate();
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }
    
    return (
        <div className='p-6 rounded-lg shadow-lg bg-card border border-border hover:shadow-xl transition-all duration-300 hover:border-primary/30 group'>
            <div className='flex items-center justify-between mb-4'>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</span>
                </div>
                <Button variant="ghost" className="rounded-full hover:bg-muted" size="icon">
                    <Bookmark className="w-4 h-4" />
                </Button>
            </div>

            <div className='flex items-center gap-3 mb-4'>
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h1 className='font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors truncate'>
                        {job?.company?.name}
                    </h1>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span>{job?.location || "India"}</span>
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <h1 className='font-bold text-xl text-card-foreground mb-2 group-hover:text-primary transition-colors'>
                    {job?.title}
                </h1>
                <p className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
                    {job?.description}
                </p>
            </div>
            
            <div className='flex items-center gap-2 mb-4 flex-wrap'>
                <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 font-medium' variant="secondary">
                    {job?.position} Positions
                </Badge>
                <Badge className='bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 font-medium' variant="secondary">
                    {job?.jobType}
                </Badge>
                <Badge className='bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 font-medium' variant="secondary">
                    <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" />
                        {job?.salary} LPA
                    </div>
                </Badge>
            </div>
            
            <div className='flex items-center gap-3'>
                <Button 
                    onClick={()=> navigate(`/description/${job?._id}`)} 
                    variant="outline" 
                    className="flex-1 hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                    View Details
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                    Save Job
                </Button>
            </div>
        </div>
    )
}

export default Job