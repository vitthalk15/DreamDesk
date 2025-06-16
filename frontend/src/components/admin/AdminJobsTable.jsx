import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal, Edit2, Trash2, Users, IndianRupee, Calendar, MapPin, Building2, Eye, Briefcase } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../providers/NotificationProvider'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'

const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);
    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();
    const [deletingJob, setDeletingJob] = useState(null);

    useEffect(()=>{ 
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            };
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || 
                   job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase());
        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs, searchJobByText]);
    
    if (filterJobs.length === 0) {
        return (
            <div className="text-center py-12">
                <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No jobs found</h3>
                <p className="text-muted-foreground">
                    {searchJobByText ? 'No jobs match your search criteria.' : 'Start by creating your first job posting.'}
                </p>
            </div>
        );
    }
    
    const deleteJobHandler = async (jobId) => {
        try {
            setDeletingJob(jobId);
            const res = await axios.delete(`${JOB_API_END_POINT}/${jobId}`, { withCredentials: true });
            if (res.data.success) {
                showSuccess('Job deleted successfully', 'job_delete');
                // Refresh the page or reload jobs
                window.location.reload();
            }
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || 'Failed to delete job', 'job_delete_error');
        } finally {
            setDeletingJob(null);
        }
    }

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
                <TableCaption className="py-4 text-muted-foreground">
                    A list of your recent posted jobs
                </TableCaption>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Job Details</TableHead>
                        <TableHead className="font-semibold">Company</TableHead>
                        <TableHead className="font-semibold">Location</TableHead>
                        <TableHead className="font-semibold">Salary</TableHead>
                        <TableHead className="font-semibold">Type</TableHead>
                        <TableHead className="font-semibold">Applications</TableHead>
                        <TableHead className="font-semibold">Posted</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filterJobs?.map((job) => (
                        <TableRow key={job._id} className="hover:bg-muted/30 transition-colors">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name} />
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-semibold text-card-foreground truncate">{job?.title}</h4>
                                        <p className="text-sm text-muted-foreground truncate">{job?.description}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-card-foreground">{job?.company?.name}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-card-foreground">{job?.location}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-1">
                                    <IndianRupee className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    <span className="font-medium text-card-foreground">{job?.salary} LPA</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge 
                                    className={`${
                                        job?.jobType === 'Full Time' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
                                        job?.jobType === 'Part Time' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400' :
                                        job?.jobType === 'Internship' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' :
                                        'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400'
                                    }`}
                                >
                                    {job?.jobType}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="font-medium text-card-foreground">{job?.applications?.length || 0}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-card-foreground">
                                        {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/description/${job._id}`)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Users className="w-4 h-4" />
                                    </Button>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-2" align="end">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/admin/jobs/edit/${job._id}`)}
                                                className="w-full justify-start h-8"
                                            >
                                                <Edit2 className="w-4 h-4 mr-2" />
                                                Edit Job
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => deleteJobHandler(job._id)}
                                                disabled={deletingJob === job._id}
                                                className="w-full justify-start h-8 text-destructive hover:text-destructive"
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                {deletingJob === job._id ? 'Deleting...' : 'Delete Job'}
                                            </Button>
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable