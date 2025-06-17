import { useState, useEffect } from "react";
import axios from "axios";
import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = (keyword = "") => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching jobs from:', `${JOB_API_END_POINT}/get?keyword=${keyword}`);
                
                const response = await axios.get(`${JOB_API_END_POINT}/get?keyword=${keyword}`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                console.log('Response:', response.data);
                
                if (response.data.success) {
                    setJobs(response.data.jobs || []);
                    dispatch(setAllJobs(response.data.jobs || []));
                } else {
                    setError(response.data.message || 'Failed to fetch jobs');
                    setJobs([]);
                    dispatch(setAllJobs([]));
                }
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError(err.response?.data?.message || err.message || 'Failed to fetch jobs');
                setJobs([]);
                dispatch(setAllJobs([]));
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [keyword, dispatch]);

    return { loading, error, jobs };
};

export default useGetAllJobs;