import { redirect } from 'next/navigation';

export default function RootPage() {
  // This instantly pushes the user to localhost:3000/dashboard
  redirect('/login');
}