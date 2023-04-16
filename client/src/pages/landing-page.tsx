import { FC, useEffect } from 'react';
import { Icon } from '../elements/icon';
import { Link } from '../elements/link';
import { Spinner } from '../elements/spinner';
import { useAuth } from '../helpers/auth';
import { useApi } from '../hooks/use-api';
import { useLists } from '../hooks/use-lists';

export const LandingPage: FC = () => {
  const { login } = useAuth();
  const { state, fetchLists } = useLists(); // trigger initial fetching of lists + redirect to last learnt if logged in
  const { ping } = useApi();

  useEffect(() => {
    if (state === 'initial') {
      ping();
    }
  }, []);

  if (state === 'loading') {
    return (
      <div className="h-screen w-screen grid place-items-center">
        <Spinner />
      </div>
    );
  }

  const enter = state === 'loaded' ? fetchLists : login;

  return (
    <div
      className="h-screen w-screen overflow-x-hidden"
      style={{ transformStyle: 'preserve-3d', perspective: '3px' }}
    >
      <div className="relative h-[90vh] z-[-1]">
        <img
          srcSet="assets/home-536.jpg 600w, assets/home-1072.jpg 1200w, assets/home-2144.jpg 2000w"
          className="h-screen w-screen object-cover"
        />
      </div>

      <h1 className="landing-page-title absolute top-[80vh] left-0 right-0 py-20 px-4 mx-auto text-center text-grey-98 font-massive break-words pointer-events-none z-10">
        inemit!
      </h1>

      <div className="absolute top-[80vh] z-[1] w-screen">
        {/* "shard" in light green */}
        <div className="absolute z-[-1] h-[max(500px,50vw)] w-screen bg-primary-100 before:content-[''] before:absolute before:w-0 before:h-0 before:top-[calc(1px-15vw)] before:left-0 before:border-l-[100vw] before:border-l-[transparent] before:border-b-[15vw] before:border-b-primary-100" />
        <div className="absolute top-[calc(40px-2vw)] w-screen flex justify-center">
          <button onClick={enter} className="text-grey-98 w-[calc(4rem+6vw)]">
            <Icon type="logo" />
          </button>
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
              <Link to="/about" className="!text-grey-98 hover:!text-secondary-50">
                Wie das?
              </Link>
            </p>
            <p className={PARAGRAPH_CLASSES}>
              <button
                onClick={enter}
                className="leading-normal underline text-grey-98 hover:text-secondary-50"
              >
                Anmelden oder registrieren
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const PARAGRAPH_CLASSES =
  'leading-normal text-grey-98 my-[1em] text-md sm:text-lg md:text-xl';
