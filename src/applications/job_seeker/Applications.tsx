import { useEffect, useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import ResourceDetailsContainer from '../../containers/ResourceDetailsContainer';
import ResourceListContainer from '../../containers/ResourceListContainer';
import ResourcesContainer from '../../containers/ResourcesContainer';
import SummaryCardsContainer from '../../containers/SummaryCardsContainer';
import JobvanaError from '../../JobvanaError';
import Modal from '../../Modal';
import PageNav from '../../PageNav';
import SummaryCard from '../../SummaryCard';
import { formatDate } from '../../utils';
import Status from '../Status';
import StatusSelect from '../StatusSelect';
import ApplicationDetails from './ApplicationDetails';
import useApplications, {
  type ApplicationsParams,
  type SearchFilters
} from './useApplications';

const Applications = ({ jobSeekerId }: { jobSeekerId: number }) => {
  const [page, setPage] = useState<number>(1);
  const [debouncePage, setDebouncePage] = useState(false);
  const [debouncedPage] = useDebounce(page, debouncePage ? 500 : 0);
  const paging: ApplicationsParams['paging'] = useMemo(
    () => ({ page: debouncedPage, pageSize: 10 }),
    [debouncedPage]
  );
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    jobSeekerId,
    status: 'all'
  });
  const [applicationId, setApplicationId] = useState<number | null>(null);

  const { applications, isPending, isPlaceholderData, total, error } =
    useApplications({
      paging,
      filters: searchFilters
    });

  useEffect(() => {
    if (!applications?.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setApplicationId(null);
    } else if (
      !applicationId ||
      !applications.find((app) => app.id === applicationId)
    ) {
      setApplicationId(applications[0].id);
    }
  }, [applicationId, applications]);

  return (
    <>
      {/* <h1>My Applications</h1> */}
      <div className="w-full flex justify-center pb-2">
        <div className="w-[85%] flex justify-end">
          <StatusSelect
            status={searchFilters.status}
            onChange={(status) => {
              setSearchFilters({
                ...searchFilters,
                status
              });
            }}
          />
        </div>
      </div>
      <ResourcesContainer hasFilters={true}>
        <ResourceListContainer width="w-[25%]">
          {/* <SummaryCard
            selected={searchFilters.status === 'all'}
            onClick={() => setSearchFilters({ jobSeekerId, status: 'all' })}
            title="All"
            text={
              applications !== undefined ? 'All applications' : 'Loading...'
            }
            borderBottom={true}
          />
          <SummaryCard
            selected={searchFilters.status === 'submitted'}
            onClick={() =>
              setSearchFilters({ jobSeekerId, status: 'submitted' })
            }
            title="Submitted"
            text={
              applications !== undefined ? (
                <div className="flex flex-row items-center gap-1">
                  <FaPaperPlane /> submitted applications
                </div>
              ) : (
                'Loading...'
              )
            }
            borderBottom={true}
          />
          <SummaryCard
            selected={searchFilters.status === 'accepted'}
            onClick={() =>
              setSearchFilters({ jobSeekerId, status: 'accepted' })
            }
            title="Accepted"
            text={
              applications !== undefined ? (
                <div className="flex flex-row items-center gap-1">
                  <FaCircleCheck /> accepted applications
                </div>
              ) : (
                'Loading...'
              )
            }
            borderBottom={true}
          />
          <SummaryCard
            selected={searchFilters.status === 'withdrawn'}
            onClick={() =>
              setSearchFilters({ jobSeekerId, status: 'withdrawn' })
            }
            title="Withdrawn"
            text={
              applications !== undefined ? (
                <div className="flex flex-row items-center gap-1">
                  <PiHandWithdraw /> withdrawn applications
                </div>
              ) : (
                'Loading...'
              )
            }
            borderBottom={true}
          />
          <SummaryCard
            selected={searchFilters.status === 'declined'}
            onClick={() =>
              setSearchFilters({ jobSeekerId, status: 'declined' })
            }
            title="Declined"
            text={
              applications !== undefined ? (
                <div className="flex flex-row items-center gap-1">
                  <FaRegCircleXmark /> withdrawn applications
                </div>
              ) : (
                'Loading...'
              )
            }
            borderBottom={true}
          /> */}
          <PageNav
            page={page}
            total={total}
            onSetPage={(page, debounce) => {
              setPage(page);
              setDebouncePage(debounce);
            }}
            isLoading={isPlaceholderData || isPending}
            type="applications"
          />
          <SummaryCardsContainer hasTitle={true}>
            {applications
              ? applications.map((application, idx) => {
                  return (
                    <SummaryCard
                      key={idx}
                      selected={applicationId === application.id}
                      onClick={() => setApplicationId(application.id)}
                      title={application.job.title}
                      text={
                        <>
                          <div className="flex justify-between pr-1">
                            <span className="truncate">
                              {application.company.name}
                            </span>
                            <span className="flex flex-row gap-1 items-center">
                              {formatDate(
                                new Date(
                                  application.updated_at ??
                                    application.created_at
                                )
                              )}
                            </span>
                          </div>
                          <div>
                            <Status {...application} />
                          </div>
                        </>
                      }
                      borderBottom={idx < applications.length - 1}
                    />
                  );
                })
              : []}
          </SummaryCardsContainer>
        </ResourceListContainer>
        <ResourceDetailsContainer>
          <>
            {(isPending || isPlaceholderData) && <Modal type="loading" />}
            {error && <JobvanaError error={error} />}
            {applicationId ? (
              <ApplicationDetails id={applicationId} />
            ) : undefined}
            {/* <div className="h-full flex justify-center pb-4">
              <div className="w-full flex flex-col justify-between">
                <div className="border-[0.5px] border-blue-400 rounded-lg h-full flex flex-col justify-between">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th>Company</th>
                        <th>Job</th>
                        <th>Applied</th>
                        <th>Status</th>
                        <th>Applications</th>
                        <th className="w-24 min-w-24">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications?.map((application, idx) => (
                        <tr
                          key={idx}
                          className={idx % 2 === 1 ? 'bg-gray-200' : ''}
                        >
                          <td>
                            <CompanyLink {...application.company} />
                          </td>
                          <td>
                            <JobLink {...application.job} />
                          </td>
                          <td>
                            <div className="flex justify-center px-2">
                              {new Date(
                                application.created_at
                              ).toLocaleDateString()}
                            </div>
                          </td>
                          <td>
                            <div className="px-2">
                              <Status {...application} />
                            </div>
                          </td>
                          <td>
                            <JobApplications
                              jobId={application.job_id}
                              jobInterviewProcess={
                                application.interview_process
                              }
                              doRefetch={doRefetch === application.id}
                            />
                          </td>
                          <td>
                            <div className="flex pl-4 text-blue-400 gap-2">
                              <ApplicationResume
                                resumePath={application.resumePath}
                                setIsDownloading={setIsDownloading}
                                setError={setError}
                              />
                              <Link
                                to="/jobvana/applications/$id"
                                params={{ id: application.id.toString() }}
                              >
                                <FaEye />
                              </Link>
                              {application.status === 'submitted' && (
                                <FaX
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
                  {(total ?? 0) >= 0 && (
                    <PageNav
                      page={page}
                      total={total}
                      onSetPage={(page, debounce) => {
                        setPage(page);
                        setDebouncePage(debounce);
                      }}
                      isLoading={isPlaceholderData || isPending}
                      type={(() => {
                        switch (searchFilters.status) {
                          case 'all':
                            return 'applications';
                          default:
                            return (searchFilters.status +
                              ' ' +
                              'applications') as NavType;
                        }
                      })()}
                      borderBottom={false}
                    />
                  )}
                </div>
                <div className="border-[0.5px] border-blue-400 rounded-lg p-2 mt-4">
                  <div className="flex justify-center font-bold">Notes</div>
                  <div className="-mx-2 my-4 border-b-[0.5px] border-blue-300" />
                  <div className="flex flex-row text-sm gap-2">
                    <div className="content-center">Applications</div>
                    <div className="content-center">=</div>
                    <div>
                      <div className="border-b-[0.5px]">
                        Number of submitted or accepted applications for job
                      </div>
                      <div className="border-t-[0.5px] flex justify-center">
                        Job pipeline size
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row gap-1 text-sm">
                    <div className="text-blue-400 content-center">
                      <FaArrowUpRightFromSquare />
                    </div>
                    = open resume for application in new tab
                  </div>
                  <div className="flex flex-row gap-1 text-sm">
                    <div className="text-blue-400 content-center">
                      <FaEye />
                    </div>
                    = view application details
                  </div>
                  <div className="flex flex-row gap-1 text-sm">
                    <div className="text-blue-400 content-center">
                      <FaX />
                    </div>
                    = withdraw application
                  </div>
                </div>
              </div>
            </div> */}
          </>
        </ResourceDetailsContainer>
      </ResourcesContainer>
    </>
  );
};

export default Applications;
