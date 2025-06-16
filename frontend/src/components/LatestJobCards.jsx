import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
        <div 
            onClick={()=> navigate(`/description/${job._id}`)} 
            className='p-6 rounded-lg shadow-lg bg-card border border-border cursor-pointer hover:shadow-xl transition-all duration-300 hover:border-primary/30 group'
        >
            <div className="mb-4">
                <h1 className='font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors'>
                    {job?.company?.name}
                </h1>
                <p className='text-sm text-muted-foreground'>India</p>
            </div>
            <div className="mb-4">
                <h1 className='font-bold text-xl text-card-foreground mb-2 group-hover:text-primary transition-colors'>
                    {job?.title}
                </h1>
                <p className='text-sm text-muted-foreground line-clamp-2'>
                    {job?.description}
                </p>
            </div>
            <div className='flex items-center gap-2 flex-wrap'>
                <Badge className='bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 font-medium' variant="secondary">
                    {job?.position} Positions
                </Badge>
                <Badge className='bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 font-medium' variant="secondary">
                    {job?.jobType}
                </Badge>
                <Badge className='bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/20 dark:text-purple-400 font-medium' variant="secondary">
                    {job?.salary}LPA
                </Badge>
            </div>
        </div>
    )
}

export default LatestJobCards