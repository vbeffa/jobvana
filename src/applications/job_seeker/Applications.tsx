import _ from 'lodash';
import { useCallback, useState } from 'react';
import { FaDownload, FaEye, FaFileCircleXmark } from 'react-icons/fa6';
import CompanyLink from '../../companies/CompanyLink';
import supabase from '../../db/supabase';
import JobLink from '../../jobs/JobLink';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import ApplicationResume from './ApplicationResume';
import CompanyApplications from './CompanyApplications';
import useApplicationsForJobSeeker from './useApplicationsForJobSeeker';

const Applications = ({ jobSeekerId }: { jobSeekerId: number }) => {
  const { applications, isPending } = useApplicationsForJobSeeker({
    jobSeekerId
  });
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
        .update({
          status: 'withdrawn',
          updated_at: new Date().toISOString()
        })
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
      <h1>My Applications</h1>
      {isSubmitting && <Modal type="updating" />}
      {isPending && <Modal type="loading" />}
      {error && <JobvanaError error={error} />}
      <div className="flex justify-center">
        {!isPending && (
          <div className="w-3/4 flex flex-col gap-1">
            <table>
              <thead>
                <tr>
                  <th className="min-w-[15%]">Company</th>
                  <th className="min-w-[25%]">Job</th>
                  <th>Applied</th>
                  <th>Status</th>
                  <th className="whitespace-nowrap">Total Applications*</th>
                  <th className="w-[12%] min-w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications?.map((application, idx) => (
                  <tr key={idx} className={idx % 2 === 1 ? 'bg-gray-200' : ''}>
                    <td className="whitespace-nowrap">
                      <CompanyLink {...application.company} />
                    </td>
                    <td className="whitespace-nowrap">
                      <JobLink {...application.job} />
                    </td>
                    <td>
                      <div className="flex justify-center">
                        {new Date(application.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td>
                      <div className="flex justify-center">
                        {_.capitalize(application.status)}
                      </div>
                    </td>
                    <td>
                      <CompanyApplications {...application.company} />
                    </td>
                    <td className="content-center">
                      <div className="flex justify-center text-blue-400 gap-2">
                        <ApplicationResume
                          jobId={application.job_id}
                          resumePath={application.resume_path}
                          setError={setError}
                        />
                        <FaEye className="cursor-pointer" />
                        {(application.status === 'submitted' ||
                          application.status === 'accepted') && (
                          <FaFileCircleXmark
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
            <div className="flex flex-row gap-1 text-sm">
              <div className="text-blue-400 content-center">
                <FaDownload />
              </div>
              = download resume for application
            </div>
            <div className="flex flex-row gap-1 text-sm">
              <div className="text-blue-400 content-center">
                <FaEye />
              </div>
              = view application details
            </div>
            <div className="flex flex-row gap-1 text-sm">
              <div className="text-blue-400 content-center">
                <FaFileCircleXmark />
              </div>
              = withdraw application
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
