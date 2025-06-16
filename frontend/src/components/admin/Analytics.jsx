import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../providers/NotificationProvider'
import Navbar from '../shared/Navbar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
    BarChart3, 
    TrendingUp, 
    Users, 
    Briefcase, 
    FileText, 
    Building2,
    Calendar,
    Eye,
    Download,
    RefreshCw
} from 'lucide-react'
import axios from 'axios'
import { JOB_API_END_POINT, APPLICATION_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant'

const Analytics = () => {
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const { showError, showSuccess } = useNotification();
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        approvedApplications: 0,
        rejectedApplications: 0,
        totalCompanies: 0,
        monthlyApplications: [],
        jobViews: 0
    });

    // Check if user is authenticated and is a recruiter
    useEffect(() => {
        if (!user) {
            showError('Please login to access analytics', 'auth_required');
            navigate('/login');
        } else if (user.role !== 'recruiter') {
            showError('Only recruiters can access analytics', 'role_restricted');
            navigate('/profile');
        }
    }, [user, navigate, showError]);

    // Fetch analytics data
    useEffect(() => {
        if (user && user.role === 'recruiter') {
            fetchAnalytics();
            
            // Set up automatic refresh every 30 seconds for real-time updates
            const interval = setInterval(() => {
                fetchAnalytics();
            }, 30000); // Refresh every 30 seconds
            
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            
            // Fetch jobs data
            const jobsRes = await axios.get(`${JOB_API_END_POINT}/get`, {
                withCredentials: true
            });

            // Fetch applications data
            const applicationsRes = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
                withCredentials: true
            });

            // Fetch companies data
            const companiesRes = await axios.get(`${COMPANY_API_END_POINT}/get`, {
                withCredentials: true
            });

            // Process the data
            const jobs = jobsRes.data.jobs || [];
            const applications = applicationsRes.data.application || [];
            const companies = companiesRes.data.companies || [];

            // Calculate statistics
            const activeJobs = jobs.filter(job => job.status === 'active').length;
            const pendingApplications = applications.filter(app => app.status === 'pending').length;
            const approvedApplications = applications.filter(app => app.status === 'approved').length;
            const rejectedApplications = applications.filter(app => app.status === 'rejected').length;

            // Generate monthly applications data (last 6 months)
            const monthlyData = generateMonthlyData(applications);

            setStats({
                totalJobs: jobs.length,
                activeJobs,
                totalApplications: applications.length,
                pendingApplications,
                approvedApplications,
                rejectedApplications,
                totalCompanies: companies.length,
                monthlyApplications: monthlyData,
                jobViews: jobs.reduce((total, job) => total + (job.views || 0), 0)
            });

            setLastUpdated(new Date());

        } catch (error) {
            console.error('Error fetching analytics:', error);
            showError('Failed to load analytics data', 'analytics_error');
        } finally {
            setLoading(false);
        }
    };

    const generateMonthlyData = (applications) => {
        const months = [];
        const currentDate = new Date();
        
        for (let i = 5; i >= 0; i--) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
            const monthName = date.toLocaleString('default', { month: 'short' });
            const year = date.getFullYear();
            
            // Count applications for this month
            const monthApplications = applications.filter(app => {
                const appDate = new Date(app.createdAt);
                return appDate.getMonth() === date.getMonth() && appDate.getFullYear() === date.getFullYear();
            }).length;

            months.push({
                month: monthName,
                year,
                applications: monthApplications
            });
        }

        return months;
    };

    const refreshData = () => {
        fetchAnalytics();
        showSuccess('Analytics data refreshed', 'analytics_refresh');
    };

    // If user is not authenticated or not a recruiter, don't render
    if (!user || user.role !== 'recruiter') {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="w-full bg-card border border-border rounded-2xl my-8 shadow-lg">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <BarChart3 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-card-foreground">Analytics Dashboard</h1>
                                <p className="text-muted-foreground">Track your recruitment performance</p>
                                {lastUpdated && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Last updated: {lastUpdated.toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button 
                                onClick={refreshData} 
                                variant="outline" 
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                Export
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="flex items-center gap-3">
                                <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                                <span className="text-muted-foreground">Loading analytics...</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-card-foreground">{stats.totalJobs}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {stats.activeJobs} active jobs
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-card-foreground">{stats.totalApplications}</div>
                                        <p className="text-xs text-muted-foreground">
                                            {stats.pendingApplications} pending
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Companies</CardTitle>
                                        <Building2 className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-card-foreground">{stats.totalCompanies}</div>
                                        <p className="text-xs text-muted-foreground">
                                            Active companies
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Job Views</CardTitle>
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-card-foreground">{stats.jobViews}</div>
                                        <p className="text-xs text-muted-foreground">
                                            Total views
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Application Status */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Application Status</CardTitle>
                                        <CardDescription>Overview of application statuses</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                                    <span className="text-sm">Pending</span>
                                                </div>
                                                <Badge variant="secondary">{stats.pendingApplications}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                    <span className="text-sm">Approved</span>
                                                </div>
                                                <Badge variant="secondary">{stats.approvedApplications}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                                    <span className="text-sm">Rejected</span>
                                                </div>
                                                <Badge variant="secondary">{stats.rejectedApplications}</Badge>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Monthly Applications</CardTitle>
                                        <CardDescription>Applications over the last 6 months</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {stats.monthlyApplications.map((month, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <span className="text-sm font-medium">
                                                        {month.month} {month.year}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                                                            <div 
                                                                className="h-full bg-primary transition-all duration-300"
                                                                style={{ 
                                                                    width: `${Math.max((month.applications / Math.max(...stats.monthlyApplications.map(m => m.applications), 1)) * 100, 5)}%` 
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm text-muted-foreground w-8 text-right">
                                                            {month.applications}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Performance Insights */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Performance Insights</CardTitle>
                                    <CardDescription>Key metrics and trends</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-card-foreground">
                                                {stats.totalJobs > 0 ? Math.round((stats.activeJobs / stats.totalJobs) * 100) : 0}%
                                            </div>
                                            <p className="text-sm text-muted-foreground">Job Activity Rate</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-card-foreground">
                                                {stats.totalApplications > 0 ? Math.round((stats.approvedApplications / stats.totalApplications) * 100) : 0}%
                                            </div>
                                            <p className="text-sm text-muted-foreground">Approval Rate</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-card-foreground">
                                                {stats.totalJobs > 0 ? Math.round(stats.jobViews / stats.totalJobs) : 0}
                                            </div>
                                            <p className="text-sm text-muted-foreground">Avg. Views per Job</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Analytics 