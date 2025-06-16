import { Company } from "../models/company.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }
        let company = await Company.findOne({ name: companyName });
        if (company) {
            return res.status(400).json({
                message: "You can't register same company.",
                success: false
            })
        };
        company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        })
    } catch (error) {
        console.error('Error in registerCompany:', error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const getCompany = async (req, res) => {
    try {
        console.log('Getting companies for user:', req.id);
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId });
        console.log('Found companies:', companies.length);
        
        return res.status(200).json({
            companies: companies || [],
            success: true,
            message: companies.length === 0 ? "No companies found" : "Companies retrieved successfully"
        });
    } catch (error) {
        console.error('Error in getCompany:', error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false,
            companies: []
        });
    }
}

// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        console.log('Getting company by ID:', companyId);
        
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.error('Error in getCompanyById:', error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        console.log('Updating company with data:', { name, description, website, location });
 
        const file = req.file;
        if (!file) {
            return res.status(400).json({
                message: "Logo file is required.",
                success: false
            });
        }

        // Upload to cloudinary
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        const logo = cloudResponse.secure_url;
    
        const updateData = { name, description, website, location, logo };
        console.log('Updating company with ID:', req.params.id);

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            message: "Company information updated.",
            success: true,
            company
        })

    } catch (error) {
        console.error('Error in updateCompany:', error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
}