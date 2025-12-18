import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { UpdateProfileSchema, updateProfile, type UpdateProfileInput } from '../api/auth';

const ProfilePage: React.FC = () => {
    const { user, isLoading: authLoading } = useAuth();
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdateProfileInput>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            name: user?.name || '',
        },
    });

    const updateMutation = useMutation({
        mutationFn: updateProfile,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['auth', 'user'], updatedUser);
            // Optionally show a toast or success message here
            alert('Profile updated successfully');
        },
        onError: (error) => {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile');
        },
    });

    const onSubmit = (data: UpdateProfileInput) => {
        updateMutation.mutate(data);
    };

    if (authLoading) return <div>Loading profile...</div>;

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 p-8 rounded-lg shadow-sm border border-gray-200 dark:border-slate-600">
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Profile</h1>

            <div className="space-y-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                        <input
                            type="text"
                            {...register('name')}
                            className="mt-1 block w-full p-2 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                        <div className="mt-1 p-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-md text-gray-900 dark:text-gray-100">
                            {user?.email}
                        </div>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Email cannot be changed.</p>
                    </div>

                    <div className="pt-4 border-t border-gray-200 dark:border-slate-600 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
