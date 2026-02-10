import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export const useApplications = () => {
    const {
        data,
        isLoading,
        isError,
        error,
        refetch
    } = useQuery({
        queryKey: ['applications', 'mine'],
        queryFn: async () => {
            const response = await api.get('/applications/my-applications');
            return response.data;
        },
    });

    return {
        applications: data || [],
        appliedJobIds: (data || []).map(app => app.job.id),
        isLoading,
        isError,
        error,
        refetch
    };
};
