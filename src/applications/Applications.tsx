import _ from 'lodash';
import { useCallback, useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { getUserType } from '../auth/utils';
import supabase from '../db/supabase';
import JobLink from '../jobs/JobLink';
import JobvanaError from '../JobvanaError';
import Modal from '../Modal';
import CompanyApplications from './CompanyApplications';
import useApplicationsForJobSeeker from './useApplicationsForJobSeeker';

const Applications = () => {
  const { applications, isPending } = useApplicationsForJobSeeker({
    jobSeekerId: 2
  });
  // const [applicationId, setApplicationId] = useState<number | null>(null);
  const userType = getUserType();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error>();

  const onWithdraw = useCallback(async (applicationId: number) => {
    if (!confirm('Are you sure you want to withdraw this application?')) {
      return;
    }
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('applications')
        .update({ status: 'withdrawn' })
        .eq('id', applicationId);

      if (error) {
        console.log(error);
        setError(error);
      } else {
        alert('Application withdrawn.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return (
    <>
      <h1>{userType === 'job_seeker' && 'My'} Applications</h1>
      {isSubmitting && <Modal type="updating" />}
      {isPending && <Modal type="loading" />}
      {error && <JobvanaError error={error} />}
      <div className="flex justify-center">
        {!isPending && (
          <div className="w-3/4 flex flex-col gap-1">
            <table>
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th>Total Applications*</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications?.map((application, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
                    <td>
                      <JobLink {...application.job} />
                    </td>
                    <td>
                      <div className="flex justify-center">
                        {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        {application.status && _.capitalize(application.status)}
                      </div>
                    </td>
                    <td>
                      <CompanyApplications application={application} />
                    </td>
                    <td className="content-center">
                      <div className="flex justify-center text-blue-400">
                        {application.status === 'submitted' && (
                          <FaTrash
                            className="cursor-pointer"
                            onClick={() => onWithdraw(application.id)}
                          />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>Notes:</div>
            <div className="flex flex-row text-sm gap-2">
              <div className="content-center">* Total Applications</div>
              <div className="content-center">=</div>
              <div>
                <div className="border-b-[0.5px]">
                  Number of submitted or accepted applications for company
                </div>
                <div className="border-t-[0.5px] flex justify-center">
                  Company pipeline size
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* <div className="flex flex-row gap-x-2">
        <div className="w-[20%]">
          {applications?.map((application, idx) => (
            <SummaryCard
              key={application.id}
              selected={applicationId === application.id}
              onClick={() => setApplicationId(application.id)}
              title={application.job.title}
              text=""
              // text={`${application.jobSeeker.user.first_name} ${application.jobSeeker.user.last_name}`}
              borderBottom={idx < applications.length - 1}
            />
          ))}
        </div>
        <div className="w-[80%]">
          {applicationId && <ApplicationDetails id={applicationId} />}
        </div>
      </div> */}
    </>
  );
};

export default Applications;
