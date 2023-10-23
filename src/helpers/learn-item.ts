import { LearnItem, LearnItemEditFields } from '@/types/types';

export const getLearnItemEditFields = ({
  prompt,
  promptAddition,
  solution,
  flagged,
  image,
}: Pick<
  LearnItem,
  'prompt' | 'promptAddition' | 'solution' | 'flagged' | 'image'
>): LearnItemEditFields => ({
  prompt,
  promptAddition,
  solution,
  flagged,
  image,
});
