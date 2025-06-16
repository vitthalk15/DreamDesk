import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser } from '@/redux/authSlice'
import { Loader2, Mail, Lock, User } from 'lucide-react'
import { useNotification } from '../providers/NotificationProvider'

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showSuccess, showError } = useNotification();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.email || !input.password || !input.role) {
            showError('Please fill in all fields');
            return;
        }
        
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess(res.data.message, 'login', {
                    email: res.data.user.email,
                    role: res.data.user.role === 'student' ? 'Job Seeker' : 'Recruiter'
                });
                navigate("/");
            }
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || 'Login failed');
        } finally {
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
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className='w-full max-w-md'
                >
                    <div className='bg-card border border-border rounded-xl p-8 shadow-lg'>
                        <div className="text-center mb-8">
                            <h1 className='text-2xl font-bold text-card-foreground mb-2'>Welcome Back</h1>
                            <p className="text-muted-foreground">Sign in to your account</p>
                        </div>
                        
                        <form onSubmit={submitHandler} className='space-y-6'>
                            <div className='space-y-2'>
                                <Label className="text-foreground">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="email"
                                        value={input.email}
                                        name="email"
                                        onChange={changeEventHandler}
                                        placeholder="yours@gmail.com"
                                        className="pl-10"
                                    />
                                </div>
                            </div>

                            <div className='space-y-2'>
                                <Label className="text-foreground">Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="password"
                                        value={input.password}
                                        name="password"
                                        onChange={changeEventHandler}
                                        placeholder="*********"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            
                            <div className='space-y-3'>
                                <Label className="text-foreground">I am a</Label>
                                <RadioGroup 
                                    value={input.role} 
                                    onValueChange={(value) => setInput({...input, role: value})}
                                    className="flex items-center gap-6"
                                >
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="student" id="student" />
                                        <Label htmlFor="student" className="text-foreground cursor-pointer">Student</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="recruiter" id="recruiter" />
                                        <Label htmlFor="recruiter" className="text-foreground cursor-pointer">Recruiter</Label>
                                    </div>
                                </RadioGroup>
                            </div>
                            
                            <Button 
                                type="submit" 
                                className="w-full bg-primary hover:bg-primary/90" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' /> 
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>
                        
                        <div className="mt-6 text-center">
                            <span className='text-sm text-muted-foreground'>
                                Don't have an account?{' '}
                                <Link to="/signup" className='text-primary hover:text-primary/80 font-medium transition-colors'>
                                    Sign up
                                </Link>
                            </span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Login