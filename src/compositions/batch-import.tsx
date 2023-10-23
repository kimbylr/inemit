import { addItems } from '@/db/actions';
import { Button } from '@/elements/button';
import { Checkbox } from '@/elements/checkbox';
import { Textarea } from '@/elements/textarea';
import { isTruthy } from '@/helpers/is-truthy';
import { LearnItem } from '@/types/types';
import React, { FC, useState } from 'react';

const PLACEHOLDER = `to learn		lernen
to know		wissen
language		Sprache
…					…`;

const successNotice = (count: number, stage: 1 | 3) =>
  `Import erfolgreich. ${
    count === 1 ? '1 Aufgabe wurde' : `${count} Aufgaben wurden`
  } zu Fach ${stage} hinzugefügt.`;

interface Props {
  listId: string;
  onBatchImportDone?: (items: LearnItem[]) => void;
}

export const BatchImport: FC<Props> = ({ listId, onBatchImportDone }) => {
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [stage3, setStage3] = useState(false);

  const submit = async (event: React.MouseEvent) => {
    event.preventDefault();

    const parsedItems = parseList(text);
    if (!parsedItems) {
      alert('Keine Vokabelpaare gefunden.');
      return;
    }

    setDisabled(true);
    try {
      const stage = stage3 ? 3 : 1;
      const items = await addItems({ listId, items: parsedItems, stage });
      if (!items) throw new Error();

      setText('');
      setStage3(false);
      alert(successNotice(items.length, stage));
      onBatchImportDone?.(items);
    } catch (error) {
      alert('Das hat leider nicht funktioniert.');
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <form className="flex flex-col items-end font-light">
      <div className="mb-6 mt-2 self-stretch">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={PLACEHOLDER.replaceAll('\n', ' '.repeat(99))} // ohai Safari
          disabled={disabled}
          rows={10}
        />
      </div>
      <div className="flex justify-between flex-col items-end">
        <div className="mr-4 mb-4">
          <Checkbox checked={stage3} onCheck={() => setStage3((s) => !s)}>
            Die Vokabeln sind mir schon bekannt und ich möchte sie direkt ins 3. Fach importieren.
          </Checkbox>
        </div>

        <Button type="submit" disabled={disabled} onClick={submit} primary>
          importieren
        </Button>
      </div>
    </form>
  );
};

// TODO: more info about wrong formatting
const parseList = (lines: string): Record<'prompt' | 'solution', string>[] | null => {
  const items = lines.split('\n').filter(isTruthy).map(splitByTab).filter(isTruthy);

  if (!items || items.length === 0) {
    return null;
  }

  return items;
};

const splitByTab = (line: string): Record<'prompt' | 'solution', string> | null => {
  const [solution, prompt] = line.split('\t').filter(isTruthy);

  if (!solution || !prompt) {
    return null;
  }

  return { solution, prompt };
};
