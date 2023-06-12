import { FC, useState } from 'react';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { TextField } from '../elements/text-field';
import { useApi } from '../hooks/use-api';
import { useInstallPWA } from '../hooks/use-install-pwa';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { PageLayout } from '../layout/page-layout';

export const Start: FC = () => {
  const { handleInstall, appleDevice } = useInstallPWA();
  const { storeList } = useLists();
  const { addList } = useApi();
  const { goToList } = useRouting();

  const [listName, setListName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!listName) {
      setError('Nur Mut! Den Namen kannst du später wieder ändern.');
      return;
    }

    setSubmitting(true);
    try {
      const list = await addList(listName);
      storeList(list);
      goToList(list.slug, 'edit');
    } catch (e) {
      console.error(e);
      setError('Ups! Das hat nicht funktioniert.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <Main>
        <PageLayout>
          <h2 className="mb-6">Schön bist du da!</h2>
          <p className={`mb-4 ${appleDevice === 'iPad' ? 'w-[480px]' : ''}`}>
            Was möchtest du lernen? (Das wird der Name deiner ersten Liste.)
          </p>
          <form
            className="flex items-start gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
          >
            <TextField
              value={listName}
              placeholder="Italienisch"
              onChange={(e) => setListName(e.target.value)}
              className="max-w-[300px]"
            />
            <Button primary disabled={submitting}>
              Los!
            </Button>
          </form>
          <p className="text-negative-100">{error}</p>
        </PageLayout>
      </Main>

      {(handleInstall || appleDevice) && (
        <div
          className={`absolute flex flex-col rounded p-4 bg-primary-10 border-[3px] right-0 m-4 ${
            appleDevice === 'iPad'
              ? 'top-0 w-60 border-primary-25'
              : 'bottom-0 w-[calc(100%-2rem)] border-primary-100'
          } ${
            appleDevice === 'iPhone' ? 'mb-8' : ''
          } text-center break-words font-light text-sm text-primary-150 fill-grey-10`}
        >
          {/* CSS triangles */}
          {appleDevice === 'iPhone' && (
            <>
              <div className="top-full left-1/2 border-transparent h-0 w-0 absolute pointer-events-none border-t-primary-10 border-[12px] -ml-3" />
              {/* border */}
              <div className="top-full left-1/2 border-transparent h-0 w-0 absolute pointer-events-none border-[16px] -ml-4 border-t-primary-100" />
            </>
          )}
          {appleDevice === 'iPad' && (
            <>
              <div className="bottom-full left-1/2 border-transparent h-0 w-0 absolute pointer-events-none border-b-primary-10 border-[12px] -ml-3" />
              {/* border */}
              <div className="bottom-full left-1/2 border-transparent h-0 w-0 absolute pointer-events-none border-[16px] -ml-4 border-b-primary-25" />
            </>
          )}
          <div>
            So richtig wohl fühlt sich <span className="font-massive">inemit</span> auf dem
            Homescreen 😉
          </div>
          <div className="h-4" />
          {handleInstall && (
            <div>
              <Button onClick={handleInstall}>Installieren</Button>
            </div>
          )}
          {appleDevice && (
            <div>
              Klick auf <Icon type="iOSShare" width="14px" className="inline" /> und füg es dem
              Homescreen hinzu <Icon type="iOSHomescreen" width="14px" className="inline" />
            </div>
          )}
        </div>
      )}
    </>
  );
};
