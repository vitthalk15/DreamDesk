import React from 'react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Label } from './ui/label'
import { useSelector } from 'react-redux'

const FilterCard = () => {
    const { selectedValue, changeHandler } = useSelector(store => store.job);
    const fitlerData = [
        {
            fitlerType: "Job Type",
            array: ["Full Time", "Part Time", "Contract", "Internship"]
        },
        {
            fitlerType: "Experience",
            array: ["Fresher", "1-2 years", "2-3 years", "3-5 years", "5+ years"]
        },
        {
            fitlerType: "Salary",
            array: ["0-3 LPA", "3-6 LPA", "6-10 LPA", "10-15 LPA", "15+ LPA"]
        }
    ]

    return (
        <div className='w-full bg-card border border-border p-6 rounded-lg shadow-sm'>
            <h1 className='font-bold text-lg text-card-foreground mb-4'>Filter Jobs</h1>
            <hr className='mb-4 border-border' />
            <RadioGroup value={selectedValue} onValueChange={changeHandler} className="space-y-6">
                {
                    fitlerData.map((data, index) => (
                        <div key={index} className="space-y-3">
                            <h2 className='font-semibold text-lg text-card-foreground'>{data.fitlerType}</h2>
                            <div className="space-y-2">
                                {
                                    data.array.map((item, idx) => {
                                        const itemId = `id${index}-${idx}`
                                        return (
                                            <div key={itemId} className='flex items-center space-x-2'>
                                                <RadioGroupItem value={item} id={itemId} />
                                                <Label htmlFor={itemId} className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                                                    {item}
                                                </Label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    ))
                }
            </RadioGroup>
        </div>
    )
}

export default FilterCard