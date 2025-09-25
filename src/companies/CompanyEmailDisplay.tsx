import type { Company } from '../types';

export type CompanyEmailDisplayProps = Pick<Company, 'contact_email'>;

const CompanyEmailDisplay = ({ contact_email }: CompanyEmailDisplayProps) => {
  return (
    <div>
      {contact_email && <a href={`mailto:${contact_email}`}>{contact_email}</a>}
    </div>
  );
};

export default CompanyEmailDisplay;
