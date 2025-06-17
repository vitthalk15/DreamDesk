import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            });
        };

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address",
                success: false
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            })
        }

        // Handle file upload
        let profilePhotoUrl = null;
        if (req.file) {
            try {
                const fileUri = getDataUri(req.file);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: 'profile-photos',
                    transformation: [
                        { width: 400, height: 400, crop: 'fill' },
                        { quality: 'auto' }
                    ]
                });
                profilePhotoUrl = cloudResponse.secure_url;
            } catch (uploadError) {
                console.error('File upload error:', uploadError);
                return res.status(500).json({
                    message: "Failed to upload profile photo. Please try again.",
                    success: false
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            message: "Internal server error. Please try again.",
            success: false
        });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Email, password, and role are required",
                success: false
            });
        };

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };

        // Check role is correct
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { 
            maxAge: 1 * 24 * 60 * 60 * 1000, 
            httpOnly: true, 
            sameSite: 'none',
            secure: true
        }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            message: "Internal server error. Please try again.",
            success: false
        });
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { 
            maxAge: 0,
            httpOnly: true,
            sameSite: 'none',
            secure: true
        }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills } = req.body;
        const userId = req.id; // middleware authentication
        
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            })
        }

        // Validate email if provided
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    message: "Please provide a valid email address",
                    success: false
                });
            }
            
            // Check if email is already taken by another user
            const existingUser = await User.findOne({ email, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({
                    message: "Email is already taken by another user",
                    success: false
                });
            }
        }

        // Handle resume file upload
        if (req.files && req.files.file && req.files.file[0]) {
            try {
                const file = req.files.file[0];
                
                // Validate file type
                if (!file.mimetype.includes('pdf')) {
                    return res.status(400).json({
                        message: "Only PDF files are allowed",
                        success: false
                    });
                }

                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    return res.status(400).json({
                        message: "File size should be less than 5MB",
                        success: false
                    });
                }

                const fileUri = getDataUri(file);
                
                // Upload to cloudinary with specific folder and transformations
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: 'resumes',
                    resource_type: 'raw',
                    format: 'pdf',
                    access_mode: 'public',
                    use_filename: true,
                    unique_filename: true,
                    overwrite: true,
                    timestamp: Math.round((new Date).getTime()/1000),
                    transformation: [
                        { fetch_format: 'pdf' }
                    ]
                });

                // Update resume information
                user.profile.resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = file.originalname;
                user.profile.resumeSize = file.size;
                user.profile.resumeUploadedAt = new Date();

                await user.save();
            } catch (uploadError) {
                console.error('Resume upload error:', uploadError);
                return res.status(500).json({
                    message: uploadError.message || "Failed to upload resume. Please try again.",
                    success: false
                });
            }
        }

        // Handle profile photo upload
        if (req.files && req.files.profilePhoto && req.files.profilePhoto[0]) {
            try {
                const fileUri = getDataUri(req.files.profilePhoto[0]);
                
                // Upload to cloudinary with specific folder and transformations for profile photos
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content, {
                    folder: 'profile-photos',
                    transformation: [
                        { width: 400, height: 400, crop: 'fill' },
                        { quality: 'auto' }
                    ],
                    timestamp: Math.round((new Date).getTime()/1000)
                });

                // Update profile photo
                user.profile.profilePhoto = cloudResponse.secure_url;
            } catch (uploadError) {
                console.error('Profile photo upload error:', uploadError);
                return res.status(500).json({
                    message: "Failed to upload profile photo. Please try again.",
                    success: false
                });
            }
        }

        // Process skills array
        let skillsArray = user.profile.skills || [];
        if (skills) {
            skillsArray = skills.split(",").map(skill => skill.trim()).filter(skill => skill.length > 0);
        }

        // Update user data
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        await user.save();

        // Return updated user data
        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: updatedUser,
            success: true
        })
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({
            message: "Internal server error. Please try again.",
            success: false
        });
    }
}

