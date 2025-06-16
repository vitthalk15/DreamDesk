import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2, User, Mail, Phone, Lock, Camera, GraduationCap, Building2 } from 'lucide-react'
import { useNotification } from '../providers/NotificationProvider'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: null
    });
    const {loading, user} = useSelector(store=>store.auth);
    const { showSuccess, showError } = useNotification();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    
    const changeFileHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showError('Please select an image file', 'file_validation_error');
                return;
            }
            // Validate file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                showError('File size should be less than 2MB', 'file_size_error');
                return;
            }
            setInput({ ...input, file });
        }
    }
    
    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!input.fullname.trim() || !input.email.trim() || !input.phoneNumber.trim() || !input.password.trim() || !input.role) {
            showError('Please fill in all required fields', 'validation_error');
            return;
        }
        
        if (input.password.length < 6) {
            showError('Password must be at least 6 characters long', 'password_validation_error');
            return;
        }
        
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                showSuccess('Account created successfully! Please login.', 'register', {
                    role: input.role === 'student' ? 'Job Seeker' : 'Recruiter'
                });
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || 'Registration failed', 'registration_error');
        } finally{
            dispatch(setLoading(false));
        }
    }

    useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[user, navigate])
    
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className='flex items-center justify-center min-h-[calc(100vh-4rem)] px-4'>
                <div className='w-full max-w-md'>
                    <div className='bg-card border border-border rounded-lg p-8 shadow-lg'>
                        <div className="text-center mb-6">
                            <h1 className='text-2xl font-bold text-card-foreground mb-2'>Create Account</h1>
                            <p className="text-muted-foreground">Join DreamDesk to find your dream job or hire talent</p>
                        </div>
                        
                        <form onSubmit={submitHandler} className='space-y-4'>
                            <div className='space-y-2'>
                                <Label htmlFor="fullname" className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Full Name
                                </Label>
                                <Input
                                    id="fullname"
                                    type="text"
                                    value={input.fullname}
                                    name="fullname"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                            
                            <div className='space-y-2'>
                                <Label htmlFor="email" className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            
                            <div className='space-y-2'>
                                <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Phone Number
                                </Label>
                                <Input
                                    id="phoneNumber"
                                    type="tel"
                                    value={input.phoneNumber}
                                    name="phoneNumber"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your phone number"
                                    required
                                />
                            </div>
                            
                            <div className='space-y-2'>
                                <Label htmlFor="password" className="flex items-center gap-2">
                                    <Lock className="w-4 h-4" />
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            
                            <div className='space-y-3'>
                                <Label className="text-sm font-medium">Select Your Role</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div 
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            input.role === 'student' 
                                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                                                : 'border-border hover:border-blue-300'
                                        }`}
                                        onClick={() => setInput({...input, role: 'student'})}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <GraduationCap className="w-5 h-5 text-blue-600" />
                                            <span className="font-medium">Job Seeker</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Looking for job opportunities</p>
                                    </div>
                                    
                                    <div 
                                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                            input.role === 'recruiter' 
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                                                : 'border-border hover:border-purple-300'
                                        }`}
                                        onClick={() => setInput({...input, role: 'recruiter'})}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Building2 className="w-5 h-5 text-purple-600" />
                                            <span className="font-medium">Recruiter</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground">Hiring for your company</p>
                                    </div>
                                </div>
                                
                                {input.role && (
                                    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                                        <Badge className={`${
                                            input.role === 'student' 
                                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                                                : 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                                        }`}>
                                            {input.role === 'student' ? 'Job Seeker' : 'Recruiter'}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground">selected</span>
                                    </div>
                                )}
                            </div>
                            
                            <div className='space-y-2'>
                                <Label htmlFor="profile-photo" className="flex items-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    Profile Photo (Optional)
                                </Label>
                                <Input
                                    id="profile-photo"
                                    accept="image/*"
                                    type="file"
                                    onChange={changeFileHandler}
                                    className="cursor-pointer"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Max size: 2MB. Supported formats: JPG, PNG, GIF
                                </p>
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full" 
                                disabled={loading || !input.role}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <p className='text-sm text-muted-foreground'>
                                Already have an account?{' '}
                                <Link to="/login" className='text-primary hover:underline font-medium'>
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup