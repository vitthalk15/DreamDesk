import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { FileText, Upload, Download, Eye, Trash2, Edit3, Calendar, File, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNotification } from './providers/NotificationProvider'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'

const Resume = () => {
    const { user } = useSelector(store => store.auth);
    const { showSuccess, showError } = useNotification();
    const dispatch = useDispatch();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Auto-refresh user data when component mounts
    useEffect(() => {
        if (user) {
            // The user data should be fresh from the auth state
            // If needed, we can add a refresh function here
        }
    }, [user]);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                showError('Please select a PDF file', 'file_validation_error');
                return;
            }
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                showError('File size should be less than 5MB', 'file_size_error');
                return;
            }
            setSelectedFile(file);
        }
    }

    const uploadResume = async () => {
        if (!selectedFile) {
            showError('Please select a file', 'file_required_error');
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                const actionType = user?.profile?.resume ? 'resume_update' : 'resume_upload';
                showSuccess(
                    user?.profile?.resume 
                        ? 'Resume updated successfully' 
                        : 'Resume uploaded successfully',
                    actionType,
                    { fileName: selectedFile.name, fileSize: selectedFile.size }
                );
                setUploadDialogOpen(false);
                setSelectedFile(null);
            }
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || 'Failed to upload resume', 'resume_upload_error');
        } finally {
            setLoading(false);
        }
    }

    const deleteResume = async () => {
        if (!user?.profile?.resume) {
            showError('No resume to delete', 'no_resume_error');
            return;
        }

        try {
            setIsDeleting(true);
            const res = await axios.delete(`${USER_API_END_POINT}/profile/resume`, {
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess('Resume deleted successfully', 'resume_delete');
            }
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || 'Failed to delete resume', 'resume_delete_error');
        } finally {
            setIsDeleting(false);
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    const getResumeStatus = () => {
        if (!user?.profile?.resume) {
            return {
                status: 'missing',
                icon: AlertCircle,
                color: 'text-orange-600 dark:text-orange-400',
                bgColor: 'bg-orange-50 dark:bg-orange-950/20',
                title: 'No Resume',
                description: 'Upload your resume to start applying for jobs'
            };
        }
        
        return {
            status: 'uploaded',
            icon: CheckCircle,
            color: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-950/20',
            title: 'Resume Uploaded',
            description: 'Your resume is ready for job applications'
        };
    };

    const resumeStatus = getResumeStatus();
    const StatusIcon = resumeStatus.icon;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-6 h-6 text-primary" />
                        <h1 className="text-3xl font-bold text-foreground">Resume Management</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Upload and manage your resume for job applications
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Resume Status Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-1"
                    >
                        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                            <div className="text-center mb-6">
                                <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${resumeStatus.bgColor} flex items-center justify-center`}>
                                    <StatusIcon className={`w-8 h-8 ${resumeStatus.color}`} />
                                </div>
                                <h3 className="text-lg font-semibold text-card-foreground mb-2">
                                    {resumeStatus.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    {resumeStatus.description}
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Button 
                                    onClick={() => setUploadDialogOpen(true)}
                                    className="w-full"
                                    variant={user?.profile?.resume ? "outline" : "default"}
                                    disabled={loading || isDeleting}
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    {user?.profile?.resume ? 'Update Resume' : 'Upload Resume'}
                                </Button>
                                
                                {user?.profile?.resume && (
                                    <Button 
                                        onClick={deleteResume}
                                        variant="outline"
                                        className="w-full text-destructive hover:text-destructive"
                                        disabled={loading || isDeleting}
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete Resume
                                            </>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    {/* Resume Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                            <h2 className="text-xl font-semibold text-card-foreground mb-6">Resume Details</h2>
                            
                            {user?.profile?.resume ? (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-card-foreground">
                                                {user.profile.resumeOriginalName || "Resume.pdf"}
                                            </h4>
                                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                                <span>{formatFileSize(user.profile.resumeSize || 0)}</span>
                                                {user.profile.resumeUploadedAt && (
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" />
                                                        {formatDate(user.profile.resumeUploadedAt)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Button 
                                            variant="outline" 
                                            className="w-full"
                                            asChild
                                        >
                                            <a 
                                                href={user.profile.resume} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Resume
                                            </a>
                                        </Button>
                                        
                                        <Button 
                                            variant="outline" 
                                            className="w-full"
                                            asChild
                                        >
                                            <a 
                                                href={user.profile.resume} 
                                                download={user.profile.resumeOriginalName || "resume.pdf"}
                                            >
                                                <Download className="w-4 h-4 mr-2" />
                                                Download Resume
                                            </a>
                                        </Button>
                                    </div>

                                    <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                                        <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                                            Resume Tips
                                        </h5>
                                        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                            <li>• Keep your resume updated with latest experience</li>
                                            <li>• Use a clear, professional format</li>
                                            <li>• Include relevant skills and achievements</li>
                                            <li>• Keep file size under 5MB for faster uploads</li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium text-card-foreground mb-2">
                                        No Resume Uploaded
                                    </h3>
                                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                        Upload your resume to start applying for jobs. Make sure it's in PDF format and under 5MB.
                                    </p>
                                    <Button 
                                        onClick={() => setUploadDialogOpen(true)}
                                        disabled={loading || isDeleting}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        Upload Resume
                                    </Button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Upload Dialog */}
            <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5" />
                            {user?.profile?.resume ? 'Update Resume' : 'Upload Resume'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="resume-file">Select PDF File</Label>
                                <Input
                                    id="resume-file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={handleFileSelect}
                                    className="cursor-pointer"
                                    disabled={loading}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Maximum file size: 5MB. Only PDF files are accepted.
                                </p>
                            </div>

                            {selectedFile && (
                                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                    <File className="w-5 h-5 text-primary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-card-foreground">
                                            {selectedFile.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(selectedFile.size)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <DialogFooter className="flex gap-3">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                                setUploadDialogOpen(false);
                                setSelectedFile(null);
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={uploadResume}
                            disabled={loading || !selectedFile}
                            className="flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" />
                                    {user?.profile?.resume ? 'Update Resume' : 'Upload Resume'}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default Resume 