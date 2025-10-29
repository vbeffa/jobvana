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
  download: () => Promise<{
    data: Blob | null;
    error: StorageError | null;
  }>;
  error?: Error;
};

const useApplicationResume = ({
  resumePath
}: {
  resumePath: string;
}): ApplicationResume => {
  const queryKey = useMemo(
    () => ({
      resumePath
    }),
    [resumePath]
  );

  const {
    data: resumeData,
    isPending,
    error
  } = useQuery({
    queryKey: ['application_resumes', queryKey],
    queryFn: async () => {
      const { data, error } = await supabase.storage
        .from('applications')
        .info(resumePath);

      if (error) {
        console.log(error);
        throw error;
      }

      // console.log(data);
      return { data, error };
    }
  });

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
    download,
    error: error ?? undefined
  };
};

export default useApplicationResume;
