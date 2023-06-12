import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { OutlineButton } from '../elements/button';
import { Icon } from '../elements/icon';
import { Spinner } from '../elements/spinner';
import { useAuth } from '../helpers/auth';
import { useApi } from '../hooks/use-api';
import { useLists } from '../hooks/use-lists';
import { useRouting } from '../hooks/use-routing';
import { ExpandableArea } from './expandable-area';

export const Menu: FC = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const { lists, state, storeList } = useLists();
  const { goToList, slug, getListPath } = useRouting();
  const { addList } = useApi();

  if (!user) {
    return null;
  }

  if (state === 'loading' || state === 'initial') {
    return (
      <Nav>
        <Spinner small white />
      </Nav>
    );
  }

  if (state === 'error') {
    return (
      <Nav>
        <div className="my-2 text-center w-full flex flex-col items-center">
          <h3 className="font-bold text-sm my-2">Habemus Fehler 🙄</h3>
          <OutlineButton onClick={() => window.location.reload()}>Neu laden</OutlineButton>
        </div>
      </Nav>
    );
  }

  const hasLists = lists.length > 0;
  const inactiveLists = lists.filter((list) => list.slug !== slug);
  const activeList = slug && lists.find((list) => list.slug === slug);

  const onAddList = async () => {
    const name = prompt('Name der neuen Liste:');

    if (!name) {
      return;
    }

    try {
      const list = await addList(name);
      storeList(list);
      goToList(list.slug, 'edit');
      setOpen(false);
    } catch {
      console.error('Could not add list'); // TODO
    }
  };

  return (
    <Nav>
      <ExpandableArea
        canExpand={hasLists}
        state={[open, setOpen]}
        teaserStyles="mb-2 text-primary-150 hover:text-grey-25 group"
        teaser={
          <h3 className="font-bold text-sm mt-2 mb-1 group-hover:text-grey-25">
            {!hasLists && (
              <OutlineButton onClick={onAddList}>
                <Icon type="addList" width="14px" /> Neue Liste
              </OutlineButton>
            )}
            {hasLists && !activeList && 'Liste auswählen...'}
            {hasLists && activeList && activeList.name}
          </h3>
        }
      >
        {hasLists && (
          <ul className="flex flex-col items-center gap-4 py-2">
            {inactiveLists.map((list) => (
              <li key={list.id}>
                <Link
                  to={getListPath(list.slug)}
                  onClick={() => setOpen(false)}
                  className="font-bold text-sm text-primary-150 hover:text-grey-25 dotted-focus dotted-focus-dark"
                >
                  {list.name}
                </Link>
              </li>
            ))}
            <li>
              <OutlineButton onClick={onAddList}>
                <Icon type="addList" width="14px" /> Neue Liste
              </OutlineButton>
            </li>
          </ul>
        )}

        <div className="pt-4 pb-2 flex justify-center">
          <OutlineButton caution onClick={logout}>
            Logout
          </OutlineButton>
        </div>
      </ExpandableArea>
    </Nav>
  );
};

const Nav: FC<{ children: React.ReactNode }> = ({ children }) => (
  <nav className="w-full pt-3 px-1 pb-2 flex justify-center bg-gradient-to-b from-secondary-50 to-primary-50 relative overflow-hidden">
    <div className="absolute pointer-events-none -inset-5 top-0 shadow-[inset_0_0_10px_#000]" />
    {children}
  </nav>
);
