import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { FileText, Calendar, Building, Briefcase } from 'lucide-react'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
    const {allAppliedJobs} = useSelector(store=>store.job);
    
    if (allAppliedJobs.length <= 0) {
        return (
            <div className="text-center py-12">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                <p className="text-muted-foreground">
                    You haven't applied to any jobs yet. Start exploring opportunities!
                </p>
            </div>
        );
    }
    
    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
                <TableCaption className="py-4 text-muted-foreground">
                    A list of your applied jobs
                </TableCaption>
                <TableHeader>
                    <TableRow className="border-border">
                        <TableHead className="text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                Date Applied
                            </div>
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" />
                                Job Role
                            </div>
                        </TableHead>
                        <TableHead className="text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Building className="w-4 h-4" />
                                Company
                            </div>
                        </TableHead>
                        <TableHead className="text-right text-muted-foreground">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAppliedJobs.map((appliedJob) => (
                        <TableRow key={appliedJob._id} className="border-border hover:bg-muted/50 transition-colors">
                            <TableCell className="text-muted-foreground">
                                {appliedJob?.createdAt?.split("T")[0]}
                            </TableCell>
                            <TableCell className="font-medium text-foreground">
                                {appliedJob.job?.title}
                            </TableCell>
                            <TableCell className="text-foreground">
                                {appliedJob.job?.company?.name}
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge 
                                    className={`${
                                        appliedJob?.status === "rejected" 
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400' 
                                            : appliedJob.status === 'pending' 
                                                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400' 
                                                : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                                    } font-medium`}
                                    variant="secondary"
                                >
                                    {appliedJob.status.toUpperCase()}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default AppliedJobTable