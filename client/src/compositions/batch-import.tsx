import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Button } from '../elements/button';
import { Textarea } from '../elements/textarea';
import { useApi } from '../hooks/use-api';
import { BaseLearnItem, ExcludesNull, LearnItem } from '../models';

const PLACEHOLDER = `to learn	lernen
…	…`;

interface Props {
  listId: string;
  onBatchImportDone(items: LearnItem[]): void;
}

export const BatchImport: FC<Props> = ({ listId, onBatchImportDone }) => {
  const [text, setText] = useState('');
  const [disabled, setDisabled] = useState(false);
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
      const items = await addItems({ listId, items: parsedItems });
      onBatchImportDone(items);
      setText('');
    } catch (error) {
      console.error(error);
    } finally {
      setDisabled(false);
    }
  };

  return (
    <Container>
      <TextareaWithSpacing
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={PLACEHOLDER}
        disabled={disabled}
        rows={5}
      />
      <Button type="submit" disabled={disabled} onClick={submit}>
        importieren
      </Button>
    </Container>
  );
};

const TextareaWithSpacing = styled(Textarea)`
  margin-bottom: 20px;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  min-height: 100px;
`;

const Container = styled.form`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// TODO: more info about wrong formatting
const parseList = (lines: string): BaseLearnItem[] | null => {
  const items = lines
    .split('\n')
    .filter(Boolean)
    .map(splitByTab)
    .filter((Boolean as any) as ExcludesNull);

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
