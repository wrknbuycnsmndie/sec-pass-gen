import { Hero } from '@/components/widgets/Hero';
import { PasswordGenerator } from '@/components/widgets/PasswordGenerator';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Password Generator — wrknbuycnsmndie</title>
        <meta
          name='description'
          content='A simple password generator application. Author — @wrknbuycnsmndie'
        />
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />

        <meta
          name='keywords'
          content='password, password generator, secure password, security, security tool'
        />
        <meta name='author' content='wrknbuycnsmndie' />
        <meta property='og:title' content='Password Generator' />
        <meta
          property='og:description'
          content='A simple password generator application. Author — @wrknbuycnsmndie'
        />
        <meta property='og:image' content='/secgenpassword.png' />
        <meta property='og:type' content='website' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content='Password Generator' />
        <meta
          name='twitter:description'
          content='A simple password generator application. Author — @wrknbuycnsmndie'
        />
        <meta name='twitter:image' content='/secgenpassword.png' />
        <meta name='twitter:site' content='@wrknbuycnsmndie' />
        <meta name='twitter:creator' content='@wrknbuycnsmndie' />
      </Head>

      <div className='min-h-screen flex flex-col items-center justify-center '>
        <div className='w-full max-w-6xl flex flex-col gap-8 md:gap-12'>
          <Hero />
          <PasswordGenerator />
        </div>
      </div>
    </div>
  );
}
