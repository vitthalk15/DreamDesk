import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useNotification } from '../providers/NotificationProvider'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
    Building2, 
    Briefcase, 
    Users, 
    FileText, 
    Plus, 
    Settings, 
    BarChart3,
    ArrowRight,
    Shield,
    RefreshCw
} from 'lucide-react'
import axios from 'axios'
import { JOB_API_END_POINT, APPLICATION_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant'

const AdminDashboard = () => {
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
        totalCompanies: 0
    });

    // Check if user is authenticated and is a recruiter
    useEffect(() => {
        if (!user) {
            showError('Please login to access admin dashboard', 'auth_required');
            navigate('/login');
        } else if (user.role !== 'recruiter') {
            showError('Only recruiters can access admin dashboard', 'role_restricted');
            navigate('/profile');
        }
    }, [user, navigate, showError]);

    // Fetch dashboard data
    useEffect(() => {
        if (user && user.role === 'recruiter') {
            fetchDashboardData();
            
            // Set up automatic refresh every 30 seconds for real-time updates
            const interval = setInterval(() => {
                fetchDashboardData();
            }, 30000); // Refresh every 30 seconds
            
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchDashboardData = async () => {
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

            setStats({
                totalJobs: jobs.length,
                activeJobs,
                totalApplications: applications.length,
                pendingApplications,
                totalCompanies: companies.length
            });

            setLastUpdated(new Date());

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            showError('Failed to load dashboard data', 'dashboard_error');
        } finally {
            setLoading(false);
        }
    };

    const refreshData = () => {
        fetchDashboardData();
        showSuccess('Dashboard data refreshed', 'dashboard_refresh');
    };

    // If user is not authenticated or not a recruiter, don't render
    if (!user || user.role !== 'recruiter') {
        return null;
    }

    const adminFeatures = [
        {
            title: 'Manage Companies',
            description: 'Create, edit, and manage your company profiles',
            icon: Building2,
            link: '/admin/companies',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/20',
            borderColor: 'border-blue-200 dark:border-blue-800'
        },
        {
            title: 'Post Jobs',
            description: 'Create and manage job listings for your company',
            icon: Briefcase,
            link: '/admin/jobs',
            color: 'text-green-600',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            borderColor: 'border-green-200 dark:border-green-800'
        },
        {
            title: 'View Applications',
            description: 'Review and manage job applications from candidates',
            icon: FileText,
            link: '/admin/jobs',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50 dark:bg-purple-950/20',
            borderColor: 'border-purple-200 dark:border-purple-800'
        },
        {
            title: 'Analytics',
            description: 'View insights and statistics about your job postings',
            icon: BarChart3,
            link: '/admin/analytics',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950/20',
            borderColor: 'border-orange-200 dark:border-orange-800'
        }
    ];

    const quickActions = [
        {
            title: 'Create Company',
            description: 'Set up a new company profile',
            icon: Plus,
            link: '/admin/companies/create',
            variant: 'default'
        },
        {
            title: 'Post New Job',
            description: 'Create a new job listing',
            icon: Briefcase,
            link: '/admin/jobs/create',
            variant: 'outline'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="w-full bg-card border border-border rounded-2xl my-8 shadow-lg">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-card-foreground">Admin Dashboard</h1>
                                <p className="text-muted-foreground">Manage your recruitment activities</p>
                                {lastUpdated && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Last updated: {lastUpdated.toLocaleTimeString()}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400">
                                Recruiter Access
                            </Badge>
                            <Button 
                                onClick={refreshData} 
                                variant="outline" 
                                disabled={loading}
                                className="flex items-center gap-2"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-card-foreground mb-4">Quick Actions</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                                <Link key={index} to={action.link}>
                                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                                    <action.icon className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-medium text-card-foreground">{action.title}</h3>
                                                    <p className="text-sm text-muted-foreground">{action.description}</p>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Admin Features */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-card-foreground mb-4">Admin Features</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {adminFeatures.map((feature, index) => (
                                <Link key={index} to={feature.link}>
                                    <Card className={`hover:shadow-md transition-all cursor-pointer border-2 ${feature.borderColor}`}>
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                                                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                                                </div>
                                                <CardTitle className="text-lg">{feature.title}</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <CardDescription className="text-sm">
                                                {feature.description}
                                            </CardDescription>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-card-foreground mb-4">Overview</h2>
                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <div className="flex items-center gap-3">
                                    <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                                    <span className="text-muted-foreground">Loading dashboard data...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 rounded-lg flex items-center justify-center">
                                                <Building2 className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Companies</p>
                                                <p className="text-2xl font-bold text-card-foreground">{stats.totalCompanies}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-green-50 dark:bg-green-950/20 rounded-lg flex items-center justify-center">
                                                <Briefcase className="w-6 h-6 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Active Jobs</p>
                                                <p className="text-2xl font-bold text-card-foreground">{stats.activeJobs}</p>
                                                <p className="text-xs text-muted-foreground">{stats.totalJobs} total jobs</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/20 rounded-lg flex items-center justify-center">
                                                <FileText className="w-6 h-6 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Applications</p>
                                                <p className="text-2xl font-bold text-card-foreground">{stats.totalApplications}</p>
                                                <p className="text-xs text-muted-foreground">{stats.pendingApplications} pending</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>

                    {/* Help Section */}
                    <div className="bg-muted/50 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-card-foreground mb-3">Need Help?</h3>
                        <p className="text-muted-foreground mb-4">
                            Get started by creating your first company profile and posting job opportunities.
                        </p>
                        <div className="flex gap-3">
                            <Button asChild>
                                <Link to="/admin/companies/create">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Company
                                </Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link to="/help">
                                    <Settings className="w-4 h-4 mr-2" />
                                    View Help
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard 