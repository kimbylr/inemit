import { FC } from 'react';
import { useLocation } from 'react-router-dom';

const useIsUnapproved = () => {
  const params = new URLSearchParams(useLocation().search);

  return (
    params.get('error') === 'unauthorized' && params.get('error_description')?.includes('approved')
  );
};

export const NotificationBar: FC = () => {
  const unapproved = useIsUnapproved();

  if (!unapproved) {
    return null;
  }

  return (
    <div className="w-full p-2 bg-negative-75 text-center select-none">
      Deine Registrierung muss von einem Administrator bestätigt werden. Du wirst per E-Mail
      benachrichtigt.
    </div>
  );
};
