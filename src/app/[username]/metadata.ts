import { Metadata } from 'next';

interface Props {
  params: {
    username: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;

  return {
    title: `@${username} - Twilsta`,
    description: `View ${username}'s profile on Twilsta`,
    openGraph: {
      title: `@${username} - Twilsta`,
      description: `View ${username}'s profile on Twilsta`,
    },
  };
}