export const deleteResume = async (req, res) => {
    try {
        const userId = req.id; // middleware authentication
        
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            })
        }

        // Check if user has a resume
        if (!user.profile.resume) {
            return res.status(400).json({
                message: "No resume found to delete.",
                success: false
            })
        }

        // Delete from cloudinary if URL exists
        if (user.profile.resume) {
            try {
                // Extract public_id from URL
                const urlParts = user.profile.resume.split('/');
                const filename = urlParts[urlParts.length - 1];
                const publicId = `resumes/${filename.split('.')[0]}`;
                
                await cloudinary.uploader.destroy(publicId, { resource_type: 'auto' });
            } catch (cloudinaryError) {
                console.error('Cloudinary delete error:', cloudinaryError);
                // Continue with local deletion even if cloudinary fails
            }
        }

        // Clear resume information
        user.profile.resume = null;
        user.profile.resumeOriginalName = null;
        user.profile.resumeSize = null;
        user.profile.resumeUploadedAt = null;

        await user.save();

        // Return updated user data
        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Resume deleted successfully.",
            user: updatedUser,
            success: true
        })
    } catch (error) {
        console.error('Resume delete error:', error);
        return res.status(500).json({
            message: "Internal server error. Please try again.",
            success: false
        });
    }
}

export const switchRole = async (req, res) => {
    try {
        const { newRole } = req.body;
        const userId = req.id;

        if (!newRole || !['student', 'recruiter'].includes(newRole)) {
            return res.status(400).json({
                message: "Valid role (student or recruiter) is required",
                success: false
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        user.role = newRole;
        await user.save();

        const updatedUser = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: `Role updated to ${newRole} successfully`,
            user: updatedUser,
            success: true
        });
    } catch (error) {
        console.error('Role switch error:', error);
        return res.status(500).json({
            message: "Internal server error. Please try again.",
            success: false
        });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        if (!email || !newPassword) {
            return res.status(400).json({
                message: "Email and new password are required",
                success: false
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Please provide a valid email address",
                success: false
            });
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters long",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found with this email",
                success: false
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            message: "Password reset successfully",
            success: true
        });
    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({
            message: "Internal server error. Please try again.",
            success: false
        });
    }
}

export const getResume = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        if (!user.profile.resume) {
            return res.status(404).json({
                message: "Resume not found",
                success: false
            });
        }

        // Extract public_id from URL
        const urlParts = user.profile.resume.split('/');
        const filename = urlParts[urlParts.length - 1];
        const publicId = `resumes/${filename.split('.')[0]}`;

        console.log('Fetching resume with public_id:', publicId);

        try {
            // Get the PDF from Cloudinary
            const result = await cloudinary.uploader.download(publicId, {
                resource_type: 'raw',
                format: 'pdf'
            });

            if (!result) {
                throw new Error('No data received from Cloudinary');
            }

            // Set appropriate headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `inline; filename="${user.profile.resumeOriginalName || 'resume.pdf'}"`);
            res.setHeader('Content-Length', result.length);
            res.setHeader('Cache-Control', 'no-cache');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Access-Control-Allow-Origin', '*');
            
            // Send the PDF
            res.send(result);
        } catch (cloudinaryError) {
            console.error('Cloudinary error:', cloudinaryError);
            
            // If Cloudinary fails, try to fetch the PDF directly from the URL
            try {
                const response = await fetch(user.profile.resume);
                if (!response.ok) throw new Error('Failed to fetch PDF');
                
                const pdfBuffer = await response.buffer();
                
                // Set appropriate headers
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename="${user.profile.resumeOriginalName || 'resume.pdf'}"`);
                res.setHeader('Content-Length', pdfBuffer.length);
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Access-Control-Allow-Origin', '*');
                
                // Send the PDF
                res.send(pdfBuffer);
            } catch (fetchError) {
                console.error('Fetch error:', fetchError);
                throw fetchError;
            }
        }
    } catch (error) {
        console.error('Resume fetch error:', error);
        return res.status(500).json({
            message: "Failed to fetch resume. Please try again.",
            success: false
        });
    }
};