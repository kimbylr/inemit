import { FC, useState } from 'react';
import styled from 'styled-components';
import { Header } from '../components/header';
import { Main } from '../components/main';
import { Button } from '../elements/button';
import { Icon } from '../elements/icon';
import { TextField } from '../elements/text-field';
import { useApi } from '../hooks/use-api';
import { AppleDevices, useInstallPWA } from '../hooks/use-install-pwa';
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
          <Form
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
            <SubmitButton primary disabled={submitting}>
              Los!
            </SubmitButton>
          </Form>
          <p className="text-negative-100">{error}</p>
        </PageLayout>
      </Main>

      {(handleInstall || appleDevice) && (
        <InstallPWABubble appleDevice={appleDevice}>
          <div>inemit macht sich auch gut auf dem Homescreen 😉</div>
          <Spacer />
          {handleInstall && (
            <div>
              <Button onClick={handleInstall}>Installieren</Button>
            </div>
          )}
          {appleDevice && (
            <div>
              Klick auf <Icon type="iOSShare" width="14px" /> und füg es dem Homescreen
              hinzu <Icon type="iOSHomescreen" width="14px" />
            </div>
          )}
        </InstallPWABubble>
      )}
    </>
  );
};

const Form = styled.form`
  display: flex;
  align-items: flex-start;
`;

const SubmitButton = styled(Button)`
  margin: 0 0 0 1rem;
`;

const Spacer = styled.div`
  height: 1rem;
`;

const InstallPWABubble = styled.div<{ appleDevice: AppleDevices }>`
  position: absolute;
  text-align: center;
  ${({ appleDevice }) => (appleDevice === 'iPad' ? 'top: 0' : 'bottom: 0')};
  right: 0;
  width: ${({ appleDevice }) => (appleDevice === 'iPad' ? '240px' : 'calc(100% - 2rem)')};
  box-sizing: border-box;
  margin: 1rem 1rem ${({ appleDevice }) => (appleDevice === 'iPhone' ? '2rem' : '1rem')};
  display: flex;
  flex-direction: column;

  border-radius: 4px;
  padding: 1rem;
  overflow-wrap: break-word;

  background: ${({ theme: { colors } }) => colors.primary[10]};
  border: 3px solid ${({ theme: { colors } }) => colors.primary[100]};

  font-weight: ${({ theme: { font } }) => font.weights.light};
  font-size: ${({ theme: { font } }) => font.sizes.sm};
  color: ${({ theme: { colors } }) => colors.primary[150]};
  fill: ${({ theme: { colors } }) => colors.grey[10]};

  outline: none;
  cursor: pointer;

  /** triangle */
  ${({ appleDevice, theme: { colors } }) =>
    appleDevice === 'iPhone'
      ? ` ::after,
          ::before {
            top: 100%;
            left: 50%;
            border: solid transparent;
            content: '';
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
            border-color: rgba(0, 0, 0, 0);
          }

          ::after {
            border-top-color: ${colors.primary[10]};
            border-width: 12px;
            margin-left: -12px;
          }
          /** border */
          ::before {
            border-color: rgba(131, 245, 0, 0);
            border-top-color: ${colors.primary[100]};
            border-width: 16px;
            margin-left: -16px;
          }
        `
      : appleDevice === 'iPad'
      ? ` ::after,
          ::before {
            bottom: 100%;
            left: 50%;
            border: solid transparent;
            content: '';
            height: 0;
            width: 0;
            position: absolute;
            pointer-events: none;
            border-color: rgba(0, 0, 0, 0);
          }

          ::after {
            border-bottom-color: ${colors.primary[10]};
            border-width: 12px;
            margin-left: -12px;
          }
          /** border */
          ::before {
            border-color: rgba(131, 245, 0, 0);
            border-bottom-color: ${colors.primary[100]};
            border-width: 16px;
            margin-left: -16px;
          }
        `
      : ''}
`;
