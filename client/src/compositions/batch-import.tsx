import React, { FC, useState } from 'react';
import { Button } from '../elements/button';
import { Checkbox } from '../elements/checkbox';
import { Textarea } from '../elements/textarea';
import { useApi } from '../hooks/use-api';
import { BaseLearnItem, ExcludesNull, LearnItem } from '../models';

const PLACEHOLDER = `to learn	lernen
to know	wissen
language	Sprache
…`;

const successNotice = (count: number, stage: 1 | 3) =>
  `Import erfolgreich. ${
    count === 1 ? '1 Aufgabe wurde' : `${count} Aufgaben wurden`
  } zu Fach ${stage} hinzugefügt.`;

interface Props {
  listId: string;
  onBatchImportDone(items: LearnItem[]): void;
}

export const BatchImport: FC<Props> = ({ listId, onBatchImportDone }) => {
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [stage3, setStage3] = useState(false);
  const { addItems } = useApi();

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
      onBatchImportDone(items);
      setText('');
      setStage3(false);
      alert(successNotice(items.length, stage));
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <form className="flex flex-col items-end font-light">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={PLACEHOLDER.replaceAll(
          '\n',
          `                                                   `,
        )} // ohai Safari
        disabled={disabled}
        rows={5}
        className="mb-5 m-h-20"
      />
      <div className="flex justify-between flex-col items-end">
        <div className='"pt-0.5 mr-4 mb-4"'>
          <Checkbox checked={stage3} onCheck={() => setStage3((s) => !s)}>
            Vokabeln sind mir schon bekannt und ich möchte sie direkt ins 3. Fach
            importieren.
          </Checkbox>
        </div>

        <Button type="submit" disabled={disabled} onClick={submit}>
          importieren
        </Button>
      </div>
    </form>
  );
};

// TODO: more info about wrong formatting
const parseList = (lines: string): BaseLearnItem[] | null => {
  const items = lines
    .split('\n')
    .filter(Boolean)
    .map(splitByTab)
    .filter(Boolean as any as ExcludesNull);

  if (!items || items.length === 0) {
    return null;
  }

  return items;
};

const splitByTab = (line: string): BaseLearnItem | null => {
  const [solution, prompt] = line.split('\t').filter(Boolean);

  if (!solution || !prompt) {
    return null;
  }

  return { solution, prompt };
};
