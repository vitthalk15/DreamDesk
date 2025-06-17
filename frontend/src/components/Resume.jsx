import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './shared/Navbar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Avatar, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { FileText, Upload, Download, Eye, Trash2, Edit3, Calendar, File, AlertCircle, CheckCircle, Loader2, X, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { useNotification } from './providers/NotificationProvider'
import axios from 'axios'
import { USER_API_END_POINT } from '../utils/constant'
import { setUser } from '../redux/authSlice'
import { useNavigate } from 'react-router-dom'

const Resume = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const { showSuccess, showError } = useNotification();
    const navigate = useNavigate();
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [pdfUrl, setPdfUrl] = useState(null);
    const [isViewing, setIsViewing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [pdfError, setPdfError] = useState(null);
    const fileInputRef = useRef(null);
    const iframeRef = useRef(null);
    const [zoom, setZoom] = useState(1);
    const [fullscreen, setFullscreen] = useState(false);

    // Check if user is authenticated
    useEffect(() => {
        if (!user) {
            showError('Please login to access your resume', 'auth_required');
            navigate('/login');
        }
    }, [user, navigate, showError]);

    // Auto-refresh user data when component mounts
    useEffect(() => {
        if (user) {
            // The user data should be fresh from the auth state
            // If needed, we can add a refresh function here
        }
    }, [user]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            showError('Please upload a PDF file', 'invalid_file_type');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError('File size should be less than 5MB', 'file_too_large');
            return;
        }

        const formData = new FormData();
        formData.append('resume', file);

        try {
            setIsUploading(true);
            const res = await axios.post(`${USER_API_END_POINT}/resume/upload`, formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess('Resume uploaded successfully', 'resume_upload');
            }
        } catch (error) {
            console.error('Resume upload error:', error);
            if (error.response?.status === 401) {
                showError('Your session has expired. Please login again.', 'session_expired');
                navigate('/login');
            } else {
                showError(
                    error.response?.data?.message || 'Failed to upload resume. Please try again.',
                    'resume_upload_error'
                );
            }
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleViewResume = async () => {
        if (!user?.profile?.resume) {
            showError('No resume found. Please upload a resume first.', 'no_resume');
            return;
        }

        try {
            setLoading(true);
            setPdfError(null);
            setZoom(1); // Reset zoom when opening
            // Convert the Cloudinary URL to a secure delivery URL
            const cloudinaryUrl = user.profile.resume;
            const deliveryUrl = cloudinaryUrl
                .replace('/upload/', '/upload/q_auto,f_auto,fl_force_strip,fl_progressive/')
                .replace('http://', 'https://');
            
            setPdfUrl(deliveryUrl);
            setIsViewing(true);
        } catch (error) {
            console.error('Error loading PDF:', error);
            setPdfError('Failed to load PDF. Please try again.');
            showError('Failed to load PDF. Please try again.', 'pdf_load_error');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadResume = async () => {
        if (!user?.profile?.resume) {
            showError('No resume found. Please upload a resume first.', 'no_resume');
            return;
        }

        try {
            setLoading(true);
            // Convert the Cloudinary URL to a secure delivery URL
            const cloudinaryUrl = user.profile.resume;
            const deliveryUrl = cloudinaryUrl
                .replace('/upload/', '/upload/q_auto,f_auto,fl_force_strip,fl_progressive/')
                .replace('http://', 'https://');

            // Fetch the PDF file
            const response = await fetch(deliveryUrl);
            const blob = await response.blob();

            // Create a download link
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'resume.pdf';
            document.body.appendChild(link);
            link.click();

            // Clean up
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            showSuccess('Resume downloaded successfully', 'resume_download');
        } catch (error) {
            console.error('Error downloading resume:', error);
            showError('Failed to download resume. Please try again.', 'resume_download_error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteResume = async () => {
        try {
            const res = await axios.delete(`${USER_API_END_POINT}/resume/delete`, {
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess('Resume deleted successfully', 'resume_delete');
                setPdfUrl(null);
                setIsViewing(false);
            }
        } catch (error) {
            console.error('Resume delete error:', error);
            if (error.response?.status === 401) {
                showError('Your session has expired. Please login again.', 'session_expired');
                navigate('/login');
            } else {
                showError(
                    error.response?.data?.message || 'Failed to delete resume. Please try again.',
                    'resume_delete_error'
                );
            }
        }
    };

    const onDocumentLoadSuccess = ({ numPages }) => {
        setNumPages(numPages);
        setPageNumber(1);
    };

    const changePage = (offset) => {
        setPageNumber(prevPageNumber => {
            const newPageNumber = prevPageNumber + offset;
            return Math.min(Math.max(1, newPageNumber), numPages);
        });
    };

    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);

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

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 0.25, 3));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 0.25, 0.5));
    };

    const handleResetZoom = () => {
        setZoom(1);
    };

    const handleToggleFullscreen = () => {
        setFullscreen(f => !f);
    };

    // If user is not authenticated, don't render the component
    if (!user) {
        return null;
    }

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
                                        onClick={handleDeleteResume}
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
                                                <X className="w-4 h-4 mr-2" />
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
                                <div className="flex flex-col gap-2">
                                    <Button 
                                        onClick={handleViewResume}
                                        className="w-full"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Resume
                                    </Button>
                                    <Button 
                                        onClick={handleDownloadResume}
                                        className="w-full"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Resume
                                    </Button>
                                    <Button 
                                        onClick={handleDeleteResume}
                                        className="w-full text-destructive hover:text-destructive"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Delete Resume
                                    </Button>
                                </div>
                            ) : (
                                <Button 
                                    onClick={() => setUploadDialogOpen(true)}
                                    className="w-full"
                                >
                                    <Upload className="w-4 h-4 mr-2" />
                                    Upload Resume
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* PDF Viewer Dialog */}
                <Dialog open={isViewing} onOpenChange={setIsViewing} className="w-screen h-screen">
                    <DialogContent className={`${fullscreen ? 'w-screen h-screen m-0' : 'w-[80vw] min-w-[800px] h-[90vh] mx-[10vw] my-[5vh]'} p-0 overflow-hidden`}>
                        <DialogHeader className="px-4 py-2 border-b">
                            <div className="flex items-center justify-between w-full">
                                <DialogTitle>Resume Preview</DialogTitle>
                                <div className="flex items-center gap-3 mr-8">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleZoomOut}
                                        disabled={zoom <= 0.5}
                                    >
                                        <ZoomOut className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleResetZoom}
                                    >
                                        {zoom}x
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleZoomIn}
                                        disabled={zoom >= 3}
                                    >
                                        <ZoomIn className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleToggleFullscreen}
                                    >
                                        {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                                    </Button>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-0 m-0 overflow-hidden" style={{height: 'calc(100vh - 48px)'}}>
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-8 h-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                                </div>
                            ) : pdfError ? (
                                <div className="flex items-center justify-center h-full text-red-500">
                                    {pdfError}
                                </div>
                            ) : (
                                <div className="w-full h-full p-0 m-0">
                                    <iframe
                                        ref={iframeRef}
                                        src={pdfUrl}
                                        className="w-full h-full"
                                        style={{
                                            border: 'none',
                                            background: 'white',
                                            margin: 0,
                                            padding: 0,
                                            width: '100%',
                                            height: '100%',
                                            transform: `scale(${zoom})`,
                                            transformOrigin: 'top center',
                                            transition: 'transform 0.2s ease-in-out',
                                            display: 'block',
                                            minWidth: '100%'
                                        }}
                                        title="Resume Preview"
                                    />
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>

                {/* Upload Dialog */}
                {uploadDialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h3 className="text-xl font-semibold mb-4">Upload Resume</h3>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".pdf"
                                className="w-full mb-4"
                            />
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setUploadDialogOpen(false)}
                                    className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleFileChange}
                                    disabled={!selectedFile || isUploading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Resume;