import { Hints } from '../models';
import { useStore } from '../store';
import { useApi } from './use-api';

export const useSettings = () => {
  const { dismissHint } = useApi();
  const { settings, dispatch } = useStore();

  const hintDismissed = (hint: Hints) => settings.dismissedHints[hint];

  const onDismissHint = async (hint: Hints) => {
    try {
      await dismissHint(hint);
      dispatch({
        settings: {
          ...settings,
          dismissedHints: { ...settings.dismissedHints, [hint]: true },
        },
      });
    } catch {
      console.error('Failed to set hint dismissed', hint);
    }
  };

  return {
    hintDismissed,
    onDismissHint,
  };
};
