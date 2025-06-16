import React from 'react'
import Navbar from './shared/Navbar'
import AppliedJobTable from './AppliedJobTable'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useNotification } from './providers/NotificationProvider'
import { useEffect } from 'react'

const AppliedJobs = () => {
    useGetAppliedJobs();
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const { showError } = useNotification();

    // Check if user is authenticated and is a student
    useEffect(() => {
        if (!user) {
            showError('Please login to view your applications', 'auth_required');
            navigate('/login');
        } else if (user.role !== 'student') {
            showError('Only students can view job applications', 'role_restricted');
            navigate('/profile');
        }
    }, [user, navigate, showError]);

    // If user is not authenticated or not a student, don't render
    if (!user || user.role !== 'student') {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="w-full bg-card border border-border rounded-2xl my-8 shadow-lg">
                <div className="p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-card-foreground mb-2">My Applications</h1>
                        <p className="text-muted-foreground">
                            Track the status of your job applications and stay updated on your progress.
                        </p>
                    </div>
                    
                    <AppliedJobTable />
                </div>
            </div>
        </div>
    )
}

export default AppliedJobs 