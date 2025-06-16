import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2, Bell, Search, X, CheckCircle, AlertCircle, Info, AlertTriangle, Trash2, Shield, FileText } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import ThemeToggle from '../ui/theme-toggle'
import { useNotification } from '../providers/NotificationProvider'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { showSuccess, getUnreadCount, getRecentActions, markActionAsRead, clearAllActions, showError } = useNotification();
    const [notificationOpen, setNotificationOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                showSuccess(res.data.message, 'logout', {
                    userRole: user?.role,
                    userName: user?.fullname
                });
            }
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || 'Logout failed', 'logout_error');
        }
    }

    const isActiveRoute = (path) => {
        return location.pathname === path;
    }

    const getActionColor = (action) => {
        switch (action) {
            case 'login':
            case 'logout':
            case 'profile_update':
            case 'resume_upload':
                return 'text-blue-600 dark:text-blue-400'
            case 'job_apply':
            case 'job_save':
            case 'job_create':
            case 'job_delete':
                return 'text-green-600 dark:text-green-400'
            case 'company_create':
            case 'company_update':
                return 'text-purple-600 dark:text-purple-400'
            case 'application_status':
                return 'text-orange-600 dark:text-orange-400'
            default:
                return 'text-gray-600 dark:text-gray-400'
        }
    }

    const formatTimestamp = (timestamp) => {
        const now = new Date();
        const actionTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - actionTime) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }

    const unreadCount = getUnreadCount();
    const recentActions = getRecentActions(10);

    return (
        <nav className='sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border transition-colors duration-300'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div className='flex items-center space-x-8'>
                    <Link to="/" className='flex items-center space-x-2'>
                        <h1 className='text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>
                            Dream<span className='text-[#F83002]'>Desk</span>
                        </h1>
                    </Link>
                    
                    {user && (
                        <div className='hidden md:flex items-center space-x-6'>
                            {user.role === 'recruiter' ? (
                                <>
                                    <Link 
                                        to="/admin/companies" 
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            isActiveRoute('/admin/companies') 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    >
                                        Companies
                                    </Link>
                                    <Link 
                                        to="/admin/jobs" 
                                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                            isActiveRoute('/admin/jobs') 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                                        }`}
                                    >
                                        Jobs
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <NavLink 
                                        to="/" 
                                        className={({ isActive }) => 
                                            `text-sm font-medium transition-colors hover:text-blue-600 ${
                                                isActive 
                                                    ? 'text-blue-600 border-b-2 border-blue-600' 
                                                    : 'text-muted-foreground'
                                            }`
                                        }
                                    >
                                        Home
                                    </NavLink>
                                    <NavLink 
                                        to="/jobs" 
                                        className={({ isActive }) => 
                                            `text-sm font-medium transition-colors hover:text-blue-600 ${
                                                isActive 
                                                    ? 'text-blue-600 border-b-2 border-blue-600' 
                                                    : 'text-muted-foreground'
                                            }`
                                        }
                                    >
                                        Jobs
                                    </NavLink>
                                    <NavLink 
                                        to="/browse" 
                                        className={({ isActive }) => 
                                            `text-sm font-medium transition-colors hover:text-blue-600 ${
                                                isActive 
                                                    ? 'text-blue-600 border-b-2 border-blue-600' 
                                                    : 'text-muted-foreground'
                                            }`
                                        }
                                    >
                                        Browse
                                    </NavLink>
                                    <NavLink 
                                        to="/internships" 
                                        className={({ isActive }) => 
                                            `text-sm font-medium transition-colors hover:text-blue-600 ${
                                                isActive 
                                                    ? 'text-blue-600 border-b-2 border-blue-600' 
                                                    : 'text-muted-foreground'
                                            }`
                                        }
                                    >
                                        Internships
                                    </NavLink>
                                    <NavLink 
                                        to="/resume" 
                                        className={({ isActive }) => 
                                            `text-sm font-medium transition-colors hover:text-blue-600 ${
                                                isActive 
                                                    ? 'text-blue-600 border-b-2 border-blue-600' 
                                                    : 'text-muted-foreground'
                                            }`
                                        }
                                    >
                                        Resume
                                    </NavLink>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className='flex items-center space-x-4'>
                    {/* Search Bar */}
                    <div className='hidden md:flex items-center space-x-2 bg-accent rounded-md px-3 py-2'>
                        <Search className='w-4 h-4 text-muted-foreground' />
                        <input 
                            type="text" 
                            placeholder="Search jobs..." 
                            className='bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground'
                        />
                    </div>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Notifications */}
                    {user && (
                        <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="relative">
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 p-0" align="end">
                                <div className="border-b border-border p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-semibold text-foreground">Notifications</h3>
                                        <div className="flex items-center gap-2">
                                            {unreadCount > 0 && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => {
                                                        markAllAsRead();
                                                        setNotificationOpen(false);
                                                    }}
                                                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                                >
                                                    Mark all read
                                                </Button>
                                            )}
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={clearAllActions}
                                                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => setNotificationOpen(false)}
                                                className="h-8 px-2 text-muted-foreground hover:text-foreground"
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="max-h-96 overflow-y-auto">
                                    {recentActions.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <Bell className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">No notifications yet</p>
                                        </div>
                                    ) : (
                                        <div className="divide-y divide-border">
                                            {recentActions.map((action) => (
                                                <div 
                                                    key={action.id}
                                                    className={`p-4 hover:bg-muted/50 transition-colors cursor-pointer ${
                                                        !action.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''
                                                    }`}
                                                    onClick={() => {
                                                        markActionAsRead(action.id);
                                                        setNotificationOpen(false);
                                                    }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-0.5 ${getActionColor(action.type)}`}>
                                                            <span className="text-lg">{action.icon}</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium text-foreground">
                                                                {action.title}
                                                            </p>
                                                            {action.description && (
                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                    {action.description}
                                                                </p>
                                                            )}
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {formatTimestamp(action.timestamp)}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {!action.read && (
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    markActionAsRead(action.id);
                                                                }}
                                                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <CheckCircle className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    {/* Auth Buttons / User Menu */}
                    {!user ? (
                        <div className='flex items-center space-x-2'>
                            <Link to="/login">
                                <Button variant="outline" className="hidden sm:inline-flex">
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup">
                                <Button className="bg-gradient-to-r from-[#6A38C2] to-[#8B5CF6] hover:from-[#5b30a6] hover:to-[#7C3AED] transition-all duration-300">
                                    Signup
                                </Button>
                            </Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all duration-300">
                                    <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                    </Avatar>
                                </PopoverTrigger>
                            <PopoverContent className="w-80 p-4" align="end">
                                <div className='space-y-4'>
                                    <div className='flex items-center space-x-3'>
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                            </Avatar>
                                        <div className='flex-1 min-w-0'>
                                            <h4 className='font-semibold text-foreground truncate'>{user?.fullname}</h4>
                                            <p className='text-sm text-muted-foreground truncate'>{user?.email}</p>
                                            {user?.profile?.bio && (
                                                <p className='text-xs text-muted-foreground mt-1 line-clamp-2'>{user.profile.bio}</p>
                                            )}
                                        </div>
                                                    </div>
                                    
                                    <div className='border-t border-border pt-3 space-y-2'>
                                        <Button 
                                            variant="ghost" 
                                            className="w-full justify-start" 
                                            onClick={() => navigate('/profile')}
                                        >
                                            <User2 className="w-4 h-4 mr-2" />
                                            View Profile
                                        </Button>
                                        
                                        {user.role === 'recruiter' && (
                                            <Button 
                                                variant="ghost" 
                                                className="w-full justify-start" 
                                                onClick={() => navigate('/admin')}
                                            >
                                                <Shield className="w-4 h-4 mr-2" />
                                                Admin Dashboard
                                            </Button>
                                        )}
                                        
                                        {user.role === 'student' && (
                                            <Button 
                                                variant="ghost" 
                                                className="w-full justify-start" 
                                                onClick={() => navigate('/applied-jobs')}
                                            >
                                                <FileText className="w-4 h-4 mr-2" />
                                                My Applications
                                            </Button>
                                        )}
                                        
                                        <Button 
                                            variant="ghost" 
                                            className="w-full justify-start text-destructive hover:text-destructive" 
                                            onClick={logoutHandler}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                            </Popover>
                    )}
                </div>
            </div>
        </nav>
    )
}

export default Navbar