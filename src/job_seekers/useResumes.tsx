import type { FileObject, StorageError } from '@supabase/storage-js';
import type StorageFileApi from '@supabase/storage-js/dist/module/packages/StorageFileApi';
import { useQuery, type QueryObserverResult } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import supabase from '../db/supabase';

export type Resumes = {
  resumes: Array<FileObject> | undefined;
  isPending: boolean;
  upload: (
    file: File,
    replace?: boolean
  ) => ReturnType<StorageFileApi['upload']>;
  download: (name: string) => Promise<{
    data: Blob | null;
    error: StorageError | null;
  }>;
  deleteResume: (name: string) => Promise<{
    data: FileObject[] | null;
    error: StorageError | null;
  }>;
  error?: Error;
  refetch: () => Promise<QueryObserverResult>;
};

const useResumes = (userId: string | null): Resumes => {
  const queryKey = useMemo(
    () => ({
      userId
    }),
    [userId]
  );

  const {
    data: resumesData,
    isPending,
    error,
    refetch
  } = useQuery({
    queryKey: ['job_seeker_resumes', queryKey],
    queryFn: async () => {
      if (!userId) {
        return { data: null, error: null };
      }
      const { data, error } = await supabase.storage
        .from('resumes')
        .list(`${userId}`);
      // console.log(data);
      if (error) {
        console.log(error);
      }
      return { data, error };
    }
  });

  const upload = useCallback(
    async (file: File, replace?: boolean) => {
      const result = replace
        ? await supabase.storage
            .from('resumes')
            .update(`${userId}/${file.name}`, file)
        : await supabase.storage
            .from('resumes')
            .upload(`${userId}/${file.name}`, file);
      if (result.error) {
        console.log(result.error);
      }
      return result;
    },
    [userId]
  );

  const download = useCallback(
    async (name: string) => {
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(`${userId}/${name}`);
      if (error) {
        console.log(error);
      }
      return { data, error };
    },
    [userId]
  );

  const deleteResume = useCallback(
    async (name: string) => {
      const { data, error } = await supabase.storage
        .from('resumes')
        .remove([`${userId}/${name}`]);
      if (error) {
        console.log(error);
      }
      return { data, error };
    },
    [userId]
  );

  const resumes: Array<FileObject> | undefined = useMemo(() => {
    return resumesData?.data?.map((resumeData) => resumeData);
  }, [resumesData?.data]);

  return {
    resumes,
    isPending,
    upload,
    download,
    deleteResume,
    error: error ?? undefined,
    refetch
  };
};

export default useResumes;
