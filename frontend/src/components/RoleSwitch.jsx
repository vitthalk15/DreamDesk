import React, { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { GraduationCap, Building2, AlertTriangle, CheckCircle } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import { useNotification } from './providers/NotificationProvider'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'

const RoleSwitch = () => {
    const { user } = useSelector(store => store.auth);
    const { showSuccess, showError } = useNotification();
    const dispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleRoleSwitch = async () => {
        if (!selectedRole) {
            showError('Please select a role', 'role_selection_error');
            return;
        }

        if (selectedRole === user?.role) {
            showError('You are already in this role', 'same_role_error');
            return;
        }

        try {
            setLoading(true);
            console.log('Attempting role switch with role:', selectedRole);
            const res = await axios.post(`${USER_API_END_POINT}/role/switch`, {
                newRole: selectedRole
            }, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                showSuccess(
                    `Successfully switched to ${selectedRole === 'student' ? 'Job Seeker' : 'Recruiter'} role`,
                    'role_switch',
                    { newRole: selectedRole === 'student' ? 'Job Seeker' : 'Recruiter' }
                );
                setIsDialogOpen(false);
                setSelectedRole(null);
            }
        } catch (error) {
            console.error('Role switch error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            showError(
                error.response?.data?.message || 'Failed to switch role. Please try again.',
                'role_switch_error'
            );
        } finally {
            setLoading(false);
        }
    };

    const getCurrentRoleDisplay = () => {
        return user?.role === 'student' ? 'Job Seeker' : 'Recruiter';
    };

    const getCurrentRoleIcon = () => {
        return user?.role === 'student' ? GraduationCap : Building2;
    };

    const CurrentRoleIcon = getCurrentRoleIcon();

    return (
        <>
            <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <CurrentRoleIcon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-card-foreground">Current Role</h3>
                            <p className="text-sm text-muted-foreground">Manage your account role</p>
                        </div>
                    </div>
                    <Badge className={`${
                        user?.role === 'student' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' 
                            : 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                    }`}>
                        {getCurrentRoleDisplay()}
                    </Badge>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium text-card-foreground mb-2">Role Capabilities</h4>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            {user?.role === 'student' ? (
                                <>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Apply for jobs and internships</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Upload and manage resume</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Track application status</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Save favorite jobs</span>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Post and manage job listings</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>View and manage applications</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Create and manage companies</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                        <span>Access admin dashboard</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <Button 
                        onClick={() => setIsDialogOpen(true)}
                        variant="outline"
                        className="w-full"
                    >
                        Switch Role
                    </Button>
                </div>
            </div>

            {/* Role Switch Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Switch Account Role
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-6">
                        <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                            <h4 className="font-medium text-orange-800 dark:text-orange-200 mb-2">
                                Important Notice
                            </h4>
                            <p className="text-sm text-orange-700 dark:text-orange-300">
                                Switching your role will change your account capabilities and access to features. 
                                This action cannot be undone immediately.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-medium text-card-foreground">Select New Role</h4>
                            <div className="grid grid-cols-1 gap-3">
                                <div 
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedRole === 'student' 
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' 
                                            : 'border-border hover:border-blue-300'
                                    }`}
                                    onClick={() => setSelectedRole('student')}
                                >
                                    <div className="flex items-center gap-3">
                                        <GraduationCap className="w-6 h-6 text-blue-600" />
                                        <div className="flex-1">
                                            <h5 className="font-medium text-card-foreground">Job Seeker</h5>
                                            <p className="text-sm text-muted-foreground">
                                                Apply for jobs, manage resume, track applications
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div 
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedRole === 'recruiter' 
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20' 
                                            : 'border-border hover:border-purple-300'
                                    }`}
                                    onClick={() => setSelectedRole('recruiter')}
                                >
                                    <div className="flex items-center gap-3">
                                        <Building2 className="w-6 h-6 text-purple-600" />
                                        <div className="flex-1">
                                            <h5 className="font-medium text-card-foreground">Recruiter</h5>
                                            <p className="text-sm text-muted-foreground">
                                                Post jobs, manage applications, create companies
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {selectedRole && (
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    Switching from <strong>{getCurrentRoleDisplay()}</strong> to{' '}
                                    <strong>{selectedRole === 'student' ? 'Job Seeker' : 'Recruiter'}</strong>
                                </p>
                            </div>
                        )}
                    </div>
                    
                    <DialogFooter className="flex gap-3">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                                setIsDialogOpen(false);
                                setSelectedRole(null);
                            }}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleRoleSwitch}
                            disabled={loading || !selectedRole}
                            className="flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Switching...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Switch Role
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default RoleSwitch 