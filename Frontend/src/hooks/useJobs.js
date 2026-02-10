import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useJobs = (type = 'feed', params = {}) => {
    const queryClient = useQueryClient();

    // Fetch Jobs
    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching
    } = useQuery({
        queryKey: ['jobs', type, params],
        queryFn: async () => {
            let endpoint = '/jobs';
            if (type === 'feed') endpoint = '/jobs/feed';
            else if (type === 'user') endpoint = `/jobs/user/${params.userId}`;

            const response = await api.get(endpoint, { params });
            return response.data;
        },
    });

    // Apply to Job
    const applyMutation = useMutation({
        mutationFn: (jobId) => api.post(`/applications/apply/${jobId}`),
        onSuccess: () => {
            toast.success('Application submitted successfully!');
            queryClient.invalidateQueries(['applications']);
            queryClient.invalidateQueries(['jobs']);
        },
        onError: (err) => {
            const message = err.response?.data?.message || 'Failed to apply. Please try again.';
            toast.error(message);
        }
    });

    return {
        jobs: data?.content || [],
        pagination: {
            totalElements: data?.totalElements || 0,
            totalPages: data?.totalPages || 0,
            currentPage: data?.number || 0,
            isFirst: data?.first || true,
            isLast: data?.last || true
        },
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
        applyToJob: applyMutation.mutate
    };
};
