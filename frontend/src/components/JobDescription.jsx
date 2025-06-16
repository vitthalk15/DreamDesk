import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarImage } from './ui/avatar'
import { MapPin, Calendar, IndianRupee, Users, Clock, Building, CheckCircle } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { JOB_API_END_POINT, APPLICATION_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useNotification } from './providers/NotificationProvider'

const JobDescription = () => {
    const [singleJob, setSingleJob] = useState(null);
    const [isApplying, setIsApplying] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { showSuccess, showError } = useNotification();

    useEffect(() => {
        const getSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${id}`);
                if (res.data.success) {
                    setSingleJob(res.data.job);
                } else {
                    showError('Failed to load job details', 'job_load_error');
                }
            } catch (error) {
                console.log(error);
                showError('Failed to load job details', 'job_load_error');
            }
        }
        getSingleJob();
    }, [id, showError]);

    const applyJobHandler = async () => {
        if (!user) {
            showError('Please login to apply for jobs', 'auth_required');
            navigate('/login');
            return;
        }

        setIsApplying(true);
        try {
            const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${id}`, {}, { withCredentials: true });
            if (res.data.success) {
                showSuccess(
                    `Successfully applied for ${singleJob?.title} at ${singleJob?.company?.name}`, 
                    'job_apply',
                    {
                        jobTitle: singleJob?.title,
                        companyName: singleJob?.company?.name,
                        jobId: singleJob?._id
                    }
                );
                // Update the job data to reflect the new application
                setSingleJob(prev => ({
                    ...prev,
                    applications: [...(prev.applications || []), { applicant: user._id }]
                }));
            }
        } catch (error) {
            console.log(error);
            const errorMessage = error.response?.data?.message || 'Failed to apply for job';
            showError(errorMessage, 'job_apply_error', {
                jobTitle: singleJob?.title,
                companyName: singleJob?.company?.name
            });
        } finally {
            setIsApplying(false);
        }
    }

    const isAlreadyApplied = singleJob?.applications?.some(app => app.applicant === user?._id);

    if (!singleJob) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="max-w-4xl mx-auto p-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-muted rounded w-1/3"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className='max-w-4xl mx-auto p-8'>
                <div className='bg-card border border-border rounded-2xl p-8 shadow-lg'>
                    {/* Header */}
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8'>
                        <div className='flex items-center gap-4'>
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={singleJob?.company?.logo} alt={singleJob?.company?.name} />
                            </Avatar>
                            <div>
                                <h1 className='text-2xl font-bold text-card-foreground'>{singleJob?.title}</h1>
                                <p className='text-lg text-muted-foreground'>{singleJob?.company?.name}</p>
                            </div>
                        </div>
                        {user?.role === 'student' && (
                            <div className="flex items-center gap-3">
                                {isAlreadyApplied && (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-medium">Already Applied</span>
                                    </div>
                                )}
                                <Button 
                                    onClick={applyJobHandler} 
                                    disabled={isApplying || isAlreadyApplied}
                                    className="bg-primary hover:bg-primary/90 disabled:opacity-50"
                                >
                                    {isApplying ? 'Applying...' : isAlreadyApplied ? 'Applied' : 'Apply Now'}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Job Details Grid */}
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
                        <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
                            <MapPin className='w-5 h-5 text-primary' />
                            <div>
                                <p className='text-sm text-muted-foreground'>Location</p>
                                <p className='font-medium text-card-foreground'>{singleJob?.location}</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
                            <IndianRupee className='w-5 h-5 text-primary' />
                            <div>
                                <p className='text-sm text-muted-foreground'>Salary</p>
                                <p className='font-medium text-card-foreground'>{singleJob?.salary} LPA</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
                            <Clock className='w-5 h-5 text-primary' />
                            <div>
                                <p className='text-sm text-muted-foreground'>Experience</p>
                                <p className='font-medium text-card-foreground'>{singleJob?.experience} years</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
                            <Users className='w-5 h-5 text-primary' />
                            <div>
                                <p className='text-sm text-muted-foreground'>Positions</p>
                                <p className='font-medium text-card-foreground'>{singleJob?.position}</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
                            <Building className='w-5 h-5 text-primary' />
                            <div>
                                <p className='text-sm text-muted-foreground'>Job Type</p>
                                <p className='font-medium text-card-foreground'>{singleJob?.jobType}</p>
                            </div>
                        </div>
                        
                        <div className='flex items-center gap-3 p-4 bg-muted/50 rounded-lg'>
                            <Calendar className='w-5 h-5 text-primary' />
                            <div>
                                <p className='text-sm text-muted-foreground'>Posted</p>
                                <p className='font-medium text-card-foreground'>{singleJob?.createdAt?.split("T")[0]}</p>
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className='space-y-6'>
                        <div>
                            <h2 className='text-xl font-semibold text-card-foreground mb-4'>Job Description</h2>
                            <div className='prose prose-gray dark:prose-invert max-w-none'>
                                <p className='text-muted-foreground leading-relaxed'>{singleJob?.description}</p>
                            </div>
                        </div>

                        {/* Application Stats */}
                        <div className='flex items-center gap-4 p-4 bg-primary/5 rounded-lg border border-primary/10'>
                            <Users className='w-5 h-5 text-primary' />
                            <div>
                                <p className='text-sm text-muted-foreground'>Total Applicants</p>
                                <p className='font-semibold text-card-foreground'>{singleJob?.applications?.length || 0}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobDescription