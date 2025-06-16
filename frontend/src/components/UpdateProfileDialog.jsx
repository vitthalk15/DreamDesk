import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2, User, Mail, Phone, FileText, Briefcase, Camera, Image } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarImage } from './ui/avatar'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { useNotification } from './providers/NotificationProvider'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { showSuccess, showError } = useNotification();
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(', ') || "",
        file: null,
        profilePhoto: null
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const profilePhotoChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showError('Please select an image file', 'profile_photo_validation');
                return;
            }
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showError('Image size should be less than 5MB', 'profile_photo_size');
                return;
            }
            setInput({ ...input, profilePhoto: file });
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (!input.fullname.trim() || !input.email.trim()) {
            showError('Name and email are required', 'validation_error');
            return;
        }

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", input.skills);
        if (input.file) {
            formData.append("file", input.file);
        }
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        
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
                showSuccess('Profile updated successfully', 'profile_update', {
                    fullname: input.fullname,
                    hasResume: !!input.file,
                    hasPhoto: !!input.profilePhoto
                });
                setOpen(false);
            }
        } catch (error) {
            console.log(error);
            showError(error.response?.data?.message || 'Failed to update profile', 'profile_update_error', {
                fullname: input.fullname
            });
        } finally {
            setLoading(false);
        }
    }

    // Create preview URL for profile photo
    const profilePhotoPreview = input.profilePhoto ? URL.createObjectURL(input.profilePhoto) : user?.profile?.profilePhoto;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Update Profile
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={submitHandler} className="space-y-6">
                    <div className='space-y-4'>
                        {/* Profile Photo Upload */}
                        <div className='space-y-2'>
                            <Label className="flex items-center gap-2">
                                <Camera className="w-4 h-4" />
                                Profile Photo
                            </Label>
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage 
                                        src={profilePhotoPreview} 
                                        alt={input.fullname || user?.fullname} 
                                    />
                                </Avatar>
                                <div className="flex-1">
                                    <Input
                                        id="profilePhoto"
                                        name="profilePhoto"
                                        type="file"
                                        accept="image/*"
                                        onChange={profilePhotoChangeHandler}
                                        className="cursor-pointer"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        JPG, PNG, GIF up to 5MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='space-y-2'>
                            <Label htmlFor="fullname" className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Full Name
                            </Label>
                            <Input
                                id="fullname"
                                name="fullname"
                                type="text"
                                value={input.fullname}
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
                                name="email"
                                type="email"
                                value={input.email}
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
                                name="phoneNumber"
                                type="tel"
                                value={input.phoneNumber}
                                onChange={changeEventHandler}
                                placeholder="Enter your phone number"
                            />
                        </div>
                        
                        <div className='space-y-2'>
                            <Label htmlFor="bio" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Bio
                            </Label>
                            <Input
                                id="bio"
                                name="bio"
                                value={input.bio}
                                onChange={changeEventHandler}
                                placeholder="Tell us about yourself"
                            />
                        </div>
                        
                        <div className='space-y-2'>
                            <Label htmlFor="skills" className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Skills
                            </Label>
                            <Input
                                id="skills"
                                name="skills"
                                value={input.skills}
                                onChange={changeEventHandler}
                                placeholder="Enter skills separated by commas"
                            />
                        </div>
                        
                        <div className='space-y-2'>
                            <Label htmlFor="file" className="flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Resume (PDF)
                            </Label>
                            <Input
                                id="file"
                                name="file"
                                type="file"
                                accept="application/pdf"
                                onChange={fileChangeHandler}
                                className="cursor-pointer"
                            />
                        </div>
                    </div>
                    
                    <DialogFooter className="flex gap-3">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setOpen(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="flex items-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <User className="w-4 h-4" />
                                    Update Profile
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfileDialog