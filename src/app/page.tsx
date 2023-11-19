import { IconLogo } from '@/elements/icons/logo';
import { User } from '@/elements/user';
import Link from 'next/link';

const LOGIN_BUTTON_STYLE =
  'text-grey-25 text-xs+ font-bold bg-grey-85 px-4 py-4 xs:py-2 block animate-slide-in rounded-lg shadow-[0_0_12px_#333] dotted-focus dotted-focus-white';

const Page = () => (
  <>
    <nav className="fixed top-4 right-4 z-10 left-4 text-center xs:left-auto">
      <User
        loggedOutComponent={
          <a href="/api/auth/login" className={LOGIN_BUTTON_STYLE}>
            anmelden ➔
          </a>
        }
        loggedInComponent={
          <Link href="/lists" className={LOGIN_BUTTON_STYLE}>
            weiterlernen ➔
          </Link>
        }
        navigateOnSpace
      />
    </nav>
    <main
      className="h-screen w-screen overflow-x-hidden"
      style={{ transformStyle: 'preserve-3d', perspective: '3px' }}
    >
      <div className="relative h-[90vh] z-[-1]">
        <img
          srcSet="/assets/home-536.jpg 600w, /assets/home-1072.jpg 1200w, /assets/home-2144.jpg 2000w"
          className="h-screen w-screen object-cover"
          alt=""
        />
      </div>

      <h1 className="landing-page-title absolute top-[80vh] left-0 right-0 py-20 px-4 mx-auto text-center text-grey-98 font-massive break-words pointer-events-none z-10">
        inemit!
      </h1>

      <div className="absolute top-[80vh] z-[1] w-screen">
        {/* "shard" in light green */}
        <div className="absolute z-[-1] h-[max(500px,50vw)] w-screen bg-primary-100 before:content-[''] before:absolute before:w-0 before:h-0 before:top-[calc(1px-15vw)] before:left-0 before:border-l-[100vw] before:border-l-[transparent] before:border-b-[15vw] before:border-b-primary-100" />
        <div className="absolute top-[calc(40px-2vw)] w-screen flex justify-center">
          <span className="text-grey-98 w-[calc(4rem+6vw)]">
            <IconLogo />
          </span>
        </div>

        {/* "shard" in darker green */}
        <div className="absolute z-[-1] w-screen top-[calc(35vw+120px)] bg-primary-150 px-4 pb-4 before:content-[''] before:absolute before:w-0 before:h-0 before:top-[calc(1px-50vw)] before:left-0 before:border-l-[100vw] before:border-l-[transparent] before:border-b-[50vw] before:border-b-primary-150">
          <div className="relative text-center xs:top-[calc(80px-15vw)]">
            <p className={PARAGRAPH_CLASSES}>
              Lernen heisst
              <br />
              <strong className="font-massive text-grey-98">
                Wiederholen. <em className="text-secondary-50 not-italic">Wiederholen</em>
              </strong>
              <br />
              <em className="text-secondary-50 not-italic">braucht</em>{' '}
              <strong className="font-massive text-grey-98">
                <em className="text-secondary-50 not-italic">Zeit.</em> Zeit
              </strong>{' '}
              spart,
              <br />
              wer effizient lernt.
            </p>
            <p className={PARAGRAPH_CLASSES}>
              <strong className="font-massive text-grey-98">inemit</strong>
              <br />
              hilft, effizient zu lernen.
              <br />
              <Link
                href="/about"
                className="underline text-grey-98 hover:text-secondary-50 dotted-focus-white"
              >
                Wie das?
              </Link>
            </p>
            <p className={PARAGRAPH_CLASSES}>
              <User
                loggedOutComponent={
                  <a
                    href="/api/auth/login"
                    className="leading-normal underline text-grey-98 hover:text-secondary-50 dotted-focus-white"
                  >
                    Anmelden oder registrieren
                  </a>
                }
                loggedInComponent={
                  <Link
                    href="/lists"
                    className="leading-normal underline text-grey-98 hover:text-secondary-50 dotted-focus-white"
                  >
                    Anmelden oder registrieren
                  </Link>
                }
              />
            </p>
          </div>
        </div>
      </div>
    </main>
  </>
);

export default Page;

export const runtime = 'edge';

const PARAGRAPH_CLASSES = 'leading-normal text-grey-98 my-[1em] text-md sm:text-lg md:text-xl';
