import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllCompanies = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching companies from:', `${COMPANY_API_END_POINT}/get`);
                
                const response = await axios.get(`${COMPANY_API_END_POINT}/get`, {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                
                console.log('Companies response:', response.data);
                
                if (response.data.success) {
                    dispatch(setCompanies(response.data.companies || []));
                } else {
                    setError(response.data.message || 'Failed to fetch companies');
                    dispatch(setCompanies([]));
                }
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError(err.response?.data?.message || err.message || 'Failed to fetch companies');
                dispatch(setCompanies([]));
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, [dispatch]);

    return { loading, error };
};

export default useGetAllCompanies;