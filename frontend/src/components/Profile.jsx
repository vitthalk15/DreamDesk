import React, { useState, useEffect } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText, MapPin, Phone, User2, Camera } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { useSelector } from 'react-redux'
import { useNotification } from './providers/NotificationProvider'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import RoleSwitch from './RoleSwitch'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'
import { Link, useNavigate } from 'react-router-dom'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    useGetAppliedJobs();
    const [open, setOpen] = useState(false);
    const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const {user} = useSelector(store=>store.auth);
    const { showSuccess, showError } = useNotification();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Check if user is authenticated
    useEffect(() => {
        if (!user) {
            showError('Please login to access your profile', 'auth_required');
            navigate('/login');
        }
    }, [user, navigate, showError]);

    // If user is not authenticated, don't render the component
    if (!user) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className='max-w-4xl mx-auto bg-card border border-border rounded-2xl my-8 p-8 shadow-lg'>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-card-foreground mb-4">Authentication Required</h1>
                        <p className="text-muted-foreground mb-4">Please login to access your profile</p>
                        <Button onClick={() => navigate('/login')} className="bg-primary text-primary-foreground">
                            Go to Login
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showError('Please select an image file', 'photo_validation');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showError('Image size should be less than 5MB', 'photo_size');
                return;
            }
            setSelectedPhoto(file);
            setPhotoDialogOpen(true);
        }
    };

    const handlePhotoUpload = async () => {
        if (!selectedPhoto) return;
        
        // Double check authentication before upload
        if (!user) {
            showError('Please login to update your profile photo', 'auth_required');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append("profilePhoto", selectedPhoto);
        
        try {
            setUploadingPhoto(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess('Profile photo updated successfully', 'photo_update');
                setPhotoDialogOpen(false);
                setSelectedPhoto(null);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                showError('Session expired. Please login again', 'session_expired');
                navigate('/login');
            } else {
                showError(error.response?.data?.message || 'Failed to update profile photo', 'photo_update_error');
            }
        } finally {
            setUploadingPhoto(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className='w-full bg-card border border-border rounded-2xl my-8 shadow-lg'>
                <div className='p-8'>
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                        {/* Profile Info */}
                        <div className='lg:col-span-2 space-y-6'>
                            <div className='bg-card border border-border rounded-lg p-6 shadow-lg'>
                                <div className='flex items-center gap-4 mb-6'>
                                    <div className="relative">
                                        <Avatar className="h-16 w-16">
                                            <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                                        </Avatar>
                                        <label htmlFor="photo-upload" className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90 transition-colors">
                                            <Camera className="w-3 h-3" />
                                        </label>
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </div>
                                    <div className='flex-1'>
                                        <h1 className='text-2xl font-bold text-card-foreground'>{user?.fullname}</h1>
                                        <p className='text-muted-foreground'>{user?.email}</p>
                                        <Badge className={`mt-2 ${
                                            user?.role === 'student' 
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                                        }`}>
                                            {user?.role === 'student' ? 'Job Seeker' : 'Recruiter'}
                                        </Badge>
                                    </div>
                                    <Button onClick={() => setOpen(true)} variant="outline" size="sm">
                                        <Pen className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>

                                <div className='space-y-4'>
                                    <h2 className='font-semibold text-lg text-card-foreground'>Personal Information</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Contact className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Full Name</p>
                                                <p className="font-medium text-card-foreground">{user?.fullname}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Mail className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <p className="font-medium text-card-foreground">{user?.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <Phone className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Phone</p>
                                                <p className="font-medium text-card-foreground">{user?.phoneNumber || "Not provided"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                            <User2 className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Role</p>
                                                <Badge className={`${
                                                    user?.role === 'student' 
                                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                                                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                                                }`}>
                                                    {user?.role === 'student' ? 'Job Seeker' : 'Recruiter'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='space-y-4 mt-6'>
                                    <h2 className='font-semibold text-lg text-card-foreground'>Quick Actions</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Link to="/resume">
                                            <Button variant="outline" className="w-full">
                                                <FileText className="w-4 h-4 mr-2" />
                                                Manage Resume
                                            </Button>
                                        </Link>
                                        {user?.role === 'student' ? (
                                            <Link to="/applied-jobs">
                                                <Button variant="outline" className="w-full">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    View Applications
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link to="/admin">
                                                <Button variant="outline" className="w-full">
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Admin Dashboard
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Role Switch Component */}
                            <RoleSwitch />

                            {/* Applied Jobs Table - Only for students */}
                            {user?.role === 'student' && (
                                <div className='bg-card border border-border rounded-lg p-6 shadow-lg'>
                                    <h2 className='text-xl font-semibold text-card-foreground mb-6'>Applied Jobs</h2>
                                    <AppliedJobTable />
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className='lg:col-span-1 space-y-6'>
                            <div className='bg-card border border-border rounded-lg p-6 shadow-lg'>
                                <h3 className='text-lg font-semibold text-card-foreground mb-4'>Profile Stats</h3>
                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between'>
                                        <span className='text-muted-foreground'>Profile Completion</span>
                                        <span className='font-medium text-card-foreground'>85%</span>
                                    </div>
                                    <div className='w-full bg-muted rounded-full h-2'>
                                        <div className='bg-primary h-2 rounded-full' style={{ width: '85%' }}></div>
                                    </div>
                                    <div className='space-y-2 text-sm'>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                            <span className='text-muted-foreground'>Basic Info</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                            <span className='text-muted-foreground'>Contact Details</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                            <span className='text-muted-foreground'>Role</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                                            <span className='text-muted-foreground'>Resume</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Photo Upload Confirmation Dialog */}
            <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Camera className="w-5 h-5" />
                            Update Profile Photo
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage 
                                    src={selectedPhoto ? URL.createObjectURL(selectedPhoto) : user?.profile?.profilePhoto} 
                                    alt={user?.fullname} 
                                />
                            </Avatar>
                            <div>
                                <p className="font-medium text-card-foreground">New Profile Photo</p>
                                <p className="text-sm text-muted-foreground">{selectedPhoto?.name}</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-3">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                                setPhotoDialogOpen(false);
                                setSelectedPhoto(null);
                            }}
                            disabled={uploadingPhoto}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handlePhotoUpload}
                            disabled={uploadingPhoto}
                            className="flex items-center gap-2"
                        >
                            {uploadingPhoto ? (
                                <>
                                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Camera className="w-4 h-4" />
                                    Update Photo
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    )
}

export default Profile