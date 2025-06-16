import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal, Building2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CompaniesTable = () => {
    const { companies, searchCompanyByText } = useSelector(store => store.company);
    const [filterCompany, setFilterCompany] = useState(companies);
    const navigate = useNavigate();
    
    useEffect(()=>{
        const filteredCompany = companies.length >= 0 && companies.filter((company)=>{
            if(!searchCompanyByText){
                return true
            };
            return company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase());
        });
        setFilterCompany(filteredCompany);
    },[companies,searchCompanyByText])
    
    if (filterCompany.length === 0) {
        return (
            <div className="text-center py-12">
                <Building2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No companies found</h3>
                <p className="text-muted-foreground">
                    {searchCompanyByText ? 'No companies match your search criteria.' : 'Start by creating your first company.'}
                </p>
            </div>
        );
    }
    
    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
                <TableCaption className="py-4 text-muted-foreground">
                    A list of your recent registered companies
                </TableCaption>
                <TableHeader>
                    <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">Logo</TableHead>
                        <TableHead className="text-muted-foreground">Name</TableHead>
                        <TableHead className="text-muted-foreground">Date</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterCompany?.map((company) => (
                            <TableRow key={company._id} className="border-border hover:bg-muted/50 transition-colors">
                                <TableCell>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={company.logo} alt={company.name} />
                                    </Avatar>
                                </TableCell>
                                <TableCell className="font-medium text-foreground">{company.name}</TableCell>
                                <TableCell className="text-muted-foreground">{company.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="text-right">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <button className="p-2 hover:bg-muted rounded-md transition-colors">
                                                <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-40 p-2" align="end">
                                            <button 
                                                onClick={()=> navigate(`/admin/companies/${company._id}`)} 
                                                className='flex items-center gap-2 w-full p-2 text-sm hover:bg-muted rounded-md transition-colors'
                                            >
                                                <Edit2 className='w-4 h-4' />
                                                <span>Edit Company</span>
                                            </button>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default CompaniesTable