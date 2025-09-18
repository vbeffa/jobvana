import { createFileRoute } from '@tanstack/react-router';
import Account from '../account/Account';

export const Route = createFileRoute('/jobvana/account/')({
  component: Account
});
