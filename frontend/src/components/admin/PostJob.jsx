import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useSelector } from 'react-redux'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import axios from 'axios'
import { JOB_API_END_POINT } from '@/utils/constant'
import { useNavigate } from 'react-router-dom'
import { Loader2, Briefcase, Building2, AlertCircle } from 'lucide-react'
import { useNotification } from '../providers/NotificationProvider'

const PostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        companyId: ""
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showSuccess, showError } = useNotification();

    const { companies } = useSelector(store => store.company);
    
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        setInput({...input, companyId: selectedCompany._id});
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!input.title.trim() || !input.description.trim() || !input.companyId) {
            showError('Please fill in all required fields', 'validation_error');
            return;
        }
        
        try {
            setLoading(true);
            const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                showSuccess('Job posted successfully', 'job_create', {
                    jobTitle: input.title,
                    jobType: input.jobType,
                    companyId: input.companyId
                });
                navigate("/admin/jobs");
            }
        } catch (error) {
            showError(error.response?.data?.message || 'Failed to post job', 'job_create_error', {
                jobTitle: input.title
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-6 h-6 text-primary" />
                        <h1 className='text-3xl font-bold text-foreground'>Post New Job</h1>
                    </div>
                    <p className="text-muted-foreground">Create a new job posting for your company</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-card border border-border rounded-lg p-8 shadow-lg"
                >
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={input.title}
                                    onChange={changeEventHandler}
                                    placeholder="e.g., Senior React Developer"
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                    id="location"
                                    name="location"
                                    type="text"
                                    value={input.location}
                                    onChange={changeEventHandler}
                                    placeholder="e.g., New York, NY"
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="salary">Salary (LPA) *</Label>
                                <Input
                                    id="salary"
                                    name="salary"
                                    type="number"
                                    value={input.salary}
                                    onChange={changeEventHandler}
                                    placeholder="e.g., 15"
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="experience">Experience (Years) *</Label>
                                <Input
                                    id="experience"
                                    name="experience"
                                    type="number"
                                    value={input.experience}
                                    onChange={changeEventHandler}
                                    placeholder="e.g., 3"
                                    required
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="jobType">Job Type *</Label>
                                <Select onValueChange={(value) => setInput({...input, jobType: value})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select job type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Full Time">Full Time</SelectItem>
                                            <SelectItem value="Part Time">Part Time</SelectItem>
                                            <SelectItem value="Contract">Contract</SelectItem>
                                            <SelectItem value="Internship">Internship</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="position">Number of Positions *</Label>
                                <Input
                                    id="position"
                                    name="position"
                                    type="number"
                                    value={input.position}
                                    onChange={changeEventHandler}
                                    placeholder="e.g., 2"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="description">Job Description *</Label>
                            <textarea
                                id="description"
                                name="description"
                                value={input.description}
                                onChange={changeEventHandler}
                                placeholder="Describe the role, responsibilities, and requirements..."
                                className="w-full min-h-[120px] p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                required
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="requirements">Requirements</Label>
                            <textarea
                                id="requirements"
                                name="requirements"
                                value={input.requirements}
                                onChange={changeEventHandler}
                                placeholder="List the required skills and qualifications..."
                                className="w-full min-h-[100px] p-3 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            />
                        </div>
                        
                        {companies.length > 0 ? (
                            <div className="space-y-2">
                                <Label>Select Company *</Label>
                                <Select onValueChange={selectChangeHandler}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a company" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {companies.map((company) => (
                                                <SelectItem key={company._id} value={company.name.toLowerCase()}>
                                                    {company.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                                <div>
                                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                        No companies registered
                                    </p>
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                        Please register a company first before posting jobs
                                    </p>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex gap-4">
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => navigate("/admin/jobs")}
                                disabled={loading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                disabled={loading || companies.length === 0}
                                className="flex-1 flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Posting Job...
                                    </>
                                ) : (
                                    <>
                                        <Briefcase className="w-4 h-4" />
                                        Post Job
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default PostJob