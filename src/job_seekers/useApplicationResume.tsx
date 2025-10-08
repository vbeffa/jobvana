import type {
  Camelize,
  FileObjectV2,
  StorageError
} from '@supabase/storage-js';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import supabase from '../db/supabase';

export type ApplicationResume = {
  resume: Camelize<FileObjectV2> | undefined;
  isPending: boolean;
  // upload: (
  //   file: File,
  //   replace?: boolean
  // ) => ReturnType<StorageFileApi['upload']>;
  download: () => Promise<{
    data: Blob | null;
    error: StorageError | null;
  }>;
  error?: Error;
};

const useApplicationResume = (
  jobId: number,
  resumePath: string
): ApplicationResume => {
  const queryKey = useMemo(
    () => ({
      jobId,
      resumePath
    }),
    [jobId, resumePath]
  );

  const {
    data: resumeData,
    isPending,
    error
  } = useQuery({
    queryKey: ['application_resumes', queryKey],
    queryFn: async () => {
      // console.log(resumePath);
      const { data, error } = await supabase.storage
        .from('applications')
        .info(resumePath);
      // console.log(data);
      if (error) {
        console.log(error);
      }
      return { data, error };
    }
  });

  // const upload = useCallback(
  //   async (file: File, replace?: boolean) => {
  //     const result = replace
  //       ? await supabase.storage
  //           .from('resumes')
  //           .update(`${userId}/${file.name}`, file)
  //       : await supabase.storage
  //           .from('resumes')
  //           .upload(`${userId}/${file.name}`, file);
  //     if (result.error) {
  //       console.log(result.error);
  //     }
  //     return result;
  //   },
  //   [userId]
  // );

  const download = useCallback(async () => {
    const { data, error } = await supabase.storage
      .from('applications')
      .download(resumePath);
    if (error) {
      console.log(error);
    }
    return { data, error };
  }, [resumePath]);

  const resume: Camelize<FileObjectV2> | undefined = useMemo(() => {
    return resumeData?.data ?? undefined;
  }, [resumeData?.data]);

  return {
    resume,
    isPending,
    // upload,
    download,
    error: error ?? undefined
  };
};

export default useApplicationResume;
