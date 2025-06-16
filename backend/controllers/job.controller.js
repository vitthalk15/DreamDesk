import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        console.log('Searching jobs with keyword:', keyword);
        
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        
        const jobs = await Job.find(query).populate({
            path: "company",
            select: "name logo description website location"
        }).sort({ createdAt: -1 });
        
        console.log('Found jobs:', jobs.length);
        
        return res.status(200).json({
            jobs: jobs || [],
            success: true,
            message: jobs.length === 0 ? "No jobs found" : "Jobs retrieved successfully"
        });
    } catch (error) {
        console.error('Error in getAllJobs:', error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            jobs: []
        });
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: "company",
            select: "name logo description website location"
        }).populate({
            path: "applications",
            populate: {
                path: "applicant",
                select: "fullname email profile"
            }
        });
        
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            })
        };
        
        return res.status(200).json({ 
            job, 
            success: true 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path: 'company',
            select: "name logo description website location"
        }).sort({ createdAt: -1 });
        
        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found.",
                success: false
            })
        };
        
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}
